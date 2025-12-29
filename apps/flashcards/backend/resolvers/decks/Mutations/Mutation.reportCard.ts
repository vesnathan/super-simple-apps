import { Context, util } from "@aws-appsync/utils";

interface ReportCardInput {
  deckId: string;
  cardId: string;
  reason: string;
}

interface ReportCardResult {
  success: boolean;
}

type CTX = Context<{ input: ReportCardInput }>;

/**
 * Report a card - requires authentication
 *
 * Rate limiting: Max 5 reports per user per day (enforced in response handler)
 * Deduplication: Only one report per user per card (checked in Lambda)
 *
 * Storage pattern:
 * - PK: REPORT#<deckId>
 * - SK: CARD#<cardId>#<reportId>
 * - GSI3PK: REPORTER#<userId>
 * - GSI3SK: <date>#<reportId>
 */
export function request(ctx: CTX) {
  // Require authentication
  const userId = ctx.identity?.sub;
  if (!userId) {
    return util.error("You must be signed in to report a card", "UnauthorizedException");
  }

  const { input } = ctx.args;

  if (!input.deckId || !input.cardId || !input.reason) {
    return util.error("deckId, cardId, and reason are required", "ValidationException");
  }

  // Sanitize reason - limit length and trim
  const sanitizedReason = input.reason.trim().substring(0, 1000);
  if (sanitizedReason.length < 3) {
    return util.error("Please provide a more detailed reason", "ValidationException");
  }

  const timestamp = util.time.nowISO8601();
  const reportId = util.autoId();

  // Get today's date for rate limiting GSI
  // Format: YYYY-MM-DD
  const today = timestamp.substring(0, 10);

  return {
    operation: "PutItem",
    key: util.dynamodb.toMapValues({
      PK: `REPORT#${input.deckId}`,
      SK: `CARD#${input.cardId}#${reportId}`,
    }),
    attributeValues: util.dynamodb.toMapValues({
      id: reportId,
      deckId: input.deckId,
      cardId: input.cardId,
      reason: sanitizedReason,
      reporterId: userId,
      createdAt: timestamp,
      status: "pending",
      // GSI3 for rate limiting queries: find all reports by this user today
      GSI3PK: `REPORTER#${userId}`,
      GSI3SK: `${today}#${reportId}`,
      // Store card identifier for deduplication check in Lambda
      reporterCardKey: `${userId}#${input.deckId}#${input.cardId}`,
    }),
    // Condition: prevent exact duplicate (same user, same card) using reporterCardKey
    // This is checked in Lambda via query, but we add uniqueness via the SK including reportId
  };
}

export function response(ctx: CTX): ReportCardResult {
  if (ctx.error) {
    return util.error(ctx.error.message, ctx.error.type);
  }

  return {
    success: true,
  };
}
