import { graphqlClient } from "@/lib/amplify";
import { PENDING_REPORTS } from "@/graphql/queries";
import { UPDATE_REPORT_STATUS } from "@/graphql/mutations";

// Type for GraphQL result with errors
interface GraphQLResult<T> {
  data?: T;
  errors?: Array<{ message: string }>;
}

// Report type definition
export interface Report {
  id: string;
  deckId: string;
  cardId: string;
  reason: string;
  status: string;
  createdAt: string;
}

export const reportService = {
  /**
   * Get pending reports (admin only)
   */
  async getPendingReports(limit: number = 50): Promise<{ reports: Report[]; nextToken: string | null }> {
    const result = (await graphqlClient.graphql({
      query: PENDING_REPORTS,
      variables: { limit },
      authMode: "userPool",
    })) as GraphQLResult<{
      pendingReports: { reports: Report[]; nextToken: string | null };
    }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.pendingReports ?? { reports: [], nextToken: null };
  },

  /**
   * Update report status (resolve or dismiss)
   */
  async updateReportStatus(
    reportId: string,
    deckId: string,
    cardId: string,
    status: "pending" | "resolved" | "dismissed"
  ): Promise<{ success: boolean; report: Report | null }> {
    const result = (await graphqlClient.graphql({
      query: UPDATE_REPORT_STATUS,
      variables: { reportId, deckId, cardId, status },
      authMode: "userPool",
    })) as GraphQLResult<{
      updateReportStatus: { success: boolean; report: Report | null };
    }>;

    if (result.errors?.length) {
      throw new Error(result.errors[0].message);
    }

    return result.data?.updateReportStatus ?? { success: false, report: null };
  },
};
