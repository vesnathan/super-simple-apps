# Client Presentation: AI-Augmented Development with Claude Code + Opus 4.5

## The Core Pattern: CLAUDE.md as Institutional Knowledge

Your CLAUDE.md becomes the AI's "onboarding document" - it follows your:
- Architecture decisions
- Coding standards
- Common gotchas specific to your stack
- Reference implementations to follow

**Real Example from Our Projects:**
> "ALWAYS check The Story Hub before implementing ANY feature"

This single line prevents the AI from reinventing patterns that already exist and work.

---

## Concrete Results from Our Projects

| Project | What AI Handled Well | Human Direction Required |
|---------|---------------------|-------------------------|
| **The Story Hub** | 20+ features: Patreon OAuth, feature voting, MFA, draft editor | Architecture decisions, security review |
| **Super Simple Flashcards** | Full test suite (16 tests in one session), Lambda handlers, GraphQL resolvers | DynamoDB schema design, deployment verification |
| **Card Counting Trainer** | Complex React state, game logic, animations | Game design decisions |

---

## What Works Exceptionally Well

### 1. Test Writing (Real Session Example)
- Asked for tests -> Got 16 comprehensive tests covering:
  - Event filtering
  - Error handling
  - Edge cases (missing data, XSS escaping)
  - Multiple record processing
- Proper mocking patterns for AWS SDK
- Fixed its own failing test by understanding module load timing

### 2. Following Established Patterns
- AppSync resolvers with strict runtime restrictions (no arrow functions, no .map/.filter callbacks)
- AI learned these constraints once -> applies them consistently

### 3. Complex Integrations
- Patreon webhook handler with Secrets Manager caching
- OAuth flows
- DynamoDB Stream triggers -> SES email notifications

### 4. Deployment Scripts
- 79KB deployment orchestration script
- Multi-stack CloudFormation coordination
- Lambda compilation, S3 uploads, cache invalidation

---

## What Requires Human Guidance

| Area | Why |
|------|-----|
| **Architecture** | AI proposes options, human decides trade-offs |
| **Security-critical code** | Trust but verify - always review auth, input validation |
| **Novel problems** | AI excels at patterns it's seen, struggles with truly new territory |
| **Business logic nuances** | "Should this be allowed?" requires domain knowledge |

---

## The Guardrails That Make It Work

From our CLAUDE.md files:

```markdown
# TypeScript Type Safety
NEVER use `any` type - EVER. Use `unknown` with type guards.

# DynamoDB
NEVER use Scan operations - design indexes for access patterns.

# AppSync Resolvers (Gotchas)
- ONLY for...of loops (not traditional for loops)
- NO inline functions (.map(), .filter() with callbacks)
- NO external npm packages
```

These rules get applied consistently across hundreds of files.

---

## Quantifiable Session Example

**Task:** Add vitest tests for report notification Lambda

**AI Output:**
- Created `vitest.setup.ts` with proper env vars
- Created comprehensive test file with 16 tests
- Mocked AWS SDK (DynamoDB, SES) correctly
- Handled module re-import pattern for env var testing
- Fixed failing test autonomously

**Human Input:**
- "Add vitest tests" (the request)
- Waited while it worked

**Time:** ~10 minutes for production-ready tests

---

## Project Portfolio Summary

### The Story Hub (Production)
- **Tech Stack:** Next.js, AWS AppSync/GraphQL, Cognito (MFA, OAuth), DynamoDB, CloudFormation
- **AI-Built Features:**
  - Draft Editor with clipboard/version history
  - Feature voting system
  - Patreon integration (webhooks, OAuth, daily sync)
  - User authentication flows
  - 100% test coverage requirement

### Super Simple Apps (Monorepo)
- **Apps:** Flashcards, Invoicing, Landing
- **Tech Stack:** Next.js frontends, AWS Lambda/AppSync backends, DynamoDB
- **AI-Built Features:**
  - Card reporting system with email notifications
  - Admin reports dashboard
  - GraphQL resolvers with strict AppSync runtime compliance
  - Comprehensive test suites

### Card Counting Trainer
- **Tech Stack:** Next.js with complex React state
- **AI-Built Features:**
  - Game state management
  - UI animations
  - Advanced React hooks patterns

---

## Documented Lessons Learned (From CLAUDE.md)

### AppSync Resolver Restrictions (Critical)
```
- ONLY for...of loops allowed (not traditional for loops)
- NO inline functions (.map(), .filter(), .sort() with callbacks)
- NO while/do-while loops
- NO continue statements
- NO new Date(), use util.time.nowISO8601()
- NO String() constructor, use template literals
- NO external npm packages (uuid, moment, etc.)
- MUST use util.autoId(), util.time.*, util.dynamodb.toMapValues()
```

### Deployment Gotchas
- Lambda code doesn't update on CloudFormation refresh (need direct API call)
- GraphQL schema changes require content-based versioning (hash in S3 key)
- File permissions (644 vs 600) silently break merge scripts

### React/Auth Patterns
- Protected routes need useEffect for redirects, not during render
- Auth hooks need Amplify Hub listeners, not just empty dependency arrays

---

## Honest Limitations

1. **Context window** - Long sessions need summarization (we use session continuations)
2. **Verification required** - AI doesn't know if code actually works until you run it
3. **Learning curve** - Team needs to learn effective prompting
4. **Works best with foundations** - Clean codebase, clear patterns, existing tests to reference

---

## Bottom Line

> "Claude Code with Opus 4.5 is like having a very fast, very consistent junior-to-mid developer who never gets tired, follows your patterns exactly, and writes tests without complaining. But it needs a senior developer holding the steering wheel."

**Productivity multiplier:** 2-3x for experienced developers who know how to direct it.

---

## Key Differentiators vs Other AI Tools

1. **CLAUDE.md Pattern** - Persistent project context across sessions
2. **Full Codebase Access** - Can read, search, and understand entire projects
3. **Tool Integration** - Direct file editing, git operations, bash commands
4. **Session Continuity** - Summarization allows unlimited context through auto-summarization
5. **Industry Standard Compliance** - Follows TypeScript, AWS, and framework best practices when directed

---

## Recommended Approach for New Projects

1. **Start with CLAUDE.md** - Document your architecture decisions, coding standards, and known gotchas
2. **Establish a Reference Project** - "Always check X before implementing" prevents pattern divergence
3. **Require Tests** - AI writes excellent tests when you ask for them
4. **Human Reviews Deployments** - AI prepares, human executes critical operations
5. **Iterate on CLAUDE.md** - Add lessons learned as you discover gotchas

---

## Questions to Expect from Client

**Q: Will it replace our developers?**
A: No. It amplifies them. Senior devs become 2-3x more productive. It handles boilerplate so developers focus on architecture and business logic.

**Q: How do we ensure code quality?**
A: CLAUDE.md enforces standards, but human code review remains essential for security-critical paths and business logic.

**Q: What's the learning curve?**
A: 1-2 weeks for developers to learn effective prompting. The CLAUDE.md pattern accelerates this by codifying what works.

**Q: What about security?**
A: AI-generated code should be reviewed like any code. We enforce "never commit secrets" rules and review all auth-related changes.

**Q: ROI?**
A: Based on our experience: 2-3x productivity gain on established patterns, 1.5x on novel work. Biggest wins are tests, boilerplate, and refactoring.
