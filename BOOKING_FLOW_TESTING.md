# Booking Flow - Integration & Testing Guide

## Overview
Complete visit booking flow for ABA Access mobile app, allowing users to book facility visits using their active packages.

## Flow Architecture

```
/visits → "Book a Visit" button
    → /book/select-package (Choose active package)
        → /book/select-person (Who is this visit for?)
            → /book/select-facility (Search & browse facilities)
                → /book/facility/[id] (Facility details - optional)
                    → /book/select-datetime (Calendar + time slot)
                        → /book/confirm (Review booking details)
                            → /book/submitting (Loading)
                                → /book/success (Pending confirmation)
```

## Entry Points

### 1. Visits Page ✅
- **Location:** `/visits`
- **Action:** "Book a Visit" button
- **Behavior:**
  - Calls `startBooking()` to reset booking state
  - Navigates to `/book/select-package`

### 2. Future Entry Points (To Implement)
- My Packages page: "Use package" → Book flow
- Dashboard: Quick action button
- Package details: "Book with this package"

## Components Created

### Pages
- ✅ `/book/select-package` - Package selection
- ✅ `/book/select-person` - Family member selection
- ✅ `/book/select-facility` - Facility search & list
- ✅ `/book/facility/[id]` - Facility detail view
- ✅ `/book/select-datetime` - Date & time selection
- ✅ `/book/confirm` - Booking review
- ✅ `/book/submitting` - Loading state
- ✅ `/book/success` - Success confirmation

### Components
- ✅ `PackageSelectRadio` - Package selection radio
- ✅ `FacilityCard` - Facility list card
- ✅ `CalendarPicker` - Date picker with month navigation
- ✅ `TimeSlotRadio` - Time slot selection
- ✅ `BookingSummaryCard` - Booking details summary
- ✅ `BookingInfoCard` - Informational messages

### Store
- ✅ `bookingStore` - Manages booking flow state
- ✅ `visitsStore.addPendingVisit()` - Creates visit record

### Utilities
- ✅ `lib/facilities.ts` - Facility search & filtering
- ✅ `lib/utils.ts` - Date formatting utilities

## Testing Checklist

### 1. Full Flow Testing

#### Happy Path
- [ ] Start booking from Visits page
- [ ] Select an active package
- [ ] Select family member (self or dependent)
- [ ] Search and select facility
- [ ] View facility details (optional)
- [ ] Select date (tomorrow to 30 days out)
- [ ] Select time slot
- [ ] Review booking details
- [ ] Submit booking
- [ ] See success message
- [ ] Visit appears in "Upcoming" tab with "Pending confirmation" status

#### Back Navigation
- [ ] Back from select-person returns to select-package (keeps package selected)
- [ ] Back from select-facility returns to select-person (keeps member selected)
- [ ] Back from facility detail returns to facility list
- [ ] Back from select-datetime returns to facility list
- [ ] Back from confirm returns to select-datetime (keeps date/time selected)
- [ ] All selections persist when navigating back

### 2. Edge Cases

#### No Active Packages
- [ ] User with no active packages sees empty state
- [ ] Empty state shows "Browse packages" button
- [ ] "Browse packages" navigates to /packages

#### Single User (No Dependents)
- [ ] User with no dependents only sees "Myself" option
- [ ] Flow continues normally

#### Facility Restrictions
- [ ] Walk-in only facilities show "Walk-in only" badge
- [ ] Can still view walk-in facility details
- [ ] Booking proceeds normally (request is for preferred time)

#### Sunday Bookings
- [ ] Sundays disabled in calendar if facility hours show "Closed"
- [ ] Can't select disabled dates
- [ ] Month navigation works around disabled dates

### 3. Calendar Testing

#### Date Selection
- [ ] Can't select dates before tomorrow
- [ ] Can't select dates > 30 days from today
- [ ] Selected date highlights in green (#32C28A)
- [ ] Today shows border outline if in range
- [ ] Disabled dates show in gray and not clickable

#### Month Navigation
- [ ] Previous arrow disabled if all dates in month are past
- [ ] Next arrow disabled if month start > 30 days out
- [ ] Month/year display updates correctly
- [ ] Selected date persists when changing months
- [ ] Calendar resets to current/selected month on page mount

### 4. Facility Search Testing

#### Search Functionality
- [ ] Search input has 300ms debounce
- [ ] Filters by facility name (case-insensitive)
- [ ] Filters by facility address (case-insensitive)
- [ ] Empty search shows all facilities
- [ ] "No facilities found" message for no results
- [ ] Facilities sorted by distance (nearest first)

#### Service Filtering
- [ ] Only shows facilities matching package category
- [ ] "Consultations" package shows facilities with "Consultations" service
- [ ] Partial matching works (e.g., "Child Wellness" matches "Child")

### 5. Facility Detail Testing

#### Display
- [ ] Facility name, address, distance shown
- [ ] Recommendation percentage displays
- [ ] Operating hours show correctly
- [ ] Services list displays with checkmarks
- [ ] Closed days show in red text

#### Actions
- [ ] "Get directions" opens Google Maps in new tab
- [ ] URL contains encoded facility address
- [ ] "Book at this facility" saves facility and proceeds
- [ ] Back button returns to facility list

### 6. Date & Time Selection

#### Time Slots
- [ ] Morning (8 AM - 12 PM)
- [ ] Afternoon (12 PM - 4 PM)
- [ ] Evening (4 PM - 6 PM)
- [ ] Selected slot highlights in blue
- [ ] Can change selection

#### Facility Hours Display
- [ ] Shows weekday hours
- [ ] Shows Saturday hours
- [ ] Shows Sunday hours (or "Closed")
- [ ] Info card displays at bottom

### 7. Confirmation Page

#### Booking Summary
- [ ] Patient name displays correctly
- [ ] Facility name displays
- [ ] Date formatted as "Fri, 7 Jan 2026"
- [ ] Time shows as "Afternoon (12 PM - 4 PM)"
- [ ] Co-pay amount shows as "UGX 5,000"
- [ ] Shows remaining visits after booking

#### Info Card
- [ ] Shows "Booking confirmation" message
- [ ] Info icon displays
- [ ] Message explains confirmation process

### 8. Submission Testing

#### Loading State
- [ ] Shows blue spinner
- [ ] "Submitting booking..." message
- [ ] "Please don't close the app" warning
- [ ] Simulates 2-second delay

#### Success
- [ ] Success page shows 😊 emoji
- [ ] "Booking request sent!" message
- [ ] Facility name in subtitle
- [ ] Booking summary card shows all details
- [ ] "View my visits" navigates to /visits
- [ ] "Done" navigates to /dashboard

#### Visit Creation
- [ ] New visit created with status "pending_confirmation"
- [ ] Visit shows in "Upcoming" tab
- [ ] Visit has correct member name and initials
- [ ] Visit has correct facility, package, date, time
- [ ] No duplicate visits created

### 9. Navigation Guards

#### Prerequisites Validation
- [ ] Can't access select-person without package
- [ ] Can't access select-facility without member
- [ ] Can't access select-datetime without facility
- [ ] Can't access confirm without date & time
- [ ] Redirects to /book/select-package if prerequisites missing

#### State Validation
- [ ] Continue button disabled until selection made
- [ ] canProceedToFacility() validates package + member
- [ ] canProceedToDateTime() validates facility
- [ ] canProceedToConfirm() validates date + time
- [ ] canSubmit() validates all fields

### 10. Data Persistence

#### Booking Store State
- [ ] Selected package persists
- [ ] Selected member persists
- [ ] Selected facility persists
- [ ] Selected date persists
- [ ] Selected time slot persists
- [ ] State clears on resetBooking()

#### Visits Store Integration
- [ ] addPendingVisit() creates visit record
- [ ] Visit added to beginning of visits array
- [ ] Member initials calculated correctly
- [ ] Time slot formatted correctly
- [ ] All booking details preserved

## Known Limitations (Current Implementation)

### Mock Data
- ✅ Uses `MOCK_FACILITIES` constant (3 facilities)
- ⚠️ Real facilities should come from Supabase database

### Simulated API Calls
- ✅ 2-second timeout simulates submission
- ⚠️ No actual booking created in database
- ⚠️ No email/SMS notifications sent

### No Real-time Availability
- ⚠️ Can't check if facility has available slots
- ⚠️ No conflict detection
- ⚠️ No capacity management

## Future Enhancements

### Phase 1: Database Integration
```typescript
// Fetch facilities from Supabase
const { data: facilities } = await supabase
  .from('facilities')
  .select('*')
  .eq('isActive', true)
  .order('distance');

// Submit booking to database
const { data: booking } = await supabase
  .from('bookings')
  .insert({
    userId: session.memberId,
    packageId: session.packageId,
    facilityId: session.facilityId,
    requestedDate: session.selectedDate,
    preferredTime: session.selectedTimeSlot,
    status: 'pending',
  });
```

### Phase 2: Real-time Features
- WebSocket connection for booking status updates
- Push notifications when booking confirmed
- Real-time availability checking
- Facility capacity management

### Phase 3: Advanced Features
- Multiple time slot preferences
- Recurring bookings
- Booking modifications/cancellations
- Facility reviews and ratings
- Waitlist functionality

## Code Quality Checklist

### TypeScript
- [ ] All types properly defined
- [ ] No `any` types used
- [ ] Props interfaces documented
- [ ] Return types specified

### Component Structure
- [ ] Client components marked with "use client"
- [ ] Server components used where appropriate
- [ ] Proper separation of concerns
- [ ] Reusable components extracted

### State Management
- [ ] Zustand store follows patterns
- [ ] Actions are atomic
- [ ] State updates are immutable
- [ ] No unnecessary re-renders

### Error Handling
- [ ] Loading states handled
- [ ] Error states handled
- [ ] Empty states handled
- [ ] Edge cases covered

### Accessibility
- [ ] Semantic HTML used
- [ ] Button/link roles correct
- [ ] Form inputs have labels
- [ ] Keyboard navigation works

### Performance
- [ ] useCallback for event handlers
- [ ] useMemo for expensive calculations
- [ ] Debounced search input
- [ ] No unnecessary API calls

## Testing Commands

```bash
# Run development server
npm run dev

# Type checking
npx tsc --noEmit

# Lint code
npm run lint

# Build for production
npm run build
```

## Integration Points Summary

### ✅ Completed
1. Booking flow pages (8 pages)
2. Booking store with state management
3. Integration with Visits store
4. Calendar component with date-fns
5. Facility search and filtering
6. Entry point from Visits page
7. Success flow creates pending visit

### ⚠️ Needs Backend
1. Real facility data from Supabase
2. Booking submission API
3. Visit confirmation workflow
4. Notification system

### 📋 Documentation
- Flow diagram created
- Component documentation
- Type definitions
- Testing checklist
- Future roadmap

## Support & Questions

For issues or questions:
1. Check this testing guide
2. Review component documentation
3. Check type definitions in `types/index.ts`
4. Review store implementation in `stores/bookingStore.ts`

---

**Status:** MVP Complete ✅
**Last Updated:** January 2026
**Version:** 1.0.0
