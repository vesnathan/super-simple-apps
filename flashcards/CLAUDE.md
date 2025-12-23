# Simple Flashcards - Development Guide

## Cross-Project Reference - The Story Hub (TSH)

**CRITICAL**: Before implementing ANY feature or fixing ANY issue, ALWAYS check how The Story Hub (TSH) handles it first. TSH is the reference implementation for:

- AWS deployment patterns (CloudFormation, Cognito, DynamoDB, Lambda, API Gateway, S3, CloudFront)
- AWS credentials handling
- Deploy script structure and utilities
- TypeScript patterns and type safety
- Error handling patterns
- Lambda handler implementation
- Resolver patterns and restrictions

**TSH Location**: `/home/liqk1ugzoezh5okwywlr_/dev/the-story-hub/`

**IMPORTANT**: Always read TSH's `CLAUDE.md` file - it contains extensive documentation on:
- AWS deployment patterns
- TypeScript type safety rules
- Lambda and resolver restrictions
- Common mistakes to avoid
- Testing requirements

### When to Check TSH

1. **Before fixing deployment issues** - Check TSH's deploy scripts first
2. **Before adding AWS infrastructure** - Check TSH's CloudFormation templates
3. **Before handling credentials** - Check `deploy/utils/aws-credentials.ts`
4. **Before error handling patterns** - Check TSH's approach first
5. **Before writing Lambda handlers** - Check TSH's handler patterns
6. **Before ANY code pattern decisions** - TSH is the source of truth

### Key TSH Files to Reference

- `CLAUDE.md` - **Read this first!** Contains all development rules and patterns
- `deploy/deploy.ts` - Main deployment orchestration
- `deploy/deployment-manager.ts` - Stack deployment logic
- `deploy/utils/aws-credentials.ts` - AWS credential validation/prompting
- `deploy/utils/logger.ts` - Logging utilities
- `deploy/outputs-manager.ts` - CloudFormation outputs management
- `deploy/resources/` - CloudFormation templates
- `backend/src/handlers/` - Lambda handler patterns

---

## TypeScript Type Safety

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

---

## Validation & Form Patterns

**Use Zod as the single source of truth for type validation:**

1. **API Responses**: Always validate API responses with Zod schemas
2. **Form Validation**: Use React Hook Form with Zod resolver
3. **Schema-First Design**: Zod schema defines the shape, TypeScript infers types from it

```typescript
// Define Zod schema (single source of truth)
const DeckSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  cards: z.array(CardSchema),
});

// Infer TypeScript type from schema
type Deck = z.infer<typeof DeckSchema>;

// Validate API responses
const deck = DeckSchema.parse(apiResponse);

// Use with React Hook Form
const form = useForm<Deck>({
  resolver: zodResolver(DeckSchema),
});
```

**See TSH's CLAUDE.md** for detailed patterns on:
- Validation schema patterns matching GraphQL fragments
- Fragment-specific Zod schemas
- API function validation

---

## Package Manager

**ALWAYS use `yarn`** - never use npm.

---

## Project Structure

```
simple-flashcards/
├── frontend/          # Next.js frontend
├── backend/           # Lambda handlers and backend logic
├── deploy/            # Deployment scripts and CloudFormation templates
│   ├── deploy.ts      # Main deployment script
│   ├── outputs-manager.ts
│   ├── resources/     # CloudFormation templates
│   │   ├── Cognito/
│   │   ├── DynamoDB/
│   │   ├── Lambda/
│   │   ├── ApiGateway/
│   │   └── CloudFront/
│   └── utils/
│       ├── logger.ts
│       └── aws-credentials.ts
├── types/             # Shared TypeScript types
└── .env               # Environment variables (AWS credentials)
```

---

## Deployment

Run from project root:

```bash
yarn deploy:dev    # Deploy to dev stage
yarn deploy:prod   # Deploy to prod stage
```

The deploy script:
1. Validates AWS credentials (prompts if missing/invalid)
2. Deploys Cognito (User Pool + Client)
3. Deploys DynamoDB table
4. Builds and uploads Lambda code to S3
5. Deploys Lambda functions
6. Deploys API Gateway
7. Deploys S3 + CloudFront for frontend
8. Builds and uploads frontend
9. Invalidates CloudFront cache

All outputs are saved to `deploy/deployment-outputs.json`.

---

## Problem Solving Principles

**ALWAYS fix the underlying problem - NEVER apply band-aid solutions!**

When encountering an issue:
1. Investigate the root cause first
2. Understand WHY the problem exists
3. Fix the actual problem, not the symptoms
4. Seeding test data to work around a broken feature is a band-aid - fix the feature instead

Example:
- BAD: "Public decks aren't loading, let me seed some test data to verify"
- GOOD: "Public decks aren't loading, let me trace the issue from frontend → API → Lambda → DynamoDB and fix the actual bug"

---

## DynamoDB Best Practices

**NEVER use DynamoDB Scan operations - they are expensive and don't scale!**

Always use Query with appropriate indexes:
- Design tables with access patterns in mind
- Create GSIs for each query pattern needed
- Use Query operations on indexes, never Scan

Example:
- BAD: `ddb.scan({ FilterExpression: "userId = :userId" })`
- GOOD: `ddb.query({ IndexName: "UserDecksIndex", KeyConditionExpression: "userId = :userId" })`

---

## Frontend Environment Configuration

**deployment-outputs.json is the single source of truth for infrastructure URLs!**

- `next.config.js` reads from `../deploy/deployment-outputs.json` at build time
- Deployment outputs take priority over `.env` files
- Never create manual `.env` files in frontend - they can override correct deployment URLs
- If you see wrong API URLs in the build, check for stale `.env` files

---

## Dev Server

**NEVER run dev servers** - the user manages dev servers themselves. Do not run `yarn dev`, `npm run dev`, or similar commands.

---

## Notes for Future Sessions

- Always read this file at the start of a new session
- **ALWAYS check TSH before implementing solutions**
- Update this file with significant changes and lessons learned
