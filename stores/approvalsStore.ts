import { create } from 'zustand';
import { ApprovalStatus } from '@/types';
import type { ApprovalHistoryItem, ApprovalTabFilter } from '@/types';
import { MOCK_APPROVAL_HISTORY } from '@/lib/constants';

interface ApprovalsState {
  // Data
  approvals: ApprovalHistoryItem[];
  isLoading: boolean;

  // Filters
  activeTab: ApprovalTabFilter;

  // Actions
  setApprovals: (approvals: ApprovalHistoryItem[]) => void;
  setActiveTab: (tab: ApprovalTabFilter) => void;
  setLoading: (loading: boolean) => void;

  // Computed
  getFilteredApprovals: () => ApprovalHistoryItem[];
  getApprovalsByMonth: () => Map<string, ApprovalHistoryItem[]>;
  getApprovalCounts: () => Record<ApprovalTabFilter, number>;

  // For pending approvals (future use)
  approveRequest: (id: string) => void;
  declineRequest: (id: string) => void;

  // Reset
  reset: () => void;
}

const initialState = {
  approvals: MOCK_APPROVAL_HISTORY,
  isLoading: false,
  activeTab: 'approved' as ApprovalTabFilter,
};

export const useApprovalsStore = create<ApprovalsState>((set, get) => ({
  ...initialState,

  setApprovals: (approvals) => set({ approvals }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setLoading: (loading) => set({ isLoading: loading }),

  getFilteredApprovals: () => {
    const { approvals, activeTab } = get();
    const statusMap: Record<ApprovalTabFilter, ApprovalStatus> = {
      approved: ApprovalStatus.APPROVED,
      declined: ApprovalStatus.DECLINED,
      expired: ApprovalStatus.EXPIRED,
    };
    return approvals.filter((a) => a.status === statusMap[activeTab]);
  },

  getApprovalsByMonth: () => {
    const filtered = get().getFilteredApprovals();
    const grouped = new Map<string, ApprovalHistoryItem[]>();

    filtered.forEach((approval) => {
      const date = new Date(approval.requestDate);
      const monthKey = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
      }); // "January 2025"

      if (!grouped.has(monthKey)) {
        grouped.set(monthKey, []);
      }
      grouped.get(monthKey)!.push(approval);
    });

    return grouped;
  },

  getApprovalCounts: () => {
    const { approvals } = get();
    return {
      approved: approvals.filter((a) => a.status === ApprovalStatus.APPROVED)
        .length,
      declined: approvals.filter((a) => a.status === ApprovalStatus.DECLINED)
        .length,
      expired: approvals.filter((a) => a.status === ApprovalStatus.EXPIRED)
        .length,
    };
  },

  approveRequest: (id) => {
    const { approvals } = get();
    const updated = approvals.map((a) =>
      a.id === id
        ? {
            ...a,
            status: ApprovalStatus.APPROVED,
            respondedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    set({ approvals: updated });
  },

  declineRequest: (id) => {
    const { approvals } = get();
    const updated = approvals.map((a) =>
      a.id === id
        ? {
            ...a,
            status: ApprovalStatus.DECLINED,
            respondedAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          }
        : a
    );
    set({ approvals: updated });
  },

  reset: () => set(initialState),
}));
