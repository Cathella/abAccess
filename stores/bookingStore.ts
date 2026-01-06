import { create } from 'zustand';
import {
  BookingFlowStatus,
  BookingSession,
  UserPackage,
  BookingFacility,
  TimeSlot,
  BookingConfirmation
} from '@/types';

interface BookingState {
  // Session data
  session: BookingSession;

  // Search
  facilitySearchQuery: string;

  // Result
  confirmation: BookingConfirmation | null;

  // Actions
  startBooking: () => void;
  setSelectedPackage: (pkg: UserPackage) => void;
  setSelectedMember: (memberId: string, memberName: string) => void;
  setSelectedFacility: (facility: BookingFacility) => void;
  setSelectedDate: (date: string) => void;
  setSelectedTimeSlot: (slot: TimeSlot) => void;
  setStatus: (status: BookingFlowStatus) => void;
  setFacilitySearchQuery: (query: string) => void;

  // Submit
  submitBooking: () => Promise<void>;
  setConfirmation: (confirmation: BookingConfirmation) => void;

  // Navigation helpers
  canProceedToFacility: () => boolean;
  canProceedToDateTime: () => boolean;
  canProceedToConfirm: () => boolean;
  canSubmit: () => boolean;

  // Reset
  resetBooking: () => void;
}

const initialSession: BookingSession = {
  packageId: null,
  package: null,
  memberId: null,
  memberName: null,
  facilityId: null,
  facility: null,
  selectedDate: null,
  selectedTimeSlot: null,
  status: 'idle',
};

export const useBookingStore = create<BookingState>((set, get) => ({
  session: initialSession,
  facilitySearchQuery: '',
  confirmation: null,

  startBooking: () => {
    set({
      session: { ...initialSession, status: 'selecting_package' },
      facilitySearchQuery: '',
      confirmation: null,
    });
  },

  setSelectedPackage: (pkg) => {
    const { session } = get();
    set({
      session: {
        ...session,
        packageId: pkg.id,
        package: pkg,
        status: 'selecting_person',
      },
    });
  },

  setSelectedMember: (memberId, memberName) => {
    const { session } = get();
    set({
      session: {
        ...session,
        memberId,
        memberName,
        status: 'selecting_facility',
      },
    });
  },

  setSelectedFacility: (facility) => {
    const { session } = get();
    set({
      session: {
        ...session,
        facilityId: facility.id,
        facility,
        status: 'selecting_datetime',
      },
    });
  },

  setSelectedDate: (date) => {
    const { session } = get();
    set({
      session: { ...session, selectedDate: date },
    });
  },

  setSelectedTimeSlot: (slot) => {
    const { session } = get();
    set({
      session: { ...session, selectedTimeSlot: slot },
    });
  },

  setStatus: (status) => {
    const { session } = get();
    set({ session: { ...session, status } });
  },

  setFacilitySearchQuery: (query) => {
    set({ facilitySearchQuery: query });
  },

  submitBooking: async () => {
    const { session } = get();
    set({ session: { ...session, status: 'submitting' } });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Generate mock confirmation
    const confirmation: BookingConfirmation = {
      bookingId: `BK-${Date.now()}`,
      packageCategory: session.package?.package?.category || 'Consultations',
      packageName: session.package?.package?.name || '5 Visits Pack',
      patientName: session.memberName || '',
      facilityName: session.facility?.name || '',
      requestedDate: session.selectedDate || '',
      preferredTime: session.selectedTimeSlot || 'afternoon',
      copayDue: session.package?.package?.copay || 5000,
      remainingAfter: (session.package?.remainingVisits || 1) - 1,
    };

    set({
      session: { ...session, status: 'success', bookingId: confirmation.bookingId },
      confirmation,
    });
  },

  setConfirmation: (confirmation) => {
    set({ confirmation });
  },

  canProceedToFacility: () => {
    const { session } = get();
    return !!session.packageId && !!session.memberId;
  },

  canProceedToDateTime: () => {
    const { session } = get();
    return !!session.facilityId;
  },

  canProceedToConfirm: () => {
    const { session } = get();
    return !!session.selectedDate && !!session.selectedTimeSlot;
  },

  canSubmit: () => {
    const { session } = get();
    return (
      !!session.packageId &&
      !!session.memberId &&
      !!session.facilityId &&
      !!session.selectedDate &&
      !!session.selectedTimeSlot
    );
  },

  resetBooking: () => {
    set({
      session: initialSession,
      facilitySearchQuery: '',
      confirmation: null,
    });
  },
}));
