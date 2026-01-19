import { Folder } from 'lucide-react';

export function ApprovalsEmptyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-8">
      <Folder className="w-16 h-16 text-amber-400" />

      <h2 className="text-xl font-bold text-neutral-900 mt-6">
        No approval requests yet
      </h2>

      <p className="text-base text-neutral-700 text-center mt-2 max-w-xs">
        When someone requests to use your package remotely, it will appear here.
      </p>
    </div>
  );
}
