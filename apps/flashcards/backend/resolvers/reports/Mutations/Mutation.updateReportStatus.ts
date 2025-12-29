import { Context, util } from "@aws-appsync/utils";

interface UpdateReportStatusArgs {
  reportId: string;
  deckId: string;
  cardId: string;
  status: "pending" | "resolved" | "dismissed";
}

interface UpdateReportResult {
  success: boolean;
  report: {
    id: string;
    deckId: string;
    cardId: string;
    reason: string;
    status: string;
    createdAt: string;
  } | null;
}

type CTX = Context<UpdateReportStatusArgs>;

export function request(ctx: CTX) {
  // Must be authenticated
  const userId = ctx.identity?.sub;
  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const { reportId, deckId, cardId, status } = ctx.args;

  if (!reportId || !deckId || !cardId || !status) {
    return util.error(
      "reportId, deckId, cardId, and status are required",
      "ValidationException"
    );
  }

  // Validate status
  if (status !== "pending" && status !== "resolved" && status !== "dismissed") {
    return util.error(
      "status must be 'pending', 'resolved', or 'dismissed'",
      "ValidationException"
    );
  }

  // Update the report status
  return {
    operation: "UpdateItem",
    key: util.dynamodb.toMapValues({
      PK: `REPORT#${deckId}`,
      SK: `CARD#${cardId}#${reportId}`,
    }),
    update: {
      expression: "SET #status = :status, resolvedAt = :resolvedAt, resolvedBy = :resolvedBy",
      expressionNames: {
        "#status": "status",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":status": status,
        ":resolvedAt": util.time.nowISO8601(),
        ":resolvedBy": userId,
      }),
    },
    condition: {
      expression: "attribute_exists(PK)",
    },
  };
}

export function response(ctx: CTX): UpdateReportResult {
  if (ctx.error) {
    // Check if the error is because the item doesn't exist
    if (ctx.error.type === "ConditionalCheckFailedException") {
      return util.error("Report not found", "NotFoundError");
    }
    util.error(ctx.error.message, ctx.error.type);
  }

  const item = ctx.result;
  if (!item) {
    return {
      success: false,
      report: null,
    };
  }

  return {
    success: true,
    report: {
      id: item.id as string,
      deckId: item.deckId as string,
      cardId: item.cardId as string,
      reason: item.reason as string,
      status: item.status as string,
      createdAt: item.createdAt as string,
    },
  };
}
