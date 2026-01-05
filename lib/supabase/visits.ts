import { createClient } from "./client";
import type { Database } from "@/types/database";
import type { VisitRecord, VisitStatusType } from "@/types";

type VisitRow = Database["public"]["Tables"]["visits"]["Row"];
type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];
type UserPackageRow = Database["public"]["Tables"]["user_packages"]["Row"];

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
        package:user_packages(
          package_category,
          package_name
        ),
        family_member:family_members(name)
      `)
      .eq("user_id", userId)
      .order("visit_date", { ascending: false });

    if (error) {
      return { visits: [], error: error.message };
    }

    // Transform database rows to VisitRecord format
    const visits: VisitRecord[] = (data || []).map((visit: any) => ({
      id: visit.id,
      memberId: visit.family_member_id || userId,
      memberName: visit.family_member?.name || "Self",
      memberInitials: getInitials(visit.family_member?.name || "Self"),
      isSelf: !visit.family_member_id,
      facilityId: visit.facility_id,
      facilityName: visit.facility?.name || "Unknown Facility",
      packageId: visit.package_id,
      packageCategory: visit.package?.package_category || "General",
      packageName: visit.package?.package_name || "Unknown Package",
      visitDate: visit.visit_date,
      visitTime: visit.visit_time,
      status: visit.status as VisitStatusType,
      copayAmount: visit.copay_amount,
      refundNote: visit.refund_note,
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
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
        package:user_packages(
          package_category,
          package_name
        ),
        family_member:family_members(name)
      `)
      .eq("user_id", userId)
      .in("status", statuses)
      .order("visit_date", { ascending: false });

    if (error) {
      return { visits: [], error: error.message };
    }

    // Transform to VisitRecord format (same as getUserVisits)
    const visits: VisitRecord[] = (data || []).map((visit: any) => ({
      id: visit.id,
      memberId: visit.family_member_id || userId,
      memberName: visit.family_member?.name || "Self",
      memberInitials: getInitials(visit.family_member?.name || "Self"),
      isSelf: !visit.family_member_id,
      facilityId: visit.facility_id,
      facilityName: visit.facility?.name || "Unknown Facility",
      packageId: visit.package_id,
      packageCategory: visit.package?.package_category || "General",
      packageName: visit.package?.package_name || "Unknown Package",
      visitDate: visit.visit_date,
      visitTime: visit.visit_time,
      status: visit.status as VisitStatusType,
      copayAmount: visit.copay_amount,
      refundNote: visit.refund_note,
      createdAt: visit.created_at,
      updatedAt: visit.updated_at,
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
        package:user_packages(
          package_category,
          package_name
        ),
        family_member:family_members(name)
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
      memberId: data.family_member_id || data.user_id,
      memberName: data.family_member?.name || "Self",
      memberInitials: getInitials(data.family_member?.name || "Self"),
      isSelf: !data.family_member_id,
      facilityId: data.facility_id,
      facilityName: data.facility?.name || "Unknown Facility",
      packageId: data.package_id,
      packageCategory: data.package?.package_category || "General",
      packageName: data.package?.package_name || "Unknown Package",
      visitDate: data.visit_date,
      visitTime: data.visit_time,
      status: data.status as VisitStatusType,
      copayAmount: data.copay_amount,
      refundNote: data.refund_note,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
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
