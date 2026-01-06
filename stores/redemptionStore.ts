import { create } from 'zustand';
import {
  RedemptionStatus,
  RedemptionCode,
  RedemptionSession,
  UserPackage,
  FamilyMemberOption
} from '@/types';
import { generateRedemptionCode, REDEMPTION_CODE_VALIDITY_MINUTES } from '@/lib/constants';

interface RedemptionState {
  // Session data
  session: RedemptionSession | null;

  // Timer
  timeRemaining: number;  // seconds
  timerInterval: NodeJS.Timeout | null;

  // Actions
  startRedemption: (pkg: UserPackage) => void;
  setSelectedMember: (memberId: string, memberName: string) => void;
  setSelectedFacility: (facilityId: string, facilityName: string) => void;
  setCopayAcknowledged: (acknowledged: boolean) => void;
  generateCode: () => void;
  setStatus: (status: RedemptionStatus) => void;

  // Timer actions
  startTimer: () => void;
  stopTimer: () => void;

  // Result actions
  setRedemptionSuccess: (data: {
    facilityName: string;
    visitDate: string;
    visitTime: string;
    copayPaid: number;
    remainingVisits: number;
  }) => void;
  setRedemptionFailed: () => void;

  // Reset
  resetRedemption: () => void;

  // Computed
  isCodeExpiring: () => boolean;  // < 2 minutes
  getFormattedTimeRemaining: () => string;  // "1:24"
}

const initialSession: RedemptionSession = {
  packageId: '',
  package: null as any,
  selectedMemberId: null,
  selectedMemberName: null,
  facilityId: null,
  facilityName: null,
  copayAcknowledged: false,
  activeCode: null,
  status: 'idle',
};


export const useRedemptionStore = create<RedemptionState>((set, get) => ({
  session: null,
  timeRemaining: 0,
  timerInterval: null,

  startRedemption: (pkg) => {
    set({
      session: {
        ...initialSession,
        packageId: pkg.id,
        package: pkg,
        status: 'selecting_member',
      },
    });
  },

  setSelectedMember: (memberId, memberName) => {
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          selectedMemberId: memberId,
          selectedMemberName: memberName,
        },
      });
    }
  },

  setSelectedFacility: (facilityId, facilityName) => {
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          facilityId,
          facilityName,
        },
      });
    }
  },

  setCopayAcknowledged: (acknowledged) => {
    const { session } = get();
    if (session) {
      set({
        session: {
          ...session,
          copayAcknowledged: acknowledged,
        },
      });
    }
  },

  generateCode: () => {
    const { session } = get();
    if (!session) return;

    const now = new Date();
    const expiresAt = new Date(now.getTime() + REDEMPTION_CODE_VALIDITY_MINUTES * 60 * 1000);
    const code = generateRedemptionCode();

    const redemptionCode: RedemptionCode = {
      code,
      qrData: JSON.stringify({
        code,
        packageId: session.packageId,
        memberId: session.selectedMemberId,
        memberName: session.selectedMemberName,
        timestamp: now.toISOString(),
      }),
      packageId: session.packageId,
      memberId: session.selectedMemberId!,
      memberName: session.selectedMemberName!,
      createdAt: now.toISOString(),
      expiresAt: expiresAt.toISOString(),
    };

    set({
      session: {
        ...session,
        activeCode: redemptionCode,
        status: 'code_active',
      },
      timeRemaining: REDEMPTION_CODE_VALIDITY_MINUTES * 60,
    });

    // Start the countdown timer
    get().startTimer();
  },

  setStatus: (status) => {
    const { session } = get();
    if (session) {
      set({ session: { ...session, status } });
    }
  },

  startTimer: () => {
    const { stopTimer } = get();
    stopTimer(); // Clear any existing timer

    const interval = setInterval(() => {
      const { timeRemaining, session } = get();

      if (timeRemaining <= 1) {
        get().stopTimer();
        if (session) {
          set({
            timeRemaining: 0,
            session: { ...session, status: 'code_expired' },
          });
        }
        return;
      }

      const newTime = timeRemaining - 1;
      const isExpiring = newTime <= 120; // 2 minutes

      set({
        timeRemaining: newTime,
        session: session ? {
          ...session,
          status: isExpiring ? 'code_expiring' : 'code_active',
        } : null,
      });
    }, 1000);

    set({ timerInterval: interval });
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
      set({ timerInterval: null });
    }
  },

  setRedemptionSuccess: (data) => {
    const { session, stopTimer } = get();
    stopTimer();

    if (session) {
      set({
        session: {
          ...session,
          status: 'success',
          facilityName: data.facilityName,
          visitDate: data.visitDate,
          visitTime: data.visitTime,
          copayPaid: data.copayPaid,
          remainingVisits: data.remainingVisits,
        },
      });
    }
  },

  setRedemptionFailed: () => {
    const { session, stopTimer } = get();
    stopTimer();

    if (session) {
      set({
        session: { ...session, status: 'failed' },
      });
    }
  },

  resetRedemption: () => {
    get().stopTimer();
    set({
      session: null,
      timeRemaining: 0,
      timerInterval: null,
    });
  },

  isCodeExpiring: () => {
    const { timeRemaining } = get();
    return timeRemaining > 0 && timeRemaining <= 120;
  },

  getFormattedTimeRemaining: () => {
    const { timeRemaining } = get();
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  },
}));
