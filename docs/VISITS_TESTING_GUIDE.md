# Visits Feature - Testing Guide

## Overview

This guide provides comprehensive test scenarios for the Visits feature using the mock data in `lib/constants.ts`.

**Test Date Reference:** January 2, 2026

## Mock Data Summary

### Total Visits: 15

**By Status:**
- Upcoming (Confirmed): 3 visits
- Upcoming (Pending): 2 visits
- Completed: 6 visits
- Canceled: 2 visits
- No-show: 2 visits

**By Family Member:**
- Catherine Nakitto (user-1, self): 6 visits
- Ben Were (dep-1): 4 visits
- Sarah Namugga (dep-2): 3 visits
- Michael Okello (dep-3): 2 visits

## Test Scenarios

### 1. Empty State Testing

**How to Test:**
1. Clear the `MOCK_VISITS` array temporarily
2. Visit `/visits`
3. Should see empty state with:
   - 📅 Calendar emoji
   - "Ready for your first visit?" heading
   - "Purchase a package..." subtitle
   - "Browse packages" button
   - "Find a facility" link

**Expected Result:** Clean, centered empty state encouraging user to purchase a package.

---

### 2. Upcoming Tab Testing

**How to Test:**
1. Navigate to `/visits`
2. Default tab should be "Upcoming"
3. Should see 5 visits total

**Expected Visits:**

**Confirmed (3):**
- ✅ **Visit 1** - Catherine Nakitto (Myself)
  - Date: "Tomorrow" (2026-01-03)
  - Time: "At: 09:30 AM"
  - Facility: City Medical Centre
  - Package: Consultations (5 visits pack)
  - Status: Green badge with checkmark "Confirmed"

- ✅ **Visit 2** - Ben Were
  - Date: "Mon, 6 Jan" (within 7 days formatting)
  - Time: "At: 10:00 AM"
  - Facility: Mukono Family Clinic
  - Status: Confirmed

- ✅ **Visit 3** - Sarah Namugga
  - Date: "Thu, 8 Jan" (within 7 days)
  - Time: "At: 2:30 PM"
  - Facility: Long name - "Kampala International Medical Center and Specialist Hospital" (should truncate)
  - Package: Lab Tests (10 tests pack)
  - Status: Confirmed

**Pending Confirmation (2):**
- ⏰ **Visit 4** - Catherine Nakitto (Myself)
  - Date: "On: 15 Feb 2026" (future, beyond 7 days)
  - Time: "At: 11:00 AM"
  - Status: Yellow/orange badge "Pending confirmation"

- ⏰ **Visit 5** - Michael Okello
  - Date: "On: 20 Jan 2026"
  - Time: "At: 3:45 PM"
  - Status: Pending confirmation

**Verify:**
- [ ] Visits sorted by date (soonest first)
- [ ] Date formatting correct for each scenario
- [ ] Status badges show correctly
- [ ] No co-pay amounts shown (only for completed)
- [ ] Cards are clickable with chevron icon
- [ ] Long facility name truncates with ellipsis

---

### 3. Completed Tab Testing

**How to Test:**
1. Click "Completed" tab
2. Should see 6 visits grouped by month

**Expected Groups:**

**January 2026 (1 visit):**
- ✅ **Visit 6** - Catherine Nakitto (Myself)
  - Date: "On: 1 Jan 2026"
  - Time: "At: 10:34 AM"
  - Facility: Mukono Family Clinic
  - Status: Completed
  - Co-pay: "Co-pay: UGX 5,000"

**December 2025 (3 visits):**
- ✅ **Visit 7** - Ben Were
  - Date: "On: 28 Dec 2025"
  - Co-pay: UGX 5,000
  - Status: Completed

- ✅ **Visit 8** - Sarah Namugga
  - Date: "On: 15 Dec 2025"
  - Co-pay: UGX 3,000
  - Status: Remotely Approved (green badge)

- ✅ **Visit 9** - Catherine Nakitto (Myself)
  - Date: "On: 5 Dec 2025"
  - Co-pay: UGX 5,000

**November 2025 (2 visits):**
- ✅ **Visit 10** - Michael Okello
  - Date: "On: 20 Nov 2025"
  - Co-pay: UGX 5,000

- ✅ **Visit 11** - Ben Were
  - Date: "On: 8 Nov 2025"
  - Co-pay: UGX 5,000
  - Status: Remotely Approved

**Verify:**
- [ ] Month headers appear correctly ("January 2026", "December 2025", "November 2025")
- [ ] Visits grouped under correct months
- [ ] Within each month, sorted by date (newest first)
- [ ] All visits show co-pay amounts
- [ ] Both "Completed" and "Remotely Approved" statuses appear
- [ ] Green success badges for all

---

### 4. Canceled Tab Testing

**How to Test:**
1. Click "Canceled" tab
2. Should see 4 visits total (2 canceled + 2 no-show)

**Expected Visits:**

**Canceled (2):**
- ❌ **Visit 12** - Sarah Namugga
  - Date: "On: 20 Dec 2025"
  - Time: "At: 3:00 PM"
  - Status: Red badge "Canceled"
  - Refund note: "Visit refunded - Family emergency"

- ❌ **Visit 13** - Catherine Nakitto (Myself)
  - Date: "On: 25 Nov 2025"
  - Status: Canceled
  - Refund note: "Visit refunded"

**No-show (2):**
- ⚠️ **Visit 14** - Michael Okello
  - Date: "On: 15 Oct 2025"
  - Status: Red badge "No-show"
  - Refund note: "Visit forfeited - No show"

- ⚠️ **Visit 15** - Ben Were
  - Date: "On: 12 Sep 2025"
  - Status: No-show
  - Refund note: "Visit forfeited"

**Verify:**
- [ ] Both canceled and no-show visits appear
- [ ] Red error badges for both types
- [ ] Refund notes displayed in gray text
- [ ] Sorted by date (newest first)
- [ ] No co-pay amounts shown

---

### 5. Member Filter Testing

**How to Test:**
1. Click the member filter dropdown
2. Should see 5 options total

**Expected Options:**
- 🔘 All family members (default selected)
- 🔘 Catherine Nakitto (Myself) - 6 visits
- 🔘 Ben Were - 4 visits
- 🔘 Sarah Namugga - 3 visits
- 🔘 Michael Okello - 2 visits

**Test Each Filter:**

**Catherine Nakitto:**
- Upcoming: 2 visits (visit-1, visit-4)
- Completed: 2 visits (visit-6, visit-9)
- Canceled: 1 visit (visit-13)
- **Total: 5 visits** (Note: 6 total, but distributed across tabs)

**Ben Were:**
- Upcoming: 1 visit (visit-2)
- Completed: 2 visits (visit-7, visit-11)
- Canceled: 1 visit (visit-15 no-show)
- **Total: 4 visits**

**Sarah Namugga:**
- Upcoming: 1 visit (visit-3)
- Completed: 1 visit (visit-8)
- Canceled: 1 visit (visit-12)
- **Total: 3 visits**

**Michael Okello:**
- Upcoming: 1 visit (visit-5)
- Completed: 1 visit (visit-10)
- Canceled: 1 visit (visit-14 no-show)
- **Total: 3 visits** (Note: Only 2 unique, but 3 across tabs)

**Verify:**
- [ ] Dropdown shows all 5 options
- [ ] Selected option shows checkmark
- [ ] "Myself" label appears for primary user
- [ ] Filter updates visit list immediately
- [ ] Tab counts update when filter changes
- [ ] Click outside closes dropdown

---

### 6. "No Results" State Testing

**How to Test:**
1. Select a family member filter
2. Switch to a tab where they have no visits

**Example Scenarios:**
- Filter: Sarah Namugga → Canceled tab → Should have 1 visit
- Filter: All → Switch tabs → Should never show "no results" (we have visits in all tabs)

**To test true "no results":**
- Temporarily remove all visits for a specific member in a specific status
- Select that member and tab
- Should see: "No [tab] visits for selected member"

**Verify:**
- [ ] Message appears centered
- [ ] Text is clear and informative
- [ ] Can switch tabs or filters to see other visits

---

### 7. Date Formatting Testing

**Verify these specific scenarios:**

| Visit | Date | Expected Format | Test Case |
|-------|------|----------------|-----------|
| Visit 1 | 2026-01-03 | "Tomorrow" | Next day |
| Visit 2 | 2026-01-06 | "Mon, 6 Jan" | Within 7 days |
| Visit 3 | 2026-01-08 | "Thu, 8 Jan" | Within 7 days |
| Visit 4 | 2026-02-15 | "On: 15 Feb 2026" | Beyond 7 days |
| Visit 6 | 2026-01-01 | "On: 1 Jan 2026" | Past date |
| Visit 7 | 2025-12-28 | "On: 28 Dec 2025" | Past, different year |

**All times should show:** "At: [time]"

**Verify:**
- [ ] Tomorrow shows as "Tomorrow"
- [ ] Within 7 days shows day name and date
- [ ] Past dates show "On: " prefix with full date
- [ ] Future (>7 days) shows "On: " prefix

---

### 8. Responsive Design Testing

**Mobile (< 640px):**
- [ ] Cards stack vertically with proper spacing
- [ ] Long facility names truncate (visit-3, visit-8, visit-13)
- [ ] Tab filter buttons remain readable
- [ ] Filter dropdown doesn't overflow screen
- [ ] "Book a Visit" button fits in header
- [ ] Bottom nav doesn't overlap content (pb-24 padding)

**Tablet (640px - 1024px):**
- [ ] Visits list remains single column
- [ ] Proper spacing maintained
- [ ] Filter dropdown positioned correctly

**Desktop (> 1024px):**
- [ ] Content max-width prevents excessive spreading
- [ ] Centered layout looks good

---

### 9. Interaction Testing

**Click Actions:**
- [ ] Click visit card → Should navigate to `/visits/[id]` (will be 404 until detail page is built)
- [ ] Click "Book a Visit" → Navigate to `/packages`
- [ ] Click tab → Switch active tab and filter visits
- [ ] Click member filter → Open dropdown
- [ ] Click dropdown option → Update filter and close dropdown
- [ ] Click outside dropdown → Close dropdown without selection change

**Hover States:**
- [ ] Visit cards show hover effect (bg-neutral-50)
- [ ] Tab buttons show hover transition
- [ ] Dropdown options highlight on hover
- [ ] "Book a Visit" button shows hover color change

---

### 10. Badge Testing

**Status Badges:**

| Status | Color | Icon | Text |
|--------|-------|------|------|
| Confirmed | Green bg | Check | "Confirmed" |
| Pending | Yellow/Orange | Clock | "Pending confirmation" |
| Completed | Green bg | Check | "Completed" |
| Remotely Approved | Green bg | Check | "Remotely Approved" |
| Canceled | Red bg | Alert | "Canceled" |
| No-show | Red bg | Alert | "No-show" |

**Verify:**
- [ ] All badges render with correct colors
- [ ] Icons appear next to text
- [ ] Text is readable on background
- [ ] Badges are inline, not full width

---

### 11. Edge Cases

**Long Names:**
- Visit 3, 8, 13: "Kampala International Medical Center and Specialist Hospital"
- Should truncate with ellipsis

**Multiple Dependents:**
- With 3 dependents (Ben, Sarah, Michael) + self = 4 total members
- Filter should show all 5 options (All + 4 members)

**Same Day, Different Times:**
- Add multiple visits on same date to test time sorting

**Empty Tabs:**
- If you filter to show no results, test the empty message

**Month Boundaries:**
- Visits from December 2025 and January 2026 should group separately
- Verify month grouping works correctly

---

## Accessibility Testing

**Keyboard Navigation:**
- [ ] Can tab through all interactive elements
- [ ] Can activate tabs with Enter/Space
- [ ] Can open/close dropdown with keyboard
- [ ] Can select dropdown options with keyboard

**Screen Reader:**
- [ ] Visit status announced correctly
- [ ] Tab counts announced
- [ ] Selected filter announced
- [ ] Empty states have proper messaging

---

## Performance Testing

**Large Dataset:**
- Increase MOCK_VISITS to 100+ items
- Test scrolling performance
- Verify month grouping still works
- Check if pagination is needed

**Filter Performance:**
- Switch filters rapidly
- Verify no lag or flickering
- Ensure smooth transitions

---

## Next Steps After Testing

Once all tests pass:

1. ✅ Document any bugs found
2. ✅ Fix responsive issues if any
3. ✅ Optimize performance if needed
4. ✅ Prepare for Supabase integration
5. ✅ Build visit detail page (`/visits/[id]`)
6. ✅ Add visit booking flow
7. ✅ Implement real-time updates

---

## Testing Checklist

Use this checklist to track your testing progress:

- [ ] Empty state displays correctly
- [ ] Upcoming tab shows 5 visits
- [ ] Completed tab shows 6 visits in 3 month groups
- [ ] Canceled tab shows 4 visits
- [ ] All date formats render correctly
- [ ] Member filter shows 5 options
- [ ] Filtering updates visit lists
- [ ] Tab counts update with filters
- [ ] Long facility names truncate
- [ ] All status badges render correctly
- [ ] Co-pay amounts show for completed visits
- [ ] Refund notes show for canceled visits
- [ ] "Book a Visit" button navigates to /packages
- [ ] Responsive layout works on all screen sizes
- [ ] Hover states work correctly
- [ ] Click interactions work as expected
- [ ] Dropdown opens and closes properly
- [ ] No console errors
- [ ] Smooth scrolling with many visits
- [ ] Bottom nav doesn't overlap content

---

**Happy Testing! 🎉**
