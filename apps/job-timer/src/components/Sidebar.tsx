"use client";

import { useState } from "react";
import clsx from "clsx";
import { Button } from "@super-simple-apps/shared-assets";
import { Job } from "@/types";

interface SidebarProps {
  jobs: Job[];
  activeJobId: string | null;
  isTimerRunning: boolean;
  onSelectJob: (jobId: string | null) => void;
  onCreateJob: (name: string) => void;
  onDeleteJob: (jobId: string) => void;
  onRenameJob: (jobId: string, newName: string) => void;
  getTotalTimeForJob: (jobId: string) => number;
}

function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m ${secs}s`;
  }
  return `${secs}s`;
}

export function Sidebar({
  jobs,
  activeJobId,
  isTimerRunning,
  onSelectJob,
  onCreateJob,
  onDeleteJob,
  onRenameJob,
  getTotalTimeForJob,
}: SidebarProps) {
  const [newJobName, setNewJobName] = useState("");
  const [editingJobId, setEditingJobId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateJob = () => {
    if (newJobName.trim()) {
      onCreateJob(newJobName.trim());
      setNewJobName("");
      setIsCreating(false);
    }
  };

  const handleStartEdit = (job: Job) => {
    setEditingJobId(job.id);
    setEditingName(job.name);
  };

  const handleSaveEdit = () => {
    if (editingJobId && editingName.trim()) {
      onRenameJob(editingJobId, editingName.trim());
    }
    setEditingJobId(null);
    setEditingName("");
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-full">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Job Timer
        </h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {jobs.map((job) => {
            const isActive = job.id === activeJobId;
            const totalTime = getTotalTimeForJob(job.id);

            return (
              <div
                key={job.id}
                className={clsx(
                  "rounded-lg p-3 cursor-pointer transition-all",
                  isActive
                    ? "bg-gray-700 ring-2 ring-primary-500"
                    : "bg-gray-800 hover:bg-gray-700"
                )}
                onClick={() => onSelectJob(job.id)}
              >
                {editingJobId === job.id ? (
                  <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      className="flex-1 px-2 py-1 bg-gray-600 rounded text-sm"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSaveEdit();
                        if (e.key === "Escape") setEditingJobId(null);
                      }}
                      onBlur={handleSaveEdit}
                    />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: job.color }}
                        />
                        <span className="font-medium truncate">{job.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStartEdit(job);
                          }}
                          variant="ghost"
                          size="icon"
                          title="Rename"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </Button>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Delete this job and all its sessions?")) {
                              onDeleteJob(job.id);
                            }
                          }}
                          variant="ghost"
                          size="icon"
                          className="hover:bg-red-100 hover:text-red-600"
                          title="Delete"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      Total: {formatDuration(totalTime)}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>

        {jobs.length === 0 && !isCreating && (
          <div className="text-center text-gray-500 py-8">
            <p>No jobs yet</p>
            <p className="text-sm mt-1">Create one to start tracking time</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-gray-700">
        {isCreating ? (
          <div className="space-y-2">
            <input
              type="text"
              value={newJobName}
              onChange={(e) => setNewJobName(e.target.value)}
              placeholder="Job name..."
              className="w-full px-3 py-2 bg-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") handleCreateJob();
                if (e.key === "Escape") {
                  setIsCreating(false);
                  setNewJobName("");
                }
              }}
            />
            <div className="flex gap-2">
              <Button
                onClick={handleCreateJob}
                disabled={!newJobName.trim()}
                variant="primary"
                className="flex-1"
              >
                Create
              </Button>
              <Button
                onClick={() => {
                  setIsCreating(false);
                  setNewJobName("");
                }}
                variant="secondary"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button onClick={() => setIsCreating(true)} variant="primary" fullWidth>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Job
          </Button>
        )}
      </div>
    </div>
  );
}
