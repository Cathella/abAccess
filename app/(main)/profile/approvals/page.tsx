'use client';

import { useApprovalsStore } from '@/stores/approvalsStore';
import { ApprovalTabFilter } from '@/components/common/ApprovalTabFilter';
import { ApprovalCard } from '@/components/cards/ApprovalCard';
import { ApprovalsEmptyState } from '@/components/common/ApprovalsEmptyState';
import { ChevronLeft, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function ApprovalHistoryPage() {
  const { activeTab, setActiveTab, getApprovalsByMonth } = useApprovalsStore();

  const approvalsByMonth = getApprovalsByMonth();
  const hasApprovals = approvalsByMonth.size > 0;

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b">
        <Link href="/profile">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="font-semibold">Approval History</h1>
      </header>

      {/* Tab Filter */}
      <div className="px-4 py-4">
        <ApprovalTabFilter
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Content */}
      {!hasApprovals ? (
        <ApprovalsEmptyState />
      ) : (
        <div className="px-4 pb-8">
          {Array.from(approvalsByMonth.entries()).map(([month, approvals]) => (
            <div key={month} className="mb-6">
              {/* Month Header */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-sm font-medium text-gray-500">
                  {month}
                </span>
              </div>

              {/* Approval Cards */}
              <div className="space-y-3">
                {approvals.map((approval) => (
                  <ApprovalCard
                    key={approval.id}
                    approval={approval}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
