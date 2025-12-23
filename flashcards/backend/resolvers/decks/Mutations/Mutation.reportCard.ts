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

export function request(ctx: CTX) {
  const { input } = ctx.args;

  if (!input.deckId || !input.cardId || !input.reason) {
    return util.error("deckId, cardId, and reason are required", "ValidationException");
  }

  // Store report in a separate item for review
  // PK: REPORT#<deckId>#<cardId>
  // SK: REPORT#<timestamp>
  const timestamp = util.time.nowISO8601();
  const reportId = util.autoId();

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
      reason: input.reason,
      createdAt: timestamp,
      status: "pending",
    }),
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
