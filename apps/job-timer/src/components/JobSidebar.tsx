"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, LocalBadge } from "@super-simple-apps/shared-assets";
import { Job, JobNameSchema, JobNameInput } from "@/types";

interface JobSidebarProps {
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

export function JobSidebarContent({
  jobs,
  activeJobId,
  onSelectJob,
  onDeleteJob,
  onRenameJob,
  getTotalTimeForJob,
}: JobSidebarProps) {
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<JobNameInput>({
    resolver: zodResolver(JobNameSchema),
  });

  const handleStartEdit = (job: Job) => {
    setEditingJobId(job.id);
    reset({ name: job.name });
  };

  const handleSaveEdit = (data: JobNameInput) => {
    if (editingJobId) {
      onRenameJob(editingJobId, data.name);
    }
    setEditingJobId(null);
    reset({ name: "" });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    reset({ name: "" });
  };

  return (
    <div className="py-1">
      {jobs.length === 0 ? (
        <div className="px-4 py-3 text-center">
          <p className="text-xs text-gray-500">No jobs yet. Create one!</p>
        </div>
      ) : (
        jobs.map((job) => {
          const isActive = job.id === activeJobId;
          const totalTime = getTotalTimeForJob(job.id);

          return (
            <button
              key={job.id}
              className={`
                w-full px-4 py-2.5 text-left
                transition-all duration-200
                hover:bg-blue-50
                border-l-4
                ${isActive ? "border-l-blue-600 bg-blue-50" : "border-l-transparent"}
              `}
              onClick={() => onSelectJob(job.id)}
            >
              {editingJobId === job.id ? (
                <form
                  className="flex gap-2"
                  onClick={(e) => e.stopPropagation()}
                  onSubmit={handleSubmit(handleSaveEdit)}
                >
                  <input
                    type="text"
                    {...register("name")}
                    className={`flex-1 px-2 py-1 bg-white border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === "Escape") handleCancelEdit();
                    }}
                    onBlur={handleSubmit(handleSaveEdit)}
                  />
                </form>
              ) : (
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      w-7 h-7 rounded-lg flex items-center justify-center text-xs font-medium
                      ${isActive ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"}
                    `}
                    style={!isActive ? { backgroundColor: job.color + "20", color: job.color } : {}}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium truncate ${isActive ? "text-blue-600" : "text-gray-700"}`}>
                      {job.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {formatDuration(totalTime)}
                    </p>
                  </div>
                  {isActive ? (
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartEdit(job);
                        }}
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:text-blue-700 hover:bg-blue-100"
                        aria-label="Rename job"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="text-red-500 hover:text-red-700 hover:bg-red-100"
                        aria-label="Delete job"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </Button>
                    </div>
                  ) : (
                    <LocalBadge />
                  )}
                </div>
              )}
            </button>
          );
        })
      )}
    </div>
  );
}

interface JobSidebarActionsProps {
  onCreateJob: (name: string) => void;
}

export function JobSidebarActions({ onCreateJob }: JobSidebarActionsProps) {
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<JobNameInput>({
    resolver: zodResolver(JobNameSchema),
    mode: "onChange",
  });

  const handleCreateJob = (data: JobNameInput) => {
    onCreateJob(data.name);
    reset();
    setIsCreating(false);
  };

  const handleCancel = () => {
    setIsCreating(false);
    reset();
  };

  if (isCreating) {
    return (
      <form onSubmit={handleSubmit(handleCreateJob)} className="space-y-2">
        <div>
          <input
            type="text"
            {...register("name")}
            placeholder="Job name..."
            className={`w-full px-3 py-2 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-600 ${
              errors.name ? "border-red-500" : "border-gray-200"
            }`}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
            }}
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={!isValid}
            variant="primary"
            className="flex-1"
          >
            Create
          </Button>
          <Button
            type="button"
            onClick={handleCancel}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  }

  return (
    <Button
      onClick={() => setIsCreating(true)}
      variant="primary"
      fullWidth
    >
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
      Create Job
    </Button>
  );
}
