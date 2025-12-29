"use client";

import { useCallback, useState } from "react";
import { MainLayout } from "@/components/MainLayout";
import { Timer } from "@/components/Timer";
import { SessionHistory } from "@/components/SessionHistory";
import { JobSidebarContent } from "@/components/JobSidebar";
import { AdBanner, LocalStorageWarning, Footer } from "@super-simple-apps/shared-assets";
import { useJobTimer } from "@/hooks/useJobTimer";
import { WelcomeScreen } from "@super-simple-apps/shared-assets";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    jobs,
    activeJobId,
    activeSessionId,
    isTimerRunning,
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
    getTotalTimeForJob,
    getCurrentSessionDuration,
    currentTime,
  } = useJobTimer();

  const activeJob = getActiveJob();

  const handlePrimaryCtaClick = useCallback(() => {
    if (jobs.length === 0) {
      // No jobs - create a new one
      createJob("My First Job");
    } else {
      // Jobs exist - open the sidebar on mobile, or select the first job on desktop
      if (window.innerWidth < 768) {
        setIsMobileMenuOpen(true);
      } else {
        // On desktop, select the first job if none selected
        if (!activeJobId && jobs.length > 0) {
          selectJob(jobs[0].id);
        }
      }
    }
  }, [jobs, createJob, activeJobId, selectJob]);

  const handleDeleteSession = useCallback(
    (sessionId: string) => {
      if (activeJobId) {
        deleteSession(activeJobId, sessionId);
      }
    },
    [activeJobId, deleteSession]
  );

  const handleUpdateSessionTimes = useCallback(
    (sessionId: string, startTime: number, endTime: number) => {
      if (activeJobId) {
        updateSessionTimes(activeJobId, sessionId, startTime, endTime);
      }
    },
    [activeJobId, updateSessionTimes]
  );

  const handleResetInvoicedStatus = useCallback(
    (sessionId: string) => {
      if (activeJobId) {
        resetSessionInvoicedStatus(activeJobId, sessionId);
      }
    },
    [activeJobId, resetSessionInvoicedStatus]
  );

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Jobs Section Header */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <span className="font-medium text-sm">Jobs</span>
          {jobs.length > 0 && (
            <span className="ml-auto text-xs text-gray-400">{jobs.length}</span>
          )}
        </div>
      </div>

      {/* Jobs List */}
      <div className="flex-1 overflow-y-auto">
        <JobSidebarContent
          jobs={jobs}
          activeJobId={activeJobId}
          isTimerRunning={isTimerRunning}
          onSelectJob={selectJob}
          onCreateJob={createJob}
          onDeleteJob={deleteJob}
          onRenameJob={renameJob}
          getTotalTimeForJob={getTotalTimeForJob}
        />
      </div>
    </div>
  );

  return (
    <MainLayout
      sidebarContent={sidebarContent}
      onCreateJob={createJob}
      isMobileMenuOpen={isMobileMenuOpen}
      onMobileMenuChange={setIsMobileMenuOpen}
    >
      <main className="flex-1 overflow-y-auto p-8 md:ml-64">
        {activeJob ? (
          <div className="max-w-2xl mx-auto space-y-8">
            <LocalStorageWarning message="Your jobs and time sessions are stored locally in your browser. If you clear your browser cache, they will be lost. Sign in to save them to the cloud." />
            <Timer
              job={activeJob}
              isRunning={isTimerRunning}
              currentDuration={getCurrentSessionDuration()}
              totalTime={getTotalTimeForJob(activeJob.id)}
              onStart={() => startTimer(activeJob.id)}
              onStop={stopTimer}
            />

            {/* Ad Banner */}
            <AdBanner />

            <SessionHistory
              sessions={activeJob.sessions}
              activeSessionId={activeSessionId}
              currentTime={currentTime}
              jobName={activeJob.name}
              jobId={activeJob.id}
              onDeleteSession={handleDeleteSession}
              onUpdateSessionTimes={handleUpdateSessionTimes}
              onMarkAsInvoiced={markSessionsAsInvoiced}
              onResetInvoicedStatus={handleResetInvoicedStatus}
            />
          </div>
        ) : (
          <WelcomeScreen
            title="Welcome to Super Simple Job Timer"
            subtitle="The free, easy-to-use job timer for tracking your work hours. Create jobs, track time, and manage your sessions effortlessly."
            primaryCta={{
              label: jobs.length === 0 ? "Create Your First Job" : "Select a Job",
              onClick: handlePrimaryCtaClick,
              icon: (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ),
            }}
            secondaryCta={{
              label: "Learn More",
              href: "/about",
            }}
            features={[
              {
                icon: <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
                iconBgColor: "bg-green-100",
                title: "100% Free",
                description: "No hidden fees, no premium tiers. All features available to everyone for free.",
              },
              {
                icon: <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                iconBgColor: "bg-blue-100",
                title: "Easy Tracking",
                description: "Start and stop timers with one click. No complex setup needed.",
              },
              {
                icon: <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                iconBgColor: "bg-purple-100",
                title: "Session History",
                description: "Review and manage all your time tracking sessions in one place.",
              },
            ]}
            featuresSectionTitle="Why Choose Super Simple Job Timer?"
            howItWorks={[
              {
                title: "Create Your Job",
                description: "Add jobs for each project or client you're tracking time for.",
              },
              {
                title: "Start & Stop Timer",
                description: "Click to start tracking, click again to stop. Your session is saved automatically.",
              },
              {
                title: "Review & Export",
                description: "View your session history, mark sessions as invoiced, and track your progress.",
              },
            ]}
            useCases={[
              { emoji: "💼", title: "Freelancers", subtitle: "Track billable hours" },
              { emoji: "🏢", title: "Contractors", subtitle: "Log project time" },
              { emoji: "📊", title: "Consultants", subtitle: "Bill accurately" },
              { emoji: "🎯", title: "Anyone", subtitle: "Stay productive" },
            ]}
            useCasesSectionTitle="Perfect for Everyone"
            showAdBanner={true}
          />
        )}
        <Footer />
      </main>
    </MainLayout>
  );
}
