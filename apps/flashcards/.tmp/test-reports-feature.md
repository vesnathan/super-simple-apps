# Report Feature - Manual Testing Checklist

## What Was Implemented

1. **Report Notification Lambda** - DynamoDB Stream trigger that sends emails when cards are reported
2. **Admin Reports Page** - `/admin/reports` to view and manage pending reports
3. **GraphQL API** - `pendingReports` query and `updateReportStatus` mutation

## Manual Tests

### 1. Report a Card (System Deck)
- [ ] Go to https://flashcards.super-simple-apps.com
- [ ] Open any system deck (e.g., "AWS Cloud Practitioner")
- [ ] Click the flag/report icon on a card
- [ ] Enter a reason and submit
- [ ] Check email at `vesnathan+flashcards@gmail.com`
- [ ] Email should show "System Deck" badge and deck owner as "system"

### 2. Report a Card (User Deck)
- [ ] Sign in to the app
- [ ] Create a new deck with at least one card
- [ ] Make it public
- [ ] Open the deck and report a card
- [ ] Check email - should show "User Deck" badge with your user ID

### 3. Admin Reports Page
- [ ] Sign in to the app
- [ ] Go to https://flashcards.super-simple-apps.com/admin/reports
- [ ] Should see pending reports listed
- [ ] Each report shows:
  - [ ] Deck title and type (System/User)
  - [ ] Card question and answer
  - [ ] Report reason
  - [ ] Timestamp
- [ ] Click "Mark Resolved" - report should disappear from list
- [ ] Click "Dismiss" on another - should also disappear

### 4. Email Content Verification
- [ ] Subject line: `[Flashcards] Card Reported in {System/User} Deck: {title}`
- [ ] Contains deck info and owner
- [ ] Shows card question and answer
- [ ] Shows report reason
- [ ] Has "Review Reports" button linking to admin page

## Unit Tests Needed (Vitest)

### Lambda Handler Tests
- `notifyReportedCard.test.ts`
  - Should send email for system deck reports
  - Should send email for user deck reports
  - Should handle missing deck gracefully
  - Should handle missing card gracefully
  - Should skip non-INSERT events
  - Should escape HTML in email content

### Resolver Tests
- `Mutation.reportCard.test.ts`
  - Should require authentication
  - Should validate input fields
  - Should sanitize reason (trim, max length)
  - Should store report with correct keys

- `Query.pendingReports.test.ts`
  - Should require authentication
  - Should return pending reports only
  - Should respect limit parameter

- `Mutation.updateReportStatus.test.ts`
  - Should require authentication
  - Should validate status enum
  - Should update report status in DB

### Frontend Tests
- `admin/reports/page.test.tsx`
  - Should redirect if not authenticated
  - Should display reports with correct data
  - Should handle resolve action
  - Should handle dismiss action
  - Should show empty state when no reports
