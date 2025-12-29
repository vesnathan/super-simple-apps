"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Spinner } from "@nextui-org/react";
import { Button } from "@super-simple-apps/shared-assets";
import { toast } from "react-toastify";
import { reportService, deckService, Report } from "@/services/api";
import { useAuthStore } from "@/stores/authStore";
import type { DeckDetail } from "@/schemas/deck";

interface ReportWithDetails extends Report {
  deck?: DeckDetail | null;
  card?: {
    id: string;
    question: string;
    answer: string;
  } | null;
}

export default function AdminReportsPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuthStore();
  const [reports, setReports] = useState<ReportWithDetails[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Load reports when user is authenticated
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      toast.error("Please sign in to access admin features");
      router.push("/");
      return;
    }

    loadReports();
  }, [user, authLoading, router]);

  const loadReports = async () => {
    try {
      setIsLoading(true);
      const { reports: pendingReports } = await reportService.getPendingReports();

      // Load deck details for each report
      const reportsWithDetails: ReportWithDetails[] = await Promise.all(
        pendingReports.map(async (report) => {
          try {
            const deck = await deckService.getDeck(report.deckId, true);
            const card = deck?.cards?.find((c) => c.id === report.cardId) || null;
            return {
              ...report,
              deck,
              card,
            };
          } catch {
            return {
              ...report,
              deck: null,
              card: null,
            };
          }
        })
      );

      setReports(reportsWithDetails);
    } catch (error) {
      console.error("Failed to load reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (
    report: ReportWithDetails,
    status: "resolved" | "dismissed"
  ) => {
    try {
      setProcessingId(report.id);
      await reportService.updateReportStatus(
        report.id,
        report.deckId,
        report.cardId,
        status
      );
      toast.success(`Report ${status}`);
      // Remove from list
      setReports((prev) => prev.filter((r) => r.id !== report.id));
    } catch (error) {
      console.error(`Failed to ${status} report:`, error);
      toast.error(`Failed to ${status} report`);
    } finally {
      setProcessingId(null);
    }
  };

  const handleViewDeck = (deckId: string) => {
    router.push(`/?id=${deckId}`);
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Spinner size="lg" color="primary" />
          <p className="mt-4 text-gray-500">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <a href="/" className="text-red-100 hover:text-white transition-colors">
              Home
            </a>
            <span className="text-red-200">/</span>
            <span>Admin</span>
            <span className="text-red-200">/</span>
            <span>Reports</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Reported Cards</h1>
          <p className="text-red-100">
            Review and manage cards that have been reported by users.
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {reports.length} pending {reports.length === 1 ? "report" : "reports"}
          </h2>
          <Button
            variant="outline"
            onClick={loadReports}
            disabled={isLoading}
          >
            Refresh
          </Button>
        </div>

        {/* Reports List */}
        {reports.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-medium">All caught up!</p>
            <p className="text-gray-400 mt-1">No pending reports to review.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              >
                {/* Deck Info */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <button
                      onClick={() => handleViewDeck(report.deckId)}
                      className="text-lg font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {report.deck?.title || `Deck: ${report.deckId}`}
                    </button>
                    <p className="text-sm text-gray-500">
                      Owner: {report.deck?.userId === "system" ? "System Deck" : report.deck?.userId || "Unknown"}
                    </p>
                  </div>
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                    {report.status}
                  </span>
                </div>

                {/* Card Content */}
                {report.card ? (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="mb-2">
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Question
                      </span>
                      <p className="text-gray-800">{report.card.question}</p>
                    </div>
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Answer
                      </span>
                      <p className="text-gray-800">{report.card.answer}</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4 text-gray-500 italic">
                    Card not found (ID: {report.cardId})
                  </div>
                )}

                {/* Report Reason */}
                <div className="mb-4">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Report Reason
                  </span>
                  <div className="bg-red-50 rounded-lg p-3 mt-1 border-l-4 border-red-500">
                    <p className="text-gray-800">{report.reason}</p>
                  </div>
                </div>

                {/* Report Meta */}
                <div className="text-xs text-gray-400 mb-4">
                  Reported: {new Date(report.createdAt).toLocaleString()}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant="success"
                    onClick={() => handleUpdateStatus(report, "resolved")}
                    disabled={processingId !== null}
                  >
                    {processingId === report.id ? "Processing..." : "Mark Resolved"}
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => handleUpdateStatus(report, "dismissed")}
                    disabled={processingId !== null}
                  >
                    {processingId === report.id ? "Processing..." : "Dismiss"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleViewDeck(report.deckId)}
                  >
                    View Deck
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 px-4 mt-12">
        <div className="max-w-4xl mx-auto text-center text-gray-500 text-sm">
          <div className="flex flex-wrap justify-center gap-4 mb-4">
            <a href="/" className="hover:text-gray-700">Home</a>
            <a href="/about" className="hover:text-gray-700">About</a>
            <a href="/contact" className="hover:text-gray-700">Contact</a>
          </div>
          <p>&copy; {new Date().getFullYear()} Super Simple Flashcards. Admin Panel.</p>
        </div>
      </footer>
    </div>
  );
}
