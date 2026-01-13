"use client";

import { create } from "zustand";
import {
  PendingApprovalRequest,
  DeclineReason,
  PendingApprovalStatus,
} from "@/types";
import {
  getApprovalRequestStatus,
  getApprovalRequestsForUser,
  updateApprovalStatus,
} from "@/lib/supabase/approvals";
import {
  fetchApprovalNotificationIds,
  insertApprovalNotification,
} from "@/lib/supabase/notifications";

interface PendingApprovalsState {
  pendingRequests: PendingApprovalRequest[];
  isLoading: boolean;
  error: string | null;
  currentRequestId: string | null;
  processingStatus: "idle" | "verifying_pin" | "approving" | "declining" | "reporting";
  loadPendingRequests: (userId: string) => Promise<void>;
  setPendingRequests: (requests: PendingApprovalRequest[]) => void;
  setCurrentRequest: (id: string | null) => void;
  setProcessingStatus: (status: PendingApprovalsState["processingStatus"]) => void;
  getPendingCount: () => number;
  getRequestById: (id: string) => PendingApprovalRequest | undefined;
  approveRequest: (id: string) => Promise<void>;
  declineRequest: (id: string, reason: DeclineReason, otherReason?: string) => Promise<void>;
  reportSuspiciousActivity: (
    id: string,
    description: string,
    freezeAccount: boolean
  ) => Promise<void>;
  markAsExpired: (id: string) => void;
  removeRequest: (id: string) => void;
}

export const usePendingApprovalsStore = create<PendingApprovalsState>((set, get) => ({
  pendingRequests: [],
  isLoading: false,
  error: null,
  currentRequestId: null,
  processingStatus: "idle",

  loadPendingRequests: async (userId) => {
    set({ isLoading: true, error: null });
    const { requests, error } = await getApprovalRequestsForUser(userId);
    if (error) {
      set({ error, isLoading: false });
      return;
    }

    set({ pendingRequests: requests, isLoading: false });

    const pending = requests.filter((request) => request.status === "pending");
    const expired = requests.filter((request) => request.status === "expired");
    const { ids } = await fetchApprovalNotificationIds(userId);
    const newNotifications = pending.filter((request) => !ids.has(request.id));

    await Promise.all(
      newNotifications.map((request) =>
        insertApprovalNotification({
          userId,
          approvalRequestId: request.id,
          facilityName: request.facilityName,
          memberName: request.memberName,
        })
      )
    );

    await Promise.all(
      expired.map((request) => updateApprovalStatus(request.id, "expired"))
    );
  },

  setPendingRequests: (requests) => set({ pendingRequests: requests }),

  setCurrentRequest: (id) => set({ currentRequestId: id }),

  setProcessingStatus: (status) => set({ processingStatus: status }),

  getPendingCount: () => {
    return get().pendingRequests.filter((request) => request.status === "pending")
      .length;
  },

  getRequestById: (id) => {
    return get().pendingRequests.find((request) => request.id === id);
  },

  approveRequest: async (id) => {
    if (get().processingStatus !== "idle") return;
    set({ processingStatus: "approving", error: null });
    const current = get().pendingRequests.find((request) => request.id === id);
    if (!current) {
      set({ processingStatus: "idle", error: "Request not found" });
      throw new Error("REQUEST_NOT_FOUND");
    }
    if (current.status === "cancelled") {
      set({ processingStatus: "idle", error: "Package expired" });
      throw new Error("PACKAGE_EXPIRED");
    }
    if (current.status !== "pending") {
      set({ processingStatus: "idle", error: "Request already processed" });
      throw new Error(`REQUEST_${current.status.toUpperCase()}`);
    }
    const statusCheck = await getApprovalRequestStatus(id);
    if (statusCheck.error) {
      set({ processingStatus: "idle", error: statusCheck.error });
      throw new Error(statusCheck.error);
    }

    if (statusCheck.status && statusCheck.status !== "pending") {
      set({ processingStatus: "idle", error: "Request already processed" });
      throw new Error(`REQUEST_${statusCheck.status.toUpperCase()}`);
    }

    const packageExpired =
      statusCheck.packageExpiry &&
      new Date(statusCheck.packageExpiry).getTime() < Date.now();
    const packageInactive =
      statusCheck.packageStatus && statusCheck.packageStatus !== "active";

    if (packageExpired || packageInactive) {
      const updated = get().pendingRequests.map((request) =>
        request.id === id
          ? { ...request, status: "cancelled" as PendingApprovalStatus }
          : request
      );
      set({
        pendingRequests: updated,
        processingStatus: "idle",
        error: "Package expired",
      });
      throw new Error("PACKAGE_EXPIRED");
    }

    const result = await updateApprovalStatus(id, "approved");
    if (!result.success) {
      set({ processingStatus: "idle", error: result.error || "Approval failed" });
      throw new Error(result.error || "Approval failed");
    }

    const { pendingRequests } = get();
    const updated = pendingRequests.map((request) =>
      request.id === id
        ? { ...request, status: "approved" as PendingApprovalStatus }
        : request
    );

    set({ pendingRequests: updated, processingStatus: "idle" });
  },

  declineRequest: async (id, reason, otherReason) => {
    if (get().processingStatus !== "idle") return;
    set({ processingStatus: "declining", error: null });
    const current = get().pendingRequests.find((request) => request.id === id);
    if (!current) {
      set({ processingStatus: "idle", error: "Request not found" });
      throw new Error("REQUEST_NOT_FOUND");
    }
    if (current.status !== "pending") {
      set({ processingStatus: "idle", error: "Request already processed" });
      throw new Error(`REQUEST_${current.status.toUpperCase()}`);
    }
    const result = await updateApprovalStatus(id, "declined");
    if (!result.success) {
      set({ processingStatus: "idle", error: result.error || "Decline failed" });
      throw new Error(result.error || "Decline failed");
    }

    const { pendingRequests } = get();
    const updated = pendingRequests.map((request) =>
      request.id === id
        ? { ...request, status: "declined" as PendingApprovalStatus }
        : request
    );

    set({ pendingRequests: updated, processingStatus: "idle" });
  },

  reportSuspiciousActivity: async (id, description, freezeAccount) => {
    if (get().processingStatus !== "idle") return;
    set({ processingStatus: "reporting", error: null });
    const current = get().pendingRequests.find((request) => request.id === id);
    if (!current) {
      set({ processingStatus: "idle", error: "Request not found" });
      throw new Error("REQUEST_NOT_FOUND");
    }
    if (current.status !== "pending") {
      set({ processingStatus: "idle", error: "Request already processed" });
      throw new Error(`REQUEST_${current.status.toUpperCase()}`);
    }
    const result = await updateApprovalStatus(id, "declined");
    if (!result.success) {
      set({ processingStatus: "idle", error: result.error || "Report failed" });
      throw new Error(result.error || "Report failed");
    }

    const { pendingRequests } = get();
    const updated = pendingRequests.map((request) =>
      request.id === id
        ? { ...request, status: "declined" as PendingApprovalStatus }
        : request
    );

    set({ pendingRequests: updated, processingStatus: "idle" });

    if (freezeAccount) {
      // useAuthStore.getState().freezeAccount();
    }
  },

  markAsExpired: (id) => {
    const { pendingRequests } = get();
    const updated = pendingRequests.map((request) =>
      request.id === id
        ? { ...request, status: "expired" as PendingApprovalStatus }
        : request
    );
    set({ pendingRequests: updated });
    updateApprovalStatus(id, "expired");
  },

  removeRequest: (id) => {
    const { pendingRequests } = get();
    set({ pendingRequests: pendingRequests.filter((request) => request.id !== id) });
  },
}));
