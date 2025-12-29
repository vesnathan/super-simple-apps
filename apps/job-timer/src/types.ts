export interface TimerSession {
  id: string;
  startTime: number; // timestamp
  endTime: number | null; // timestamp, null if still running
  duration: number; // in seconds
  invoiced: boolean; // whether this session has been sent to invoices
}

export interface Job {
  id: string;
  name: string;
  color: string;
  sessions: TimerSession[];
  createdAt: number;
  updatedAt: number;
}

export interface JobTimerState {
  jobs: Job[];
  activeJobId: string | null;
  activeSessionId: string | null;
}
