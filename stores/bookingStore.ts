import { create } from 'zustand';
import {
  BookingFlowStatus,
  BookingSession,
  UserPackage,
  BookingFacility,
  TimeSlot,
  BookingConfirmation
} from '@/types';
import { createClient } from '@/lib/supabase/client';
import { createNotification } from '@/lib/notifications';

const TIME_SLOT_TO_TIME: Record<TimeSlot, string> = {
  morning: '09:00:00',
  afternoon: '14:00:00',
  evening: '17:00:00',
};

const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: 'Morning (8 AM - 12 PM)',
  afternoon: 'Afternoon (12 PM - 4 PM)',
  evening: 'Evening (4 PM - 6 PM)',
};

function createBookingQrCode(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

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

    try {
      if (
        !session.package?.id ||
        !session.memberId ||
        !session.facilityId ||
        !session.selectedDate ||
        !session.selectedTimeSlot
      ) {
        throw new Error('Missing booking details');
      }

      const supabase = createClient();
      const requestedTime = TIME_SLOT_TO_TIME[session.selectedTimeSlot];
      const visitDate = new Date(
        `${session.selectedDate}T${requestedTime}`
      ).toISOString();
      const dependentId =
        session.package.userId && session.memberId !== session.package.userId
          ? session.memberId
          : null;

      const qrCode = createBookingQrCode();

      const { data: visit, error: visitError } = await supabase
        .from('visits')
        .insert({
          user_package_id: session.package.id,
          dependent_id: dependentId,
          facility_id: session.facilityId,
          visit_date: visitDate,
          status: 'pending',
          copay_paid: false,
          qr_code: qrCode,
          provider_notes: null,
        })
        .select('id')
        .single();

      if (visitError || !visit) {
        throw new Error(visitError?.message || 'Failed to create visit');
      }

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          visit_id: visit.id,
          requested_date: session.selectedDate,
          requested_time: requestedTime,
          status: 'pending',
        });

      if (bookingError) {
        throw new Error(bookingError.message);
      }

      const confirmation: BookingConfirmation = {
        bookingId: visit.id,
        packageCategory: session.package?.package?.category || 'Consultations',
        packageName: session.package?.package?.name || '5 Visits Pack',
        patientName: session.memberName || '',
        facilityName: session.facility?.name || '',
        requestedDate: session.selectedDate,
        preferredTime: session.selectedTimeSlot,
        copayDue: session.package?.package?.copay || 5000,
        remainingAfter: (session.package?.remainingVisits || 1) - 1,
      };

      set({
        session: { ...session, status: 'success', bookingId: confirmation.bookingId },
        confirmation,
      });

      // Create notification for successful booking
      // Import notifications store dynamically to avoid circular dependency
      const { useNotificationsStore } = await import('./notificationsStore');
      const addNotification = useNotificationsStore.getState().addNotification;

      // Format date for notification
      const dateObj = new Date(session.selectedDate);
      const dateFormatted = dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
      const timeLabel = TIME_SLOT_LABELS[session.selectedTimeSlot];

      addNotification(
        createNotification(
          'booking_confirmed',
          `Your appointment at ${session.facility?.name} is confirmed for ${dateFormatted} (${timeLabel}).`,
          {
            actionRoute: '/visits',
            facilityName: session.facility?.name
          }
        )
      );
    } catch (error) {
      console.error('Failed to submit booking:', error);
      set({
        session: { ...session, status: 'failed' },
      });
      throw error;
    }
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
