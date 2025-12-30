# Super Simple Apps - Claude Code Guide

## Project Overview

**Super Simple Apps** - Monorepo containing multiple simple applications.
- Simple Flashcards (main app with AppSync/GraphQL)
- CRM
- Invoice
- Job Timer
- Landing page

**Location**: `/home/liqk1ugzoezh5okwywlr_/dev/super-simple-apps/`

---

## Shared Documentation

**IMPORTANT**: Read the architecture guidelines that apply to ALL projects:

- **Architecture Guidelines**: `/home/liqk1ugzoezh5okwywlr_/dev/ARCHITECTURE_GUIDELINES.md`
  - Includes all standards, patterns, and project compliance status

**Reference Implementation**: Check The Story Hub for patterns:
- `/home/liqk1ugzoezh5okwywlr_/dev/the-story-hub/`

---

## Communication Style

**Be direct and honest - never sugar coat or agree just to please.**

- Give your best technical advice, even if it contradicts what user said
- Point out potential problems, security issues, or better alternatives
- "I think there's a better approach..." is more valuable than silent agreement

---

## Critical Rules

### TypeScript Type Safety

**NEVER USE `any` TYPE - EVER!**

Use `unknown` with type guards instead:

```typescript
// WRONG
function handleError(error: any) { ... }

// CORRECT
function handleError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
```

### Problem Solving

**ALWAYS fix the underlying problem - NEVER apply band-aid solutions!**

- BAD: "Public decks aren't loading, let me seed some test data"
- GOOD: "Public decks aren't loading, let me trace the issue from frontend → API → Lambda → DynamoDB"

### DynamoDB

**NEVER use DynamoDB Scan operations - they are expensive and don't scale!**

```typescript
// BAD
ddb.scan({ FilterExpression: "userId = :userId" })

// GOOD
ddb.query({ IndexName: "UserDecksIndex", KeyConditionExpression: "userId = :userId" })
```

---

## Validation & Form Patterns

**Use Zod as the single source of truth:**

```typescript
// Define Zod schema
const DeckSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  cards: z.array(CardSchema),
});

// Infer TypeScript type from schema
type Deck = z.infer<typeof DeckSchema>;

// Use with React Hook Form
const form = useForm<Deck>({
  resolver: zodResolver(DeckSchema),
});
```

---

## AppSync Resolver Restrictions (Flashcards App)

### Required Patterns

- **Imports**: `import { util, Context } from "@aws-appsync/utils"`
- **IDs**: `util.autoId()` - NOT `uuid`
- **Timestamps**: `util.time.nowISO8601()` - NOT `new Date().toISOString()`

### NOT Allowed

- `new Date()`, `Date.now()` - causes deployment failure
- External npm packages
- `while`, `do...while` loops
- **ALL traditional `for` loops** - only `for...of` and `for...in` allowed
- **Inline functions** - `.sort((a, b) => ...)`, `.map((x) => ...)` NOT ALLOWED
- `continue` statements

### Workarounds

**For sorting without .sort():**
```typescript
const used: Record<string, boolean> = {};
const result: Item[] = [];

for (const _idx of [0, 1, 2, 3, 4]) {
  let maxItem = null;
  let maxValue = -1;

  for (const item of items) {
    if (!used[item.id] && item.value > maxValue) {
      maxValue = item.value;
      maxItem = item;
    }
  }

  if (maxItem !== null) {
    used[maxItem.id] = true;
    result.push(maxItem);
  }
}
```

### Resolver Registration

**CRITICAL**: Creating a resolver file is NOT enough - it MUST be registered in CloudFormation:

```yaml
# deploy/resources/AppSync/appsync.yaml
PopularDecksResolver:
  Type: AWS::AppSync::Resolver
  Properties:
    ApiId: !GetAtt GraphQlApi.ApiId
    TypeName: Query
    FieldName: popularDecks
    # ...
```

---

## Project Structure

```
super-simple-apps/
├── apps/
│   ├── flashcards/        # Main app with AppSync
│   │   ├── frontend/
│   │   └── backend/
│   ├── crm/               # CRM app
│   ├── invoice/           # Invoice app
│   ├── job-timer/         # Job timer app
│   └── landing/           # Landing page
├── deploy/                # Deployment scripts
└── types/                 # Shared types
```

---

## Commands

### Development

```bash
yarn dev                   # Start dev server
yarn build                 # Build
yarn lint                  # Run linter
```

### Deployment

```bash
yarn deploy:dev            # Deploy to dev stage
yarn deploy:prod           # Deploy to prod stage
```

---

## Frontend Environment

**deployment-outputs.json is the single source of truth for infrastructure URLs!**

- `next.config.js` reads from `../deploy/deployment-outputs.json` at build time
- Never create manual `.env` files in frontend - they can override correct URLs

---

## Dev Server

**NEVER run dev servers** - the user manages dev servers themselves.

---

## Compliance Status

**FULLY COMPLIANT** - All apps meet architecture guidelines:
- CRM, Invoice, Job Timer: React Hook Form + Zod
- Flashcards: API split into domain modules
- All `any` types fixed across all apps

---

## Notes for Future Sessions

- Always read this file at the start of a new session
- **ALWAYS check TSH before implementing solutions**
- Update this file with significant changes and lessons learned
