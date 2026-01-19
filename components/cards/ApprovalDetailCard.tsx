"use client";

import { PendingApprovalRequest } from "@/types";

interface ApprovalDetailCardProps {
  request: PendingApprovalRequest;
  variant?: "pending" | "approved" | "declined" | "expired";
}

interface DetailRow {
  label: string;
  value: string;
}

function formatUgandaCurrency(amount: number) {
  return `UGX ${amount.toLocaleString("en-UG")}`;
}

function formatDateTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateTimeFull(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatTime(value?: string) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ApprovalDetailCard({
  request,
  variant = "pending",
}: ApprovalDetailCardProps) {
  const memberLabel = request.memberAge
    ? `${request.memberName} (${request.memberAge} years old)`
    : request.memberName;

  const baseRows: DetailRow[] = [
    { label: "Visit for", value: memberLabel },
    { label: "Facility", value: request.facilityName },
  ];

  const pendingRows: DetailRow[] = [
    ...baseRows,
    {
      label: "Package",
      value: `${request.packageCategory} (${request.packageName})`,
    },
    { label: "Co-pay due", value: formatUgandaCurrency(request.copay) },
    {
      label: "Remaining after",
      value: `${request.remainingAfter} of ${request.totalVisits} visits`,
    },
  ];

  const approvedRows: DetailRow[] = [
    ...baseRows,
    { label: "Date", value: formatDateTime(request.requestedAt) },
    { label: "Time", value: formatTime(request.requestedAt) },
    { label: "Co-pay due", value: formatUgandaCurrency(request.copay) },
    {
      label: "Remaining",
      value: `${request.remainingAfter} of ${request.totalVisits} visits`,
    },
  ];

  const declinedRows: DetailRow[] = [
    ...baseRows,
    { label: "Declined on", value: formatDateTimeFull(request.requestedAt) },
  ];

  const expiredRows: DetailRow[] = [
    ...baseRows,
    { label: "Requested", value: formatDateTimeFull(request.requestedAt) },
    { label: "Expired", value: formatDateTimeFull(request.expiresAt) },
  ];

  const rowsByVariant: Record<
    NonNullable<ApprovalDetailCardProps["variant"]>,
    DetailRow[]
  > = {
    pending: pendingRows,
    approved: approvedRows,
    declined: declinedRows,
    expired: expiredRows,
  };

  const rows = rowsByVariant[variant];

  return (
    <div className="bg-gray-50 rounded-2xl p-4">
      <div className="text-center">
        <p className="text-lg font-bold text-gray-900">
          {request.packageCategory}
        </p>
        <p className="text-sm text-gray-500">{request.packageName}</p>
      </div>

      <div className="border-b border-gray-200 my-4" />

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-4">
            <span className="text-sm font-semibold text-gray-700">
              {row.label}
            </span>
            <span className="text-sm text-gray-900 text-right">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
