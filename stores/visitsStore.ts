import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { VisitRecord, VisitTabFilter, BookingConfirmation, BookingFacility, TimeSlot } from '@/types';
import { getUserVisits } from '@/lib/supabase/visits';
import { getInitials, formatTimeSlot } from '@/lib/utils';

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
  loadVisits: (userId: string, options?: { force?: boolean }) => Promise<void>;
  addPendingVisit: (booking: BookingConfirmation, facility: BookingFacility, memberId: string, isSelf: boolean, packageId: string) => void;

  // Computed helpers
  getFilteredVisits: () => VisitRecord[];
  getVisitsByTab: (tab: VisitTabFilter) => VisitRecord[];
  groupVisitsByMonth: (visits: VisitRecord[]) => Record<string, VisitRecord[]>;
}

export const useVisitsStore = create<VisitsState>()(
  persist(
    (set, get) => ({
      visits: [],
      isLoading: false,
      activeTab: 'upcoming',
      selectedMemberId: 'all',

      setVisits: (visits) => set({ visits }),
      setLoading: (isLoading) => set({ isLoading }),
      setActiveTab: (activeTab) => set({ activeTab }),
      setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),
      loadVisits: async (userId, options) => {
        const { isLoading } = get();
        if (isLoading && !options?.force) return;

        set({ isLoading: true });

        try {
          const result = await getUserVisits(userId);
          if (result.error) {
            console.error('Failed to load visits:', result.error);
            set({ isLoading: false });
            return;
          }
          set({ visits: result.visits, isLoading: false });
        } catch (error) {
          console.error('Failed to load visits:', error);
          set({ isLoading: false });
        }
      },

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

      addPendingVisit: (booking, facility, memberId, isSelf, packageId) => {
        const { visits } = get();

        const newVisit: VisitRecord = {
          id: booking.bookingId,
          memberId: memberId,
          memberName: booking.patientName,
          memberInitials: getInitials(booking.patientName),
          isSelf: isSelf,
          facilityId: facility.id,
          facilityName: facility.name,
          facilityAddress: facility.address,
          packageId: packageId,
          packageCategory: booking.packageCategory,
          packageName: booking.packageName,
          visitDate: booking.requestedDate,
          visitTime: formatTimeSlot(booking.preferredTime as TimeSlot),
          status: 'pending_confirmation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set({ visits: [newVisit, ...visits] });
      },
    }),
    {
      name: 'visits-storage',
    }
  )
);
