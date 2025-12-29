"use client";

import { useState, useCallback } from "react";
import { Button } from "@super-simple-apps/shared-assets";
import { TimerSession } from "@/types";

interface SessionHistoryProps {
  sessions: TimerSession[];
  activeSessionId: string | null;
  currentTime: number;
  jobName: string;
  jobId: string;
  onDeleteSession: (sessionId: string) => void;
  onUpdateSessionTimes: (sessionId: string, startTime: number, endTime: number) => void;
  onMarkAsInvoiced: (sessionIds: string[]) => void;
  onResetInvoicedStatus: (sessionId: string) => void;
}

export interface SessionForInvoice {
  sessionId: string;
  jobName: string;
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  durationFormatted: string;
}

interface EditingSession {
  id: string;
  startTime: string;
  endTime: string;
  date: string;
}

function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatTimeForInput(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
}

function formatDateForInput(timestamp: number): string {
  const date = new Date(timestamp);
  return date.toISOString().split("T")[0];
}

function formatDateShort(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], {
    month: "short",
    day: "numeric",
  });
}

function formatDateFull(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return "Today";
  }
  if (date.toDateString() === yesterday.toDateString()) {
    return "Yesterday";
  }
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m ${secs}s`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

function groupSessionsByDate(sessions: TimerSession[]): Map<string, TimerSession[]> {
  const groups = new Map<string, TimerSession[]>();

  // Sort sessions by start time descending (most recent first)
  const sorted = [...sessions].sort((a, b) => b.startTime - a.startTime);

  for (const session of sorted) {
    const dateKey = new Date(session.startTime).toDateString();
    const existing = groups.get(dateKey) || [];
    groups.set(dateKey, [...existing, session]);
  }

  return groups;
}

function parseTimeToTimestamp(dateStr: string, timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const date = new Date(dateStr);
  date.setHours(hours, minutes, 0, 0);
  return date.getTime();
}

export function SessionHistory({
  sessions,
  activeSessionId,
  currentTime,
  jobName,
  jobId,
  onDeleteSession,
  onUpdateSessionTimes,
  onMarkAsInvoiced,
  onResetInvoicedStatus,
}: SessionHistoryProps) {
  const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
  const [editingSession, setEditingSession] = useState<EditingSession | null>(null);

  const toggleSession = useCallback((sessionId: string) => {
    setSelectedSessions((prev) => {
      const next = new Set(prev);
      if (next.has(sessionId)) {
        next.delete(sessionId);
      } else {
        next.add(sessionId);
      }
      return next;
    });
  }, []);

  const toggleAllInDate = useCallback((dateSessions: TimerSession[]) => {
    const completedSessions = dateSessions.filter((s) => s.id !== activeSessionId && !s.invoiced);
    const allSelected = completedSessions.every((s) => selectedSessions.has(s.id));

    setSelectedSessions((prev) => {
      const next = new Set(prev);
      if (allSelected) {
        completedSessions.forEach((s) => next.delete(s.id));
      } else {
        completedSessions.forEach((s) => next.add(s.id));
      }
      return next;
    });
  }, [activeSessionId, selectedSessions]);

  const handleStartEdit = useCallback((session: TimerSession) => {
    if (!session.endTime) return;
    setEditingSession({
      id: session.id,
      date: formatDateForInput(session.startTime),
      startTime: formatTimeForInput(session.startTime),
      endTime: formatTimeForInput(session.endTime),
    });
  }, []);

  const handleSaveEdit = useCallback(() => {
    if (!editingSession) return;

    const newStartTime = parseTimeToTimestamp(editingSession.date, editingSession.startTime);
    const newEndTime = parseTimeToTimestamp(editingSession.date, editingSession.endTime);

    if (newEndTime <= newStartTime) {
      alert("End time must be after start time");
      return;
    }

    onUpdateSessionTimes(editingSession.id, newStartTime, newEndTime);
    setEditingSession(null);
  }, [editingSession, onUpdateSessionTimes]);

  const handleCancelEdit = useCallback(() => {
    setEditingSession(null);
  }, []);

  const handleSendToInvoices = useCallback(() => {
    const sessionsForInvoice: SessionForInvoice[] = [];
    const sessionIdsToMark: string[] = [];

    for (const session of sessions) {
      if (selectedSessions.has(session.id) && session.endTime) {
        sessionsForInvoice.push({
          sessionId: session.id,
          jobName,
          date: formatDateFull(session.startTime),
          startTime: formatTime(session.startTime),
          endTime: formatTime(session.endTime),
          duration: session.duration,
          durationFormatted: formatDuration(session.duration),
        });
        sessionIdsToMark.push(session.id);
      }
    }

    // Open invoices app and send data via postMessage
    const targetUrl = "https://invoices.super-simple-apps.com?from=job-timer";
    const newWindow = window.open(targetUrl, "_blank");

    if (newWindow) {
      const sendMessage = () => {
        newWindow.postMessage(
          {
            type: "super-simple-apps-timer-sessions",
            sessions: sessionsForInvoice,
            from: "job-timer",
          },
          "*"
        );
      };

      // Send multiple times to ensure the other window receives it
      const attempts = [500, 1000, 2000, 3000, 5000];
      attempts.forEach((delay) => {
        setTimeout(sendMessage, delay);
      });
    }

    // Mark sessions as invoiced
    onMarkAsInvoiced(sessionIdsToMark);

    // Clear selection after sending
    setSelectedSessions(new Set());
  }, [sessions, selectedSessions, jobName, onMarkAsInvoiced]);

  if (sessions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-8 text-center text-gray-500">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg">No sessions yet</p>
        <p className="text-sm mt-1">Start the timer to create your first session</p>
      </div>
    );
  }

  const groupedSessions = groupSessionsByDate(sessions);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Session History</h3>
        {selectedSessions.size > 0 && (
          <Button onClick={handleSendToInvoices} variant="primary" size="sm">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Send to Invoices ({selectedSessions.size})
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {Array.from(groupedSessions.entries()).map(([dateKey, dateSessions]) => {
          const selectableSessions = dateSessions.filter((s) => s.id !== activeSessionId && !s.invoiced);
          const allSelected = selectableSessions.length > 0 && selectableSessions.every((s) => selectedSessions.has(s.id));
          const someSelected = selectableSessions.some((s) => selectedSessions.has(s.id));

          return (
            <div key={dateKey}>
              <div className="flex items-center gap-2 mb-2">
                {selectableSessions.length > 0 && (
                  <button
                    onClick={() => toggleAllInDate(dateSessions)}
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                      allSelected
                        ? "bg-primary-600 border-primary-600"
                        : someSelected
                        ? "bg-primary-200 border-primary-400"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {(allSelected || someSelected) && (
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                )}
                <h4 className="text-sm font-medium text-gray-500">
                  {formatDateLabel(dateSessions[0].startTime)}
                </h4>
              </div>
              <div className="space-y-2">
                {dateSessions.map((session) => {
                  const isActive = session.id === activeSessionId;
                  const isSelected = selectedSessions.has(session.id);
                  const isEditing = editingSession?.id === session.id;
                  const duration = isActive
                    ? Math.floor((currentTime - session.startTime) / 1000)
                    : session.duration;

                  if (isEditing && editingSession) {
                    return (
                      <div
                        key={session.id}
                        className="p-3 rounded-lg bg-yellow-50 border border-yellow-200"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 w-12">Date:</label>
                            <input
                              type="date"
                              value={editingSession.date}
                              onChange={(e) => setEditingSession({ ...editingSession, date: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600 w-12">Start:</label>
                            <input
                              type="time"
                              value={editingSession.startTime}
                              onChange={(e) => setEditingSession({ ...editingSession, startTime: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                            <span className="text-gray-400">-</span>
                            <label className="text-sm text-gray-600">End:</label>
                            <input
                              type="time"
                              value={editingSession.endTime}
                              onChange={(e) => setEditingSession({ ...editingSession, endTime: e.target.value })}
                              className="px-2 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                          <div className="flex justify-end gap-2">
                            <Button onClick={handleCancelEdit} variant="secondary" size="sm">
                              Cancel
                            </Button>
                            <Button onClick={handleSaveEdit} variant="primary" size="sm">
                              Save
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={session.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        isActive
                          ? "bg-primary-50 border border-primary-200"
                          : session.invoiced
                          ? "bg-green-50 border border-green-200"
                          : isSelected
                          ? "bg-blue-50 border border-blue-200"
                          : "bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {!isActive && !session.invoiced && (
                          <button
                            onClick={() => toggleSession(session.id)}
                            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                              isSelected
                                ? "bg-primary-600 border-primary-600"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {isSelected && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            )}
                          </button>
                        )}
                        {isActive && (
                          <span className="w-5 h-5 flex items-center justify-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                          </span>
                        )}
                        {session.invoiced && (
                          <span className="w-5 h-5 flex items-center justify-center" title="Invoiced">
                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </span>
                        )}
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
                              {formatDateShort(session.startTime)}
                            </span>
                            <span className="text-sm text-gray-600">
                              {formatTime(session.startTime)}
                              {session.endTime && ` - ${formatTime(session.endTime)}`}
                              {isActive && " - Running..."}
                            </span>
                            {session.invoiced && (
                              <span className="text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded">
                                Invoiced
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`font-mono font-medium ${isActive ? "text-primary-600" : session.invoiced ? "text-green-700" : "text-gray-700"}`}>
                          {formatDuration(duration)}
                        </span>
                        {!isActive && (
                          <div className="flex items-center gap-1">
                            {session.invoiced && (
                              <button
                                onClick={() => onResetInvoicedStatus(session.id)}
                                className="p-1 text-gray-400 hover:text-orange-500 transition-colors"
                                title="Reset invoiced status"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                              </button>
                            )}
                            <button
                              onClick={() => handleStartEdit(session)}
                              className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                              title="Edit times"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                if (confirm("Delete this session?")) {
                                  onDeleteSession(session.id);
                                }
                              }}
                              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                              title="Delete session"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
