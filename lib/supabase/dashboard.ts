import { createClient } from "./client";
import type { Database } from "@/types/database";

type WalletRow = Database["public"]["Tables"]["wallets"]["Row"];
type FamilyMemberRow = Database["public"]["Tables"]["family_members"]["Row"];
type UserPackageRow = Database["public"]["Tables"]["user_packages"]["Row"];
type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];

/**
 * Get user's wallet balance
 */
export async function getWalletBalance(
  userId: string
): Promise<{ balance: number; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("wallets")
      .select("balance")
      .eq("user_id", userId)
      .single<WalletRow>();

    if (error) {
      // If wallet doesn't exist, create one with 0 balance
      if (error.code === "PGRST116") {
        const { data: newWallet, error: createError } = await supabase
          .from("wallets")
          .insert({ user_id: userId, balance: 0 })
          .select("balance")
          .single<WalletRow>();

        if (createError) {
          return { balance: 0, error: createError.message };
        }

        return { balance: newWallet?.balance || 0 };
      }

      return { balance: 0, error: error.message };
    }

    return { balance: data?.balance || 0 };
  } catch (error) {
    return {
      balance: 0,
      error: error instanceof Error ? error.message : "Failed to fetch wallet balance",
    };
  }
}

/**
 * Get count of user's family members/dependents
 */
export async function getFamilyMembersCount(
  userId: string
): Promise<{ count: number; error?: string }> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("family_members")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId);

    if (error) {
      return { count: 0, error: error.message };
    }

    return { count: count || 0 };
  } catch (error) {
    return {
      count: 0,
      error: error instanceof Error ? error.message : "Failed to fetch family members",
    };
  }
}

/**
 * Get user's family members list
 */
export async function getFamilyMembers(userId: string): Promise<{
  members: FamilyMemberRow[];
  error?: string;
}> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("family_members")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) {
      return { members: [], error: error.message };
    }

    return { members: data || [] };
  } catch (error) {
    return {
      members: [],
      error: error instanceof Error ? error.message : "Failed to fetch family members",
    };
  }
}

/**
 * Get count of user's active packages
 */
export async function getUserPackagesCount(
  userId: string
): Promise<{ count: number; error?: string }> {
  try {
    const supabase = createClient();

    const { count, error } = await supabase
      .from("user_packages")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("status", "active");

    if (error) {
      return { count: 0, error: error.message };
    }

    return { count: count || 0 };
  } catch (error) {
    return {
      count: 0,
      error: error instanceof Error ? error.message : "Failed to fetch packages",
    };
  }
}

/**
 * Get nearby facilities (partners)
 * For MVP: just get all facilities, in production would use geolocation
 */
export async function getNearbyFacilities(
  limit: number = 10
): Promise<{ facilities: FacilityRow[]; error?: string }> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("facilities")
      .select("*")
      .eq("is_partner", true)
      .limit(limit);

    if (error) {
      return { facilities: [], error: error.message };
    }

    return { facilities: data || [] };
  } catch (error) {
    return {
      facilities: [],
      error: error instanceof Error ? error.message : "Failed to fetch facilities",
    };
  }
}

/**
 * Get visit statistics for the user and their family members
 */
export async function getVisitStatistics(
  userId: string,
  timeframe: "week" | "month" | "3months" = "week"
): Promise<{
  visits: Array<{
    date: string;
    count: number;
    familyMember?: string;
  }>;
  error?: string;
}> {
  try {
    const supabase = createClient();

    // Calculate date range based on timeframe
    const now = new Date();
    const startDate = new Date();

    switch (timeframe) {
      case "week":
        startDate.setDate(now.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(now.getMonth() - 1);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
    }

    // Get all user packages for this user
    const { data: userPackages, error: packagesError } = await supabase
      .from("user_packages")
      .select("id")
      .eq("user_id", userId);

    if (packagesError) {
      return { visits: [], error: packagesError.message };
    }

    if (!userPackages || userPackages.length === 0) {
      return { visits: [] };
    }

    const packageIds = userPackages.map((pkg) => pkg.id);

    // Get visits for these packages within the timeframe
    const { data: visits, error: visitsError } = await supabase
      .from("visits")
      .select(`
        visit_date,
        dependent_id,
        status
      `)
      .in("user_package_id", packageIds)
      .gte("visit_date", startDate.toISOString())
      .lte("visit_date", now.toISOString())
      .in("status", ["completed", "confirmed"]);

    if (visitsError) {
      return { visits: [], error: visitsError.message };
    }

    // Group visits by date
    const visitsByDate = (visits || []).reduce((acc, visit) => {
      const date = new Date(visit.visit_date).toISOString().split("T")[0];
      if (!acc[date]) {
        acc[date] = 0;
      }
      acc[date]++;
      return acc;
    }, {} as Record<string, number>);

    const visitsArray = Object.entries(visitsByDate).map(([date, count]) => ({
      date,
      count,
    }));

    return { visits: visitsArray };
  } catch (error) {
    return {
      visits: [],
      error: error instanceof Error ? error.message : "Failed to fetch visit statistics",
    };
  }
}
