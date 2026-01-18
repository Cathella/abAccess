'use client';

import { useApprovalsStore } from '@/stores/approvalsStore';
import { ApprovalTabFilter } from '@/components/common/ApprovalTabFilter';
import { ApprovalCard } from '@/components/cards/ApprovalCard';
import { ApprovalsEmptyState } from '@/components/common/ApprovalsEmptyState';
import { Calendar } from 'lucide-react';

export default function ApprovalHistoryPage() {
  const { activeTab, setActiveTab, getApprovalsByMonth } = useApprovalsStore();

  const approvalsByMonth = getApprovalsByMonth();
  const hasApprovals = approvalsByMonth.size > 0;

  return (
    <div className="min-h-screen bg-white">
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
