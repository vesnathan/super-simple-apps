"use client";

import clsx from "clsx";
import { Button } from "@super-simple-apps/shared-assets";
import { Job } from "@/types";

interface TimerProps {
  job: Job;
  isRunning: boolean;
  currentDuration: number;
  totalTime: number;
  onStart: () => void;
  onStop: () => void;
}

function formatTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [
    hours.toString().padStart(2, "0"),
    mins.toString().padStart(2, "0"),
    secs.toString().padStart(2, "0"),
  ];

  return parts.join(":");
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

export function Timer({
  job,
  isRunning,
  currentDuration,
  totalTime,
  onStart,
  onStop,
}: TimerProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: job.color }}
          />
          <h2 className="text-2xl font-bold text-gray-800">{job.name}</h2>
        </div>

        <div
          className={clsx(
            "text-6xl font-mono font-bold mb-8 transition-colors",
            isRunning ? "text-primary-600" : "text-gray-400"
          )}
        >
          {formatTime(isRunning ? currentDuration : 0)}
        </div>

        <div className="flex justify-center gap-4 mb-8">
          {isRunning ? (
            <Button onClick={onStop} variant="danger" size="lg">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" rx="2" />
              </svg>
              Stop
            </Button>
          ) : (
            <Button onClick={onStart} variant="success" size="lg">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Start
            </Button>
          )}
        </div>

        <div className="text-gray-500">
          <span className="text-lg">Total time: </span>
          <span className="text-xl font-semibold text-gray-700">
            {formatDuration(totalTime)}
          </span>
        </div>
      </div>
    </div>
  );
}
