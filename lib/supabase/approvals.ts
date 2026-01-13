import { createClient } from "@/lib/supabase/client";
import { calculateAge } from "@/lib/constants";
import type { PendingApprovalRequest, PendingApprovalStatus } from "@/types";

type ApprovalRow = {
  id: string;
  status: string | null;
  requested_at: string | null;
  responded_at: string | null;
  expires_at: string;
  dependent?: { id: string; name: string; date_of_birth: string } | null;
  facility?: { id: string; name: string } | null;
  user_package?: {
    id: string;
    user_id: string;
    visits_remaining: number;
    status?: string | null;
    expiry_date?: string | null;
    package?: {
      id: string;
      name: string;
      category: string;
      visit_count: number;
      copay: number;
    } | null;
  } | null;
};

function formatCategory(value?: string | null): string {
  if (!value) return "Package";
  return value
    .replace(/[_-]+/g, " ")
    .replace(/([A-Z])/g, " $1")
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function getInitials(name?: string | null) {
  if (!name) return "";
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function mapApprovalRow(row: ApprovalRow): PendingApprovalRequest {
  const dependent = row.dependent;
  const userPackage = row.user_package;
  const packageData = userPackage?.package;
  const status = (row.status || "pending") as PendingApprovalStatus;
  const remainingBefore = userPackage?.visits_remaining ?? 0;
  const remainingAfter = Math.max(remainingBefore - 1, 0);
  const totalVisits = packageData?.visit_count ?? remainingBefore;
  const categoryLabel = formatCategory(packageData?.category);
  const memberAge = dependent?.date_of_birth
    ? calculateAge(dependent.date_of_birth)
    : undefined;

  return {
    id: row.id,
    memberId: dependent?.id || "",
    memberName: dependent?.name || "Member",
    memberAge,
    memberInitials: getInitials(dependent?.name),
    facilityId: row.facility?.id || "",
    facilityName: row.facility?.name || "Facility",
    packageId: packageData?.id || userPackage?.id || "",
    packageCategory: categoryLabel,
    packageName: packageData?.name || "Package",
    copay: packageData?.copay ?? 0,
    remainingBefore,
    remainingAfter,
    totalVisits,
    requestedAt: row.requested_at || new Date().toISOString(),
    expiresAt: row.expires_at,
    status,
  };
}

export async function getApprovalRequestsForUser(
  userId: string
): Promise<{ requests: PendingApprovalRequest[]; error?: string }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("approval_requests")
      .select(
        `
        id,
        status,
        requested_at,
        responded_at,
        expires_at,
        dependent:dependents(id, name, date_of_birth),
        facility:facilities(id, name),
        user_package:user_packages(
          id,
          user_id,
          visits_remaining,
          status,
          expiry_date,
          package:packages(id, name, category, visit_count, copay)
        )
      `
      )
      .eq("user_package.user_id", userId)
      .order("requested_at", { ascending: false });

    if (error) {
      return { requests: [], error: error.message };
    }

    const now = Date.now();
    const requests = (data as ApprovalRow[]).map((row) => {
      const mapped = mapApprovalRow(row);
      const expiry = new Date(row.expires_at).getTime();
      const packageExpired = row.user_package?.expiry_date
        ? new Date(row.user_package.expiry_date).getTime() < now
        : false;
      const packageInactive =
        row.user_package?.status &&
        row.user_package.status !== "active";

      if (mapped.status === "pending" && expiry <= now) {
        mapped.status = "expired";
      }

      if (mapped.status === "pending" && (packageExpired || packageInactive)) {
        mapped.status = "cancelled";
      }

      return mapped;
    });

    return { requests };
  } catch (err) {
    return {
      requests: [],
      error: err instanceof Error ? err.message : "Failed to load approvals",
    };
  }
}

export async function updateApprovalStatus(
  id: string,
  status: PendingApprovalStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = createClient();
    const { error } = await supabase
      .from("approval_requests")
      .update({
        status: status === "cancelled" ? "expired" : status,
        responded_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to update status",
    };
  }
}

export async function getApprovalRequestStatus(id: string): Promise<{
  status?: PendingApprovalStatus;
  expiresAt?: string;
  packageStatus?: string | null;
  packageExpiry?: string | null;
  error?: string;
}> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("approval_requests")
      .select(
        `
        status,
        expires_at,
        user_package:user_packages(status, expiry_date)
      `
      )
      .eq("id", id)
      .maybeSingle();

    if (error) {
      return { error: error.message };
    }

    return {
      status: data?.status as PendingApprovalStatus | undefined,
      expiresAt: data?.expires_at,
      packageStatus: data?.user_package?.status ?? null,
      packageExpiry: data?.user_package?.expiry_date ?? null,
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to fetch request",
    };
  }
}
