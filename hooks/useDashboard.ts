import { useEffect, useState } from "react";
import {
  getWalletBalance,
  getFamilyMembersCount,
  getFamilyMembers,
  getUserPackagesCount,
  getNearbyFacilities,
  getVisitStatistics,
} from "@/lib/supabase/dashboard";
import type { Database } from "@/types/database";

type FacilityRow = Database["public"]["Tables"]["facilities"]["Row"];
type FamilyMemberRow = Database["public"]["Tables"]["family_members"]["Row"];

interface DashboardData {
  walletBalance: number;
  familyMembersCount: number;
  familyMembers: FamilyMemberRow[];
  packagesCount: number;
  nearbyFacilities: FacilityRow[];
  visitStats: Array<{
    date: string;
    count: number;
    familyMember?: string;
  }>;
}

interface UseDashboardReturn {
  data: DashboardData;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch all dashboard data
 */
export function useDashboard(userId: string | undefined): UseDashboardReturn {
  const [data, setData] = useState<DashboardData>({
    walletBalance: 0,
    familyMembersCount: 0,
    familyMembers: [],
    packagesCount: 0,
    nearbyFacilities: [],
    visitStats: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch all data in parallel
      const [
        walletResult,
        familyCountResult,
        familyMembersResult,
        packagesResult,
        facilitiesResult,
        visitsResult,
      ] = await Promise.all([
        getWalletBalance(userId),
        getFamilyMembersCount(userId),
        getFamilyMembers(userId),
        getUserPackagesCount(userId),
        getNearbyFacilities(10),
        getVisitStatistics(userId, "week"),
      ]);

      // Check for errors
      const errors = [
        walletResult.error,
        familyCountResult.error,
        familyMembersResult.error,
        packagesResult.error,
        facilitiesResult.error,
        visitsResult.error,
      ].filter(Boolean);

      if (errors.length > 0) {
        setError(errors.join(", "));
      }

      setData({
        walletBalance: walletResult.balance,
        familyMembersCount: familyCountResult.count,
        familyMembers: familyMembersResult.members,
        packagesCount: packagesResult.count,
        nearbyFacilities: facilitiesResult.facilities,
        visitStats: visitsResult.visits,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [userId]);

  return {
    data,
    loading,
    error,
    refetch: fetchDashboardData,
  };
}
