import { create } from 'zustand';
import { VisitRecord, VisitTabFilter } from '@/types';
import { MOCK_VISITS } from '@/lib/constants';

interface VisitsState {
  // Data
  visits: VisitRecord[];
  isLoading: boolean;

  // Filters
  activeTab: VisitTabFilter;
  selectedMemberId: string | 'all';

  // Actions
  setVisits: (visits: VisitRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setActiveTab: (tab: VisitTabFilter) => void;
  setSelectedMemberId: (memberId: string | 'all') => void;

  // Computed helpers
  getFilteredVisits: () => VisitRecord[];
  getVisitsByTab: (tab: VisitTabFilter) => VisitRecord[];
  groupVisitsByMonth: (visits: VisitRecord[]) => Record<string, VisitRecord[]>;
}

export const useVisitsStore = create<VisitsState>((set, get) => ({
  visits: MOCK_VISITS,
  isLoading: false,
  activeTab: 'upcoming',
  selectedMemberId: 'all',

  setVisits: (visits) => set({ visits }),
  setLoading: (isLoading) => set({ isLoading }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),

  getFilteredVisits: () => {
    const { visits, activeTab, selectedMemberId } = get();

    // Filter by tab
    let filtered = visits.filter(visit => {
      if (activeTab === 'upcoming') {
        return ['pending_confirmation', 'confirmed'].includes(visit.status);
      }
      if (activeTab === 'completed') {
        return ['completed', 'remotely_approved'].includes(visit.status);
      }
      if (activeTab === 'canceled') {
        return ['canceled', 'no_show'].includes(visit.status);
      }
      return false;
    });

    // Filter by member
    if (selectedMemberId !== 'all') {
      filtered = filtered.filter(visit => visit.memberId === selectedMemberId);
    }

    // Sort by date (newest first for completed/canceled, soonest first for upcoming)
    filtered.sort((a, b) => {
      const dateA = new Date(a.visitDate).getTime();
      const dateB = new Date(b.visitDate).getTime();
      return activeTab === 'upcoming' ? dateA - dateB : dateB - dateA;
    });

    return filtered;
  },

  getVisitsByTab: (tab) => {
    const { visits } = get();
    return visits.filter(visit => {
      if (tab === 'upcoming') {
        return ['pending_confirmation', 'confirmed'].includes(visit.status);
      }
      if (tab === 'completed') {
        return ['completed', 'remotely_approved'].includes(visit.status);
      }
      if (tab === 'canceled') {
        return ['canceled', 'no_show'].includes(visit.status);
      }
      return false;
    });
  },

  groupVisitsByMonth: (visits) => {
    return visits.reduce((groups, visit) => {
      const date = new Date(visit.visitDate);
      const monthKey = date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      if (!groups[monthKey]) {
        groups[monthKey] = [];
      }
      groups[monthKey].push(visit);
      return groups;
    }, {} as Record<string, VisitRecord[]>);
  },
}));
