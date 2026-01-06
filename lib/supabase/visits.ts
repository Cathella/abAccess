import { createClient } from "./client";
import type { VisitRecord, VisitStatusType } from "@/types";

function formatVisitTime(visitDate: string): string {
  const date = new Date(visitDate);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

/**
 * Get all visits for a user (including visits for their dependents)
 */
export async function getUserVisits(
  userId: string
): Promise<{ visits: VisitRecord[]; error?: string }> {
  try {
    const supabase = createClient();

    // Get visits for user and their dependents
    const { data, error } = await supabase
      .from("visits")
      .select(`
        *,
        facility:facilities(name),
        user_package:user_packages(
          id,
          user_id,
          package:packages(category, name)
        ),
        dependent:dependents(name)
      `)
      .eq("user_package.user_id", userId)
      .order("visit_date", { ascending: false });

    if (error) {
      return { visits: [], error: error.message };
    }

    // Transform database rows to VisitRecord format
    const visits: VisitRecord[] = (data || []).map((visit: any) => ({
      id: visit.id,
      memberId: visit.dependent_id || userId,
      memberName: visit.dependent?.name || "Self",
      memberInitials: getInitials(visit.dependent?.name || "Self"),
      isSelf: !visit.dependent_id,
      facilityId: visit.facility_id,
      facilityName: visit.facility?.name || "Unknown Facility",
      packageId: visit.user_package_id,
      packageCategory: visit.user_package?.package?.category || "General",
      packageName: visit.user_package?.package?.name || "Unknown Package",
      visitDate: visit.visit_date,
      visitTime: formatVisitTime(visit.visit_date),
      status: visit.status as VisitStatusType,
      copayAmount: undefined,
      refundNote: visit.provider_notes || undefined,
      createdAt: visit.created_at ?? visit.visit_date,
      updatedAt: visit.created_at ?? visit.visit_date,
    }));

    return { visits };
  } catch (err) {
    return {
      visits: [],
      error: err instanceof Error ? err.message : "Failed to fetch visits",
    };
  }
}

/**
 * Get visits filtered by status
 */
export async function getVisitsByStatus(
  userId: string,
  statuses: VisitStatusType[]
): Promise<{ visits: VisitRecord[]; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("visits")
      .select(`
        *,
        facility:facilities(name),
        user_package:user_packages(
          id,
          user_id,
          package:packages(category, name)
        ),
        dependent:dependents(name)
      `)
      .eq("user_package.user_id", userId)
      .in("status", statuses)
      .order("visit_date", { ascending: false });

    if (error) {
      return { visits: [], error: error.message };
    }

    // Transform to VisitRecord format (same as getUserVisits)
    const visits: VisitRecord[] = (data || []).map((visit: any) => ({
      id: visit.id,
      memberId: visit.dependent_id || userId,
      memberName: visit.dependent?.name || "Self",
      memberInitials: getInitials(visit.dependent?.name || "Self"),
      isSelf: !visit.dependent_id,
      facilityId: visit.facility_id,
      facilityName: visit.facility?.name || "Unknown Facility",
      packageId: visit.user_package_id,
      packageCategory: visit.user_package?.package?.category || "General",
      packageName: visit.user_package?.package?.name || "Unknown Package",
      visitDate: visit.visit_date,
      visitTime: formatVisitTime(visit.visit_date),
      status: visit.status as VisitStatusType,
      copayAmount: undefined,
      refundNote: visit.provider_notes || undefined,
      createdAt: visit.created_at ?? visit.visit_date,
      updatedAt: visit.created_at ?? visit.visit_date,
    }));

    return { visits };
  } catch (err) {
    return {
      visits: [],
      error: err instanceof Error ? err.message : "Failed to fetch visits",
    };
  }
}

/**
 * Get upcoming visits (confirmed or pending_confirmation)
 */
export async function getUpcomingVisits(
  userId: string
): Promise<{ visits: VisitRecord[]; error?: string }> {
  return getVisitsByStatus(userId, ["confirmed", "pending_confirmation"]);
}

/**
 * Get completed visits
 */
export async function getCompletedVisits(
  userId: string
): Promise<{ visits: VisitRecord[]; error?: string }> {
  return getVisitsByStatus(userId, ["completed", "remotely_approved"]);
}

/**
 * Get canceled visits
 */
export async function getCanceledVisits(
  userId: string
): Promise<{ visits: VisitRecord[]; error?: string }> {
  return getVisitsByStatus(userId, ["canceled", "no_show"]);
}

/**
 * Create a visit record after a successful redemption
 */
export async function createVisitForRedemption(data: {
  userPackageId: string;
  dependentId?: string | null;
  facilityId?: string | null;
  facilityName?: string;
  visitDate: string;
  status?: VisitStatusType;
  copayPaid?: boolean;
  qrCode: string;
  providerNotes?: string;
}): Promise<{ success: boolean; visitId?: string; error?: string }> {
  try {
    const supabase = createClient();

    let facilityId = data.facilityId || null;

    if (!facilityId) {
      if (!data.facilityName) {
        return { success: false, error: "Facility name is required" };
      }

      const { data: facilities, error: facilityError } = await supabase
        .from("facilities")
        .select("id")
        .ilike("name", data.facilityName)
        .limit(1);

      if (facilityError) {
        return { success: false, error: facilityError.message };
      }

      facilityId = facilities?.[0]?.id || null;
    }

    if (!facilityId) {
      return { success: false, error: "Facility not found" };
    }

    const { data: visit, error } = await supabase
      .from("visits")
      .insert({
        user_package_id: data.userPackageId,
        dependent_id: data.dependentId || null,
        facility_id: facilityId,
        visit_date: data.visitDate,
        status: data.status || "completed",
        copay_paid: data.copayPaid ?? false,
        qr_code: data.qrCode,
        provider_notes: data.providerNotes || null,
      })
      .select("id")
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, visitId: visit.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to create visit",
    };
  }
}

/**
 * Get a single visit by ID
 */
export async function getVisitById(
  visitId: string
): Promise<{ visit: VisitRecord | null; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("visits")
      .select(`
        *,
        facility:facilities(name, address, phone),
        user_package:user_packages(
          id,
          user_id,
          package:packages(category, name)
        ),
        dependent:dependents(name)
      `)
      .eq("id", visitId)
      .single();

    if (error) {
      return { visit: null, error: error.message };
    }

    if (!data) {
      return { visit: null, error: "Visit not found" };
    }

    const visit: VisitRecord = {
      id: data.id,
      memberId: data.dependent_id || data.user_id,
      memberName: data.dependent?.name || "Self",
      memberInitials: getInitials(data.dependent?.name || "Self"),
      isSelf: !data.dependent_id,
      facilityId: data.facility_id,
      facilityName: data.facility?.name || "Unknown Facility",
      packageId: data.user_package_id,
      packageCategory: data.user_package?.package?.category || "General",
      packageName: data.user_package?.package?.name || "Unknown Package",
      visitDate: data.visit_date,
      visitTime: formatVisitTime(data.visit_date),
      status: data.status as VisitStatusType,
      copayAmount: undefined,
      refundNote: data.provider_notes || undefined,
      createdAt: data.created_at ?? data.visit_date,
      updatedAt: data.created_at ?? data.visit_date,
    };

    return { visit };
  } catch (err) {
    return {
      visit: null,
      error: err instanceof Error ? err.message : "Failed to fetch visit",
    };
  }
}

/**
 * Update visit status
 */
export async function updateVisitStatus(
  visitId: string,
  status: VisitStatusType
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("visits")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", visitId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update visit",
    };
  }
}

/**
 * Cancel a visit
 */
export async function cancelVisit(
  visitId: string,
  refundNote?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();

    const { error } = await supabase
      .from("visits")
      .update({
        status: "canceled",
        refund_note: refundNote,
        updated_at: new Date().toISOString(),
      })
      .eq("id", visitId);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to cancel visit",
    };
  }
}

/**
 * Helper function to get initials from name
 */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
