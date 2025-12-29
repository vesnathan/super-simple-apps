"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Job, TimerSession, JobTimerState } from "@/types";

const STORAGE_KEY = "super-simple-apps-job-timer";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // green
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
];

function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function loadState(): JobTimerState {
  if (typeof window === "undefined") {
    return { jobs: [], activeJobId: null, activeSessionId: null };
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const state = JSON.parse(stored) as JobTimerState;
      // Migrate old sessions that don't have invoiced field
      state.jobs = state.jobs.map((job) => ({
        ...job,
        sessions: job.sessions.map((session) => ({
          ...session,
          invoiced: session.invoiced ?? false,
        })),
      }));
      // Don't auto-select a job on page load - show welcome screen instead
      // But keep selection if there's an active timer running
      if (!state.activeSessionId) {
        state.activeJobId = null;
      }
      return state;
    }
  } catch {
    // ignore
  }
  return { jobs: [], activeJobId: null, activeSessionId: null };
}

function saveState(state: JobTimerState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function useJobTimer() {
  const [state, setState] = useState<JobTimerState>(() => loadState());
  const [currentTime, setCurrentTime] = useState<number>(Date.now());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Load state on mount
  useEffect(() => {
    setState(loadState());
  }, []);

  // Save state on changes
  useEffect(() => {
    saveState(state);
  }, [state]);

  // Update current time every second for active timer display
  useEffect(() => {
    if (state.activeSessionId) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(Date.now());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [state.activeSessionId]);

  const createJob = useCallback((name: string) => {
    const newJob: Job = {
      id: generateId(),
      name,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      sessions: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    setState((prev) => ({
      ...prev,
      jobs: [...prev.jobs, newJob],
    }));
    return newJob;
  }, []);

  const deleteJob = useCallback((jobId: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.filter((j) => j.id !== jobId),
      activeJobId: prev.activeJobId === jobId ? null : prev.activeJobId,
      activeSessionId: prev.jobs.find((j) => j.id === jobId)?.sessions.some((s) => s.id === prev.activeSessionId)
        ? null
        : prev.activeSessionId,
    }));
  }, []);

  const renameJob = useCallback((jobId: string, newName: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId ? { ...j, name: newName, updatedAt: Date.now() } : j
      ),
    }));
  }, []);

  const selectJob = useCallback((jobId: string | null) => {
    setState((prev) => ({
      ...prev,
      activeJobId: jobId,
    }));
  }, []);

  const startTimer = useCallback((jobId: string) => {
    const now = Date.now();
    const newSession: TimerSession = {
      id: generateId(),
      startTime: now,
      endTime: null,
      duration: 0,
      invoiced: false,
    };

    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId
          ? { ...j, sessions: [...j.sessions, newSession], updatedAt: now }
          : j
      ),
      activeJobId: jobId,
      activeSessionId: newSession.id,
    }));
  }, []);

  const stopTimer = useCallback(() => {
    const now = Date.now();
    setState((prev) => {
      if (!prev.activeSessionId) return prev;

      return {
        ...prev,
        jobs: prev.jobs.map((job) => ({
          ...job,
          sessions: job.sessions.map((session) =>
            session.id === prev.activeSessionId
              ? {
                  ...session,
                  endTime: now,
                  duration: Math.floor((now - session.startTime) / 1000),
                }
              : session
          ),
          updatedAt: job.sessions.some((s) => s.id === prev.activeSessionId) ? now : job.updatedAt,
        })),
        activeSessionId: null,
      };
    });
  }, []);

  const deleteSession = useCallback((jobId: string, sessionId: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId
          ? { ...j, sessions: j.sessions.filter((s) => s.id !== sessionId), updatedAt: Date.now() }
          : j
      ),
      activeSessionId: prev.activeSessionId === sessionId ? null : prev.activeSessionId,
    }));
  }, []);

  const updateSessionTimes = useCallback(
    (jobId: string, sessionId: string, startTime: number, endTime: number) => {
      setState((prev) => ({
        ...prev,
        jobs: prev.jobs.map((j) =>
          j.id === jobId
            ? {
                ...j,
                sessions: j.sessions.map((s) =>
                  s.id === sessionId
                    ? {
                        ...s,
                        startTime,
                        endTime,
                        duration: Math.floor((endTime - startTime) / 1000),
                      }
                    : s
                ),
                updatedAt: Date.now(),
              }
            : j
        ),
      }));
    },
    []
  );

  const markSessionsAsInvoiced = useCallback((sessionIds: string[]) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((job) => ({
        ...job,
        sessions: job.sessions.map((session) =>
          sessionIds.includes(session.id) ? { ...session, invoiced: true } : session
        ),
        updatedAt: job.sessions.some((s) => sessionIds.includes(s.id)) ? Date.now() : job.updatedAt,
      })),
    }));
  }, []);

  const resetSessionInvoicedStatus = useCallback((jobId: string, sessionId: string) => {
    setState((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId
          ? {
              ...j,
              sessions: j.sessions.map((s) =>
                s.id === sessionId ? { ...s, invoiced: false } : s
              ),
              updatedAt: Date.now(),
            }
          : j
      ),
    }));
  }, []);

  const getActiveJob = useCallback(() => {
    return state.jobs.find((j) => j.id === state.activeJobId) || null;
  }, [state.jobs, state.activeJobId]);

  const getActiveSession = useCallback(() => {
    if (!state.activeSessionId) return null;
    for (const job of state.jobs) {
      const session = job.sessions.find((s) => s.id === state.activeSessionId);
      if (session) return session;
    }
    return null;
  }, [state.jobs, state.activeSessionId]);

  const getTotalTimeForJob = useCallback((jobId: string): number => {
    const job = state.jobs.find((j) => j.id === jobId);
    if (!job) return 0;

    return job.sessions.reduce((total, session) => {
      if (session.endTime) {
        return total + session.duration;
      } else {
        // Active session - calculate live duration
        return total + Math.floor((currentTime - session.startTime) / 1000);
      }
    }, 0);
  }, [state.jobs, currentTime]);

  const getCurrentSessionDuration = useCallback((): number => {
    const session = getActiveSession();
    if (!session) return 0;
    return Math.floor((currentTime - session.startTime) / 1000);
  }, [getActiveSession, currentTime]);

  return {
    jobs: state.jobs,
    activeJobId: state.activeJobId,
    activeSessionId: state.activeSessionId,
    isTimerRunning: state.activeSessionId !== null,
    createJob,
    deleteJob,
    renameJob,
    selectJob,
    startTimer,
    stopTimer,
    deleteSession,
    updateSessionTimes,
    markSessionsAsInvoiced,
    resetSessionInvoicedStatus,
    getActiveJob,
    getActiveSession,
    getTotalTimeForJob,
    getCurrentSessionDuration,
    currentTime,
  };
}
