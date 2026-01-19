"use client";

import { createClient } from "@/lib/supabase/client";
import type { Notification, NotificationType } from "@/types";

type NotificationRow = {
  id: string;
  type: string;
  title: string;
  body: string;
  data: Record<string, any> | null;
  is_read: boolean | null;
  created_at: string | null;
  user_id: string;
};

function mapNotificationType(type: string): NotificationType {
  switch (type) {
    case "approval":
      return "approval_needed";
    case "booking":
      return "booking_confirmed";
    case "reminder":
      return "visit_reminder";
    case "package":
      return "package_expiring";
    case "wallet":
      return "top_up_success";
    case "system":
    default:
      return "general";
  }
}

function mapRowToNotification(row: NotificationRow): Notification {
  const data = row.data || {};
  const approvalRequestId = data.approvalRequestId as string | undefined;
  const actionRoute =
    data.actionRoute ||
    (approvalRequestId ? `/approvals/${approvalRequestId}` : undefined);

  return {
    id: row.id,
    type: mapNotificationType(row.type),
    title: row.title,
    message: row.body,
    timestamp: row.created_at || new Date().toISOString(),
    isRead: row.is_read ?? false,
    actionType: approvalRequestId ? "approve" : "navigate",
    actionRoute,
    relatedId: approvalRequestId,
    facilityName: data.facilityName,
    memberName: data.memberName,
  };
}

export async function fetchNotifications(userId: string): Promise<{
  notifications: Notification[];
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { notifications: [], error: error.message };
    }

    const notifications = (data as NotificationRow[]).map(mapRowToNotification);
    return { notifications };
  } catch (err) {
    return {
      notifications: [],
      error:
        err instanceof Error ? err.message : "Failed to fetch notifications",
    };
  }
}

export async function fetchApprovalNotificationIds(
  userId: string
): Promise<{ ids: Set<string>; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("notifications")
      .select("data")
      .eq("user_id", userId)
      .eq("type", "approval");

    if (error) {
      return { ids: new Set(), error: error.message };
    }

    const ids = new Set<string>();
    (data as NotificationRow[]).forEach((row) => {
      const approvalRequestId = row.data?.approvalRequestId as string | undefined;
      if (approvalRequestId) {
        ids.add(approvalRequestId);
      }
    });

    return { ids };
  } catch (err) {
    return {
      ids: new Set(),
      error:
        err instanceof Error ? err.message : "Failed to fetch notifications",
    };
  }
}

export async function insertApprovalNotification(data: {
  userId: string;
  approvalRequestId: string;
  facilityName: string;
  memberName: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("notifications").insert({
      user_id: data.userId,
      type: "approval",
      title: "Approval needed",
      body: `${data.facilityName} wants to use your package for ${data.memberName}. Tap to review.`,
      data: {
        approvalRequestId: data.approvalRequestId,
        facilityName: data.facilityName,
        memberName: data.memberName,
      },
      is_read: false,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create notification",
    };
  }
}

export async function markNotificationRead(
  id: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update notification",
    };
  }
}

export async function markAllNotificationsRead(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update notifications",
    };
  }
}
