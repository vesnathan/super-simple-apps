# Implementation Plan: Multiple Choice Cards, Explanations, Tags & Content

## Overview

This plan covers three major features:
1. **Multiple Choice Cards** - Option for 3-choice multiple choice with explanation
2. **Tags** - Tag system for better search and organization
3. **Pre-built Content Decks** - IT certifications, vehicle licenses, forklift tests, etc.

---

## Part 1: Multiple Choice Cards with Explanations

### 1.1 Update Card Data Model

**Files to modify:**
- `types/deck.ts` - Add new Card fields
- `shared/src/types/gqlTypes.ts` - Will be regenerated
- `backend/combined_schema.graphql` - GraphQL schema
- `frontend/src/schemas/deck.ts` - Zod validation

**New Card Interface:**
```typescript
export interface Card {
  id: string;
  question: string;
  answer: string;
  // New fields
  cardType: 'text' | 'multiple-choice';  // Defaults to 'text'
  options?: string[];                     // 3 options for multiple choice
  correctOptionIndex?: number;            // 0, 1, or 2
  explanation?: string;                   // Explanation shown after answer
}
```

### 1.2 Update GraphQL Schema

**File:** `backend/schema/Deck.graphql`

```graphql
type Card @aws_iam @aws_cognito_user_pools {
  id: ID!
  question: String!
  answer: String!
  cardType: String          # 'text' or 'multiple-choice'
  options: [String!]        # Multiple choice options
  correctOptionIndex: Int   # Index of correct option (0-2)
  explanation: String       # Explanation for the answer
}

input CardInput {
  id: ID!
  question: String!
  answer: String!
  cardType: String
  options: [String!]
  correctOptionIndex: Int
  explanation: String
}
```

### 1.3 Update Frontend Validation Schema

**File:** `frontend/src/schemas/deck.ts`

```typescript
export const CardSchema = z.object({
  id: z.string(),
  question: z.string(),
  answer: z.string(),
  cardType: z.enum(['text', 'multiple-choice']).default('text'),
  options: z.array(z.string()).length(3).optional(),
  correctOptionIndex: z.number().min(0).max(2).optional(),
  explanation: z.string().optional(),
}) satisfies z.ZodType<Card>;
```

### 1.4 Update AddCardModal Component

**File:** `frontend/src/components/cards/AddCardModal.tsx`

Changes:
1. Add toggle switch: "Simple Text" vs "Multiple Choice"
2. When "Multiple Choice" selected:
   - Hide answer text field
   - Show 3 option input fields
   - Add radio buttons to select correct answer
3. Add "Explanation" textarea (always visible, optional)
4. Update form submission to include new fields

**UI Layout:**
```
┌─────────────────────────────────────┐
│ Add Card                            │
├─────────────────────────────────────┤
│ Question: [________________]        │
│                                     │
│ Card Type: [Text ▼] / [Multiple Choice] │
│                                     │
│ ── If Text ──                       │
│ Answer: [________________]          │
│                                     │
│ ── If Multiple Choice ──            │
│ ○ Option A: [________________]      │
│ ○ Option B: [________________]      │
│ ● Option C: [________________] ✓    │
│                                     │
│ Explanation (optional):             │
│ [____________________________]      │
│ [____________________________]      │
│                                     │
│              [Cancel] [Add Card]    │
└─────────────────────────────────────┘
```

### 1.5 Update DeckView Study Mode

**File:** `frontend/src/components/decks/DeckView.tsx`

Changes for Multiple Choice cards:
1. Display question as normal
2. Show 3 clickable option buttons instead of flip
3. On selection:
   - Highlight correct answer (green)
   - Highlight wrong selection (red) if incorrect
   - Show explanation below
4. "Got It" / "Next" buttons appear after selection

**UI for Multiple Choice Study:**
```
┌─────────────────────────────────────┐
│ What is the capital of France?      │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ A) London                       │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ B) Paris                    ✓   │ │ <- Green if correct
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ C) Berlin                       │ │
│ └─────────────────────────────────┘ │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Paris is the capital and most   │ │
│ │ populous city of France.        │ │
│ └─────────────────────────────────┘ │
│                                     │
│        [Got It]    [Next]           │
└─────────────────────────────────────┘
```

### 1.6 Update Backend Handlers

**Files:**
- `backend/src/handlers/cards/updateUserCard.ts`
- Any resolver that creates/updates cards

Ensure new fields are passed through correctly.

---

## Part 2: Tags for Better Search

### 2.1 Update Deck Data Model

**File:** `types/deck.ts`

```typescript
export interface Deck {
  // ... existing fields
  tags?: string[];  // Array of tag strings
}
```

### 2.2 Update GraphQL Schema

**File:** `backend/schema/Deck.graphql`

```graphql
type Deck {
  # ... existing fields
  tags: [String!]
}

input CreateDeckInput {
  # ... existing fields
  tags: [String!]
}
```

### 2.3 Add Tag Input to Deck Creation/Edit

**File:** `frontend/src/components/decks/AddDeckModal.tsx`

- Add tag input field with autocomplete
- Support comma-separated or chip-based entry
- Show popular/recent tags as suggestions

### 2.4 Add Tag Filtering to Public Decks

**File:** `frontend/src/app/page.tsx` or deck listing component

- Add tag filter chips/dropdown
- Filter decks by selected tags
- Show tags on deck cards

### 2.5 Create DynamoDB GSI for Tag Search

**File:** `deploy/resources/DynamoDB/decks-table.yaml`

Add GSI for efficient tag-based queries (or use scan with filter for MVP).

---

## Part 3: Pre-built Content Decks

### 3.1 Content Categories to Create

**IT Certifications:**
- CompTIA A+ (Core 1 & Core 2)
- CompTIA Network+
- CompTIA Security+
- AWS Cloud Practitioner
- AWS Solutions Architect Associate
- Azure Fundamentals (AZ-900)
- Google Cloud Associate
- Cisco CCNA
- ITIL Foundation

**Vehicle Licenses (by Country/State):**

**Australia:**
- Car Learners (NSW, VIC, QLD, WA, SA, TAS, NT, ACT)
- Motorcycle Learners (by state)
- MR (Medium Rigid) License
- HR (Heavy Rigid) License
- HC (Heavy Combination) License
- MC (Multi-Combination) License

**USA:**
- DMV Written Test (by state - CA, TX, FL, NY, etc.)
- CDL (Commercial Driver License) - Class A, B, C
- Motorcycle Permit Test

**UK:**
- DVLA Theory Test (Car)
- DVLA Theory Test (Motorcycle)
- HGV Theory Test

**Forklift/Machinery:**
- Forklift License (Australia - by state)
- Forklift Certification (USA - OSHA)
- Forklift License (UK)
- Elevated Work Platform (EWP)
- Crane Operation

**Other Traffic-Driving Ideas:**
- First Aid Certification
- Food Handler's Permit
- RSA (Responsible Service of Alcohol) - Australia
- Boating License (by state/country)
- Drone Pilot License (Part 107 USA, CASA Australia)

### 3.2 Content Creation Strategy

**Option A: Manual Creation**
- Create JSON files with deck content
- Seed script to upload as public decks
- Time-consuming but quality controlled

**Option B: AI-Assisted Generation**
- Use Claude/GPT to generate questions from official study guides
- Human review for accuracy
- Faster but needs verification

**Option C: Community Contribution**
- Allow users to submit decks
- Moderation queue for public decks
- Crowdsourced content

**Recommended: Hybrid Approach**
1. Start with 5-10 high-demand decks (AI-generated, human-verified)
2. Add community contribution feature later
3. Focus on Australia first (your market), then expand

### 3.3 Content File Structure

```
/content/
  /it-certifications/
    comptia-a-plus-core1.json
    comptia-a-plus-core2.json
    aws-cloud-practitioner.json
    ...
  /vehicle-licenses/
    /australia/
      nsw-car-learners.json
      vic-car-learners.json
      qld-car-learners.json
      ...
    /usa/
      california-dmv.json
      texas-dmv.json
      ...
  /forklift/
    australia-forklift.json
    usa-osha-forklift.json
    ...
```

### 3.4 Seed Script for Content

**File:** `backend/src/scripts/seed-content.ts`

- Read JSON files from content directory
- Create decks with proper tags
- Mark as public
- Set a "system" user as owner

---

## Implementation Order

### Phase 1: Core Card Enhancements (Priority: High)
1. Update Card data model (types, GraphQL, Zod)
2. Update AddCardModal with card type toggle
3. Add explanation field
4. Update DeckView for multiple choice display
5. Test end-to-end

### Phase 2: Tags (Priority: Medium)
1. Add tags to Deck model
2. Update deck creation forms
3. Add tag display to deck cards
4. Add tag filtering to public decks

### Phase 3: Content Creation (Priority: High for SEO)
1. Create content JSON structure
2. Start with 5 high-demand Australian decks:
   - NSW Car Learners
   - VIC Car Learners
   - QLD Car Learners
   - CompTIA A+
   - AWS Cloud Practitioner
3. Create seed script
4. Deploy and verify

### Phase 4: Expansion
1. Add more state/country variations
2. Add more IT certifications
3. Community contribution features

---

## Additional Traffic-Driving Ideas

1. **Language Learning** - Common phrases in Spanish, French, Japanese, etc.
2. **Medical Terminology** - Nursing students, med students
3. **Real Estate License** - By state (huge market)
4. **Bartender/Cocktail Knowledge** - Popular hobby
5. **Music Theory** - Scales, chords, notation
6. **Citizenship Tests** - USA, Australia, UK, Canada
7. **GRE/GMAT/LSAT Vocabulary** - Test prep market
8. **Anatomy & Physiology** - Always in demand
9. **Historical Dates & Events** - School curriculum
10. **Programming Interview Questions** - Tech workers

---

## SEO Considerations

Each pre-built deck should have:
- Descriptive title with keywords
- Tags matching search terms
- Generated static HTML (already implemented)
- Schema.org structured data for learning resources

Example titles:
- "NSW Car Learner Driver Knowledge Test - 200+ Questions"
- "CompTIA A+ Core 1 (220-1101) Practice Questions 2024"
- "Australian Forklift License Test Questions - All States"
