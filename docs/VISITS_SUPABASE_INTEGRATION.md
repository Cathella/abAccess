# Visits Feature - Supabase Integration Guide

## Overview

This guide explains how to replace the mock data (`MOCK_VISITS`) with real Supabase data for the Visits feature.

## Database Schema Requirements

### `visits` Table

The visits table should have the following structure:

```sql
CREATE TABLE visits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  family_member_id UUID REFERENCES family_members(id) ON DELETE SET NULL,
  facility_id UUID NOT NULL REFERENCES facilities(id),
  package_id UUID NOT NULL REFERENCES user_packages(id),
  visit_date DATE NOT NULL,
  visit_time TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN (
    'pending_confirmation',
    'confirmed',
    'completed',
    'remotely_approved',
    'canceled',
    'no_show'
  )),
  copay_amount DECIMAL(10, 2),
  refund_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_visits_user_id ON visits(user_id);
CREATE INDEX idx_visits_status ON visits(status);
CREATE INDEX idx_visits_date ON visits(visit_date);
```

### Required Relationships

The visits table requires relationships with:
- `users` table (for the primary account holder)
- `family_members` table (for dependents)
- `facilities` table (for visit location)
- `user_packages` table (for package information)

## Integration Steps

### Step 1: Update the visitsStore

Replace the mock data initialization with a data fetching mechanism:

**File: `stores/visitsStore.ts`**

```typescript
import { create } from 'zustand';
import { VisitRecord, VisitTabFilter } from '@/types';
import { getUserVisits } from '@/lib/supabase/visits';

interface VisitsState {
  // Data
  visits: VisitRecord[];
  isLoading: boolean;
  error: string | null;

  // Filters
  activeTab: VisitTabFilter;
  selectedMemberId: string | 'all';

  // Actions
  fetchVisits: (userId: string) => Promise<void>;
  setVisits: (visits: VisitRecord[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setActiveTab: (tab: VisitTabFilter) => void;
  setSelectedMemberId: (memberId: string | 'all') => void;

  // Computed helpers
  getFilteredVisits: () => VisitRecord[];
  getVisitsByTab: (tab: VisitTabFilter) => VisitRecord[];
  groupVisitsByMonth: (visits: VisitRecord[]) => Record<string, VisitRecord[]>;
}

export const useVisitsStore = create<VisitsState>((set, get) => ({
  visits: [],
  isLoading: false,
  error: null,
  activeTab: 'upcoming',
  selectedMemberId: 'all',

  fetchVisits: async (userId: string) => {
    set({ isLoading: true, error: null });
    const { visits, error } = await getUserVisits(userId);
    set({
      visits: visits || [],
      isLoading: false,
      error: error || null
    });
  },

  setVisits: (visits) => set({ visits }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
  setActiveTab: (activeTab) => set({ activeTab }),
  setSelectedMemberId: (selectedMemberId) => set({ selectedMemberId }),

  // ... rest of the existing computed helpers remain the same
}));
```

### Step 2: Update the Visits Page

Load data when the page mounts:

**File: `app/(main)/visits/page.tsx`**

```typescript
export default function VisitsPage() {
  const router = useRouter();
  const { user } = useAuth();

  // Visits store
  const visits = useVisitsStore((state) => state.visits);
  const isLoading = useVisitsStore((state) => state.isLoading);
  const error = useVisitsStore((state) => state.error);
  const fetchVisits = useVisitsStore((state) => state.fetchVisits);
  // ... other store selectors

  // Fetch visits on mount
  useEffect(() => {
    if (user?.id) {
      fetchVisits(user.id);
    }
  }, [user?.id, fetchVisits]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-neutral-600">Loading visits...</p>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => user?.id && fetchVisits(user.id)}
            className="text-blue-600 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // ... rest of the component remains the same
}
```

### Step 3: Create a Custom Hook (Optional but Recommended)

Create a hook to manage visit data fetching:

**File: `hooks/useVisits.ts`**

```typescript
import { useEffect } from 'react';
import { useVisitsStore } from '@/stores/visitsStore';
import { useAuth } from './useAuth';

export function useVisits() {
  const { user } = useAuth();
  const visits = useVisitsStore((state) => state.visits);
  const isLoading = useVisitsStore((state) => state.isLoading);
  const error = useVisitsStore((state) => state.error);
  const fetchVisits = useVisitsStore((state) => state.fetchVisits);

  useEffect(() => {
    if (user?.id) {
      fetchVisits(user.id);
    }
  }, [user?.id, fetchVisits]);

  const refetch = () => {
    if (user?.id) {
      fetchVisits(user.id);
    }
  };

  return {
    visits,
    isLoading,
    error,
    refetch,
  };
}
```

Then in the visits page:

```typescript
export default function VisitsPage() {
  const { visits, isLoading, error, refetch } = useVisits();
  // ... rest of component
}
```

## Available Supabase Functions

The `lib/supabase/visits.ts` file provides these functions:

### 1. `getUserVisits(userId: string)`
Fetches all visits for a user and their dependents.

### 2. `getUpcomingVisits(userId: string)`
Fetches only upcoming visits (confirmed + pending_confirmation).

### 3. `getCompletedVisits(userId: string)`
Fetches only completed visits.

### 4. `getCanceledVisits(userId: string)`
Fetches only canceled visits.

### 5. `getVisitById(visitId: string)`
Fetches a single visit by ID (useful for detail page).

### 6. `updateVisitStatus(visitId: string, status: VisitStatusType)`
Updates the status of a visit.

### 7. `cancelVisit(visitId: string, refundNote?: string)`
Cancels a visit and optionally adds a refund note.

## Testing the Integration

### 1. Test with Empty Data
- Ensure the empty state shows when user has no visits
- Verify the "Browse packages" button works

### 2. Test with Sample Data
Insert sample visits in Supabase:

```sql
INSERT INTO visits (
  user_id,
  family_member_id,
  facility_id,
  package_id,
  visit_date,
  visit_time,
  status
) VALUES (
  'your-user-id',
  NULL,
  'your-facility-id',
  'your-package-id',
  '2025-01-10',
  '10:00 AM',
  'confirmed'
);
```

### 3. Test All States
- Upcoming tab with pending and confirmed visits
- Completed tab with month grouping
- Canceled tab with refund notes
- Filter by family member
- "No results" state when filter shows nothing

### 4. Test Real-time Updates
- Book a new visit and verify it appears
- Cancel a visit and verify it moves to canceled tab
- Complete a visit and verify it moves to completed tab

## Error Handling

The integration includes error handling for:
- Network errors
- Missing data
- Invalid user IDs
- Database query failures

Each Supabase function returns an error object that should be displayed to the user.

## Performance Considerations

1. **Caching**: The visitsStore holds data in memory to avoid repeated fetches
2. **Pagination**: For users with many visits, consider implementing pagination
3. **Indexes**: Ensure database indexes exist on frequently queried columns
4. **Real-time subscriptions**: Consider adding Supabase real-time subscriptions for live updates

## Next Steps

After basic integration:

1. Add real-time subscriptions for live visit updates
2. Implement optimistic updates for better UX
3. Add visit booking functionality
4. Implement visit details page with more information
5. Add ability to reschedule visits
6. Implement push notifications for visit reminders
