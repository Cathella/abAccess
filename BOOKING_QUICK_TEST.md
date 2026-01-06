# Booking Flow - Quick Test Checklist

## ⚡ 5-Minute Quick Test

### Prerequisites
- [ ] Development server running (`npm run dev`)
- [ ] User logged in
- [ ] User has at least one active package

### Flow Test
1. **Start Booking**
   - [ ] Go to `/visits`
   - [ ] Click "Book a Visit" button
   - [ ] Should navigate to `/book/select-package`

2. **Select Package**
   - [ ] See list of active packages
   - [ ] Select a package (click radio button)
   - [ ] Click "Continue"
   - [ ] Should navigate to `/book/select-person`

3. **Select Person**
   - [ ] See "Myself" option
   - [ ] See dependents (if any)
   - [ ] Select a person
   - [ ] Click "Continue"
   - [ ] Should navigate to `/book/select-facility`

4. **Select Facility**
   - [ ] See search bar
   - [ ] See list of 3 facilities (mock data)
   - [ ] Type "mukono" in search
   - [ ] See filtered results
   - [ ] Click on a facility card
   - [ ] Should navigate to `/book/facility/[id]`

5. **Facility Details** (Optional)
   - [ ] See facility info (name, hours, services)
   - [ ] Click "Book at this facility"
   - [ ] Should navigate to `/book/select-datetime`

6. **Select Date & Time**
   - [ ] See calendar for current month
   - [ ] Today or past dates should be disabled (gray)
   - [ ] Click on tomorrow or any future date
   - [ ] Date should highlight in green
   - [ ] Select a time slot (Morning/Afternoon/Evening)
   - [ ] Click "Continue"
   - [ ] Should navigate to `/book/confirm`

7. **Confirm Booking**
   - [ ] See booking summary card
   - [ ] Verify all details are correct
   - [ ] See info card about confirmation
   - [ ] Click "Submit booking"
   - [ ] Should navigate to `/book/submitting`

8. **Submitting**
   - [ ] See blue spinner
   - [ ] See "Submitting booking..." message
   - [ ] Wait ~2 seconds
   - [ ] Should auto-navigate to `/book/success`

9. **Success**
   - [ ] See 😊 emoji
   - [ ] See "Booking request sent!" message
   - [ ] See booking summary card
   - [ ] Click "Done"
   - [ ] Should navigate to `/dashboard`

10. **Verify Visit Created**
    - [ ] Go to `/visits`
    - [ ] Check "Upcoming" tab
    - [ ] See new visit with "Pending confirmation" status
    - [ ] Verify all details match booking

**Total Time:** ~3-5 minutes

---

## 🧪 Detailed Feature Tests

### Calendar Tests (2 min)
- [ ] Click left/right arrows to change months
- [ ] Previous arrow disabled on past months
- [ ] Next arrow disabled on months > 30 days out
- [ ] Click on different dates
- [ ] Selected date stays highlighted
- [ ] Can't click disabled dates
- [ ] Sunday disabled if facility closed on Sundays

### Search Tests (1 min)
- [ ] Type "family" → should filter facilities
- [ ] Clear search → should show all facilities
- [ ] Type "xyz123" → should show "No facilities found"
- [ ] Wait 300ms between keystrokes (debounce)

### Back Navigation Tests (2 min)
- [ ] At confirm page, click back
- [ ] Should return to datetime page
- [ ] Selected date/time still selected
- [ ] Click back again to facility list
- [ ] Selected facility persists
- [ ] Continue through flow
- [ ] All selections persist

### Edge Cases (3 min)
- [ ] Start booking with no packages → see empty state
- [ ] Click "Browse packages" → navigate to /packages
- [ ] Select walk-in only facility → can still book
- [ ] Try Sunday when facility closed → date disabled
- [ ] Leave search empty → see all facilities sorted by distance

---

## 🐛 Common Issues & Fixes

### Issue: "No active packages" even though I have packages
**Fix:** Check package status in packageStore
```typescript
// In browser console
usePackageStore.getState().userPackages
// Verify status === 'active' && remainingVisits > 0
```

### Issue: Calendar shows wrong month
**Fix:** Calendar initializes to current month or selected date month
```typescript
// Check selectedDate in store
useBookingStore.getState().session.selectedDate
```

### Issue: Facilities not filtering by service
**Fix:** Check package category mapping
```typescript
// Mock facilities have these services:
// - Consultations, Child Wellness, Lab Tests, Maternal Care
// - Consultations, Lab Tests, Pharmacy
// - Consultations, Child Wellness, Maternal Care
```

### Issue: Visit not appearing in list
**Fix:** Check visitsStore
```typescript
// In browser console
useVisitsStore.getState().visits
// Should see visit with status 'pending_confirmation'
```

### Issue: Back button redirects to start
**Fix:** This is expected if prerequisites are missing. Each page validates:
- select-person: needs packageId
- select-facility: needs packageId + memberId
- select-datetime: needs packageId + memberId + facilityId
- confirm: needs all above + date + timeSlot

---

## 📋 TypeScript Check

```bash
# Run TypeScript compiler to check for errors
npx tsc --noEmit

# Should see no errors in booking flow files
```

---

## 🎯 Visual Checks

### Design Consistency
- [ ] All buttons use primary green (#32C28A)
- [ ] Radio buttons use secondary blue (#3A8DFF)
- [ ] Cards use rounded-2xl
- [ ] Text sizes consistent (h1: text-2xl, h3: text-xl)
- [ ] Spacing consistent (px-6, pt-6, pb-32)

### Mobile Responsiveness
- [ ] Pages work on mobile viewport
- [ ] Buttons not cut off
- [ ] Text readable
- [ ] Fixed bottom buttons visible
- [ ] Calendar fits screen

### Loading States
- [ ] Buttons show disabled state
- [ ] Spinner shows during submission
- [ ] No flash of wrong content

---

## 🚀 Performance Checks

### Page Load Speed
- [ ] Pages load instantly (no data fetching yet)
- [ ] Transitions smooth
- [ ] No jank when navigating

### Search Performance
- [ ] Search input doesn't lag
- [ ] Debounce prevents excessive filtering
- [ ] Results update smoothly

### Store Performance
- [ ] No unnecessary re-renders
- [ ] State updates are fast
- [ ] localStorage persistence works

---

## ✅ Sign-off Checklist

Before marking as complete:
- [ ] All flow pages work end-to-end
- [ ] Visit created successfully
- [ ] Back navigation works
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Visual design matches specs
- [ ] Entry point from Visits page works
- [ ] State management working correctly
- [ ] Date/time selection works
- [ ] Facility search works

---

## 📞 Debug Commands

```typescript
// Check booking state
useBookingStore.getState()

// Check visits state
useVisitsStore.getState()

// Check package state
usePackageStore.getState()

// Reset booking flow
useBookingStore.getState().resetBooking()

// Check facilities
import { MOCK_FACILITIES } from '@/lib/constants'
console.log(MOCK_FACILITIES)
```

---

**Happy Testing! 🎉**

If all checks pass, the Booking Flow MVP is complete and ready for backend integration.
