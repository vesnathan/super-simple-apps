import { Context, util } from "@aws-appsync/utils";

interface PendingReportsArgs {
  limit?: number;
}

interface Report {
  id: string;
  deckId: string;
  cardId: string;
  reason: string;
  status: string;
  createdAt: string;
}

interface ReportsResult {
  reports: Report[];
  nextToken: string | null;
}

type CTX = Context<PendingReportsArgs>;

export function request(ctx: CTX) {
  // Must be authenticated
  const userId = ctx.identity?.sub;
  if (!userId) {
    return util.error("Unauthorized", "UnauthorizedException");
  }

  const limit = ctx.args.limit ?? 50;

  // Scan for all items where PK begins with "REPORT#" and status is "pending"
  // Note: Scan is not ideal but reports should be relatively rare
  return {
    operation: "Scan",
    filter: {
      expression: "begins_with(PK, :pk) AND #status = :status",
      expressionNames: {
        "#status": "status",
      },
      expressionValues: util.dynamodb.toMapValues({
        ":pk": "REPORT#",
        ":status": "pending",
      }),
    },
    limit: limit,
  };
}

export function response(ctx: CTX): ReportsResult {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }

  const items = ctx.result?.items ?? [];
  const reports: Report[] = [];

  // Transform items to Report type using for...of
  for (const item of items) {
    reports.push({
      id: item.id as string,
      deckId: item.deckId as string,
      cardId: item.cardId as string,
      reason: item.reason as string,
      status: item.status as string,
      createdAt: item.createdAt as string,
    });
  }

  return {
    reports: reports,
    nextToken: ctx.result?.nextToken ?? null,
  };
}
