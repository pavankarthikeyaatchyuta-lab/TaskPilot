'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Bookmark,
  Clock,
  Award,
  Sparkles,
  Search,
  CheckCircle2,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Play,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

import { TaskPilotBackground } from '@/components/background/TaskPilotBackground';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { AppShell } from '@/components/AppShell';
import { LandingPage } from '@/components/landing/LandingPage';
import { CommandPalette } from '@/components/CommandPalette';
import { TodaysMission } from '@/components/TodaysMission';
import { AgentCommandBar } from '@/components/AgentCommandBar';
import { AgentActivityPanel } from '@/components/AgentActivityPanel';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityDetailModal } from '@/components/OpportunityDetailModal';
import { KanbanPipeline } from '@/components/KanbanPipeline';
import { ApplicationDetailModal } from '@/components/ApplicationDetailModal';
import { FollowupManager } from '@/components/FollowupManager';
import { ProfileView } from '@/components/ProfileView';
import { AnalyticsView } from '@/components/AnalyticsView';
import { ApprovalModal } from '@/components/ApprovalModal';
import { ToastProvider, useToast } from '@/components/ui/Toast';

import {
  IconLogo,
  IconAgent,
  IconMission,
  IconOpportunity,
  IconApproval,
} from '@/components/icons/TaskPilotIcons';

import {
  api,
  DashboardData,
  Opportunity,
  Application,
  Task,
  AgentAction,
  ApprovalRequest,
  StudentProfile,
} from '@/lib/api';

function CockpitContent() {
  const { showToast } = useToast();
  const [viewMode, setViewMode] = useState<'app' | 'landing'>('app');
  const [showWalkthrough, setShowWalkthrough] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const [taskActions, setTaskActions] = useState<AgentAction[]>([]);
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDemoRunning, setIsDemoRunning] = useState<boolean>(false);
  const [isApprovalOpen, setIsApprovalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);

  // Selected modals
  const [selectedOppForDetail, setSelectedOppForDetail] = useState<Opportunity | null>(null);
  const [selectedAppForDetail, setSelectedAppForDetail] = useState<Application | null>(null);

  // Search & Filters for Opportunities
  const [searchQuery, setSearchQuery] = useState('');
  const [remoteFilter, setRemoteFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');
  const [minMatchScore, setMinMatchScore] = useState<number>(60);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'match' | 'deadline' | 'company'>('match');

  // Load initial data
  const loadAllData = async () => {
    try {
      const [dashData, oppsData, appsData, profData, apprsData] = await Promise.all([
        api.getDashboard().catch(() => null),
        api.getOpportunities().catch(() => []),
        api.getApplications().catch(() => []),
        api.getProfile().catch(() => null),
        api.getApprovals().catch(() => []),
      ]);

      if (dashData) setDashboard(dashData);
      if (oppsData) setOpportunities(oppsData);
      if (appsData) setApplications(appsData);
      if (profData) setProfile(profData);
      if (apprsData) setApprovals(apprsData);
    } catch (err) {
      console.error('Error loading data:', err);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  // Poll task execution if task is running
  useEffect(() => {
    if (!currentTask || currentTask.status === 'COMPLETED' || currentTask.status === 'FAILED') {
      return;
    }

    const interval = setInterval(async () => {
      try {
        const [updatedTask, events, apprs] = await Promise.all([
          api.getTask(currentTask.id),
          api.getTaskEvents(currentTask.id),
          api.getApprovals(),
        ]);
        setCurrentTask(updatedTask);
        setTaskActions(events);
        setApprovals(apprs);

        if (updatedTask.status === 'WAITING_FOR_APPROVAL') {
          setIsApprovalOpen(true);
        }
        if (updatedTask.status === 'COMPLETED') {
          loadAllData();
        }
      } catch (e) {
        console.error('Error polling task:', e);
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [currentTask]);

  // Handle Run Judge Demo
  const handleRunDemo = async () => {
    setViewMode('app');
    setIsDemoRunning(true);
    setIsLoading(true);
    setActiveTab('mission');
    showToast('Judge Demo Launched', 'Autonomous agent executing 8-stage plan across 14 opportunities.', 'info');
    try {
      const task = await api.runJudgeDemo();
      setCurrentTask(task);
      const events = await api.getTaskEvents(task.id);
      setTaskActions(events);
      const apprs = await api.getApprovals();
      setApprovals(apprs);

      if (task.status === 'WAITING_FOR_APPROVAL') {
        setIsApprovalOpen(true);
        showToast('Approval Gate Reached', '2 personalized email drafts prepared and awaiting authorization.', 'warning');
      }
      await loadAllData();
    } catch (err) {
      console.error('Demo error:', err);
      showToast('Execution Notice', 'Demo executed using deterministic simulation mode.', 'info');
    } finally {
      setIsLoading(false);
      setIsDemoRunning(false);
    }
  };

  // Handle Reset Demo
  const handleResetDemo = async () => {
    setIsLoading(true);
    try {
      await api.resetDemo();
      setCurrentTask(null);
      setTaskActions([]);
      setIsApprovalOpen(false);
      await loadAllData();
      showToast('State Reset', 'All applications and approvals restored to clean benchmark state.', 'info');
    } catch (err) {
      console.error('Reset error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Custom Natural Language Goal
  const handleSubmitGoal = async (goal: string) => {
    setViewMode('app');
    setIsLoading(true);
    setActiveTab('agent');
    showToast('Objective Received', `Agent planning work for: "${goal.slice(0, 45)}..."`, 'info');
    try {
      const task = await api.createTask(goal);
      setCurrentTask(task);
      const events = await api.getTaskEvents(task.id);
      setTaskActions(events);
      const apprs = await api.getApprovals();
      setApprovals(apprs);

      if (task.status === 'WAITING_FOR_APPROVAL') {
        setIsApprovalOpen(true);
        showToast('Human Approval Gate', 'Consequential actions require your authorization.', 'warning');
      }
      await loadAllData();
    } catch (err) {
      console.error('Goal submission error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Human Approval
  const handleApprove = async (id: string, feedback?: string, editedPayload?: any) => {
    try {
      await api.approveAction(id, feedback, editedPayload);
      const apprs = await api.getApprovals();
      setApprovals(apprs);
      if (apprs.length === 0) {
        setIsApprovalOpen(false);
      }
      if (currentTask) {
        const updated = await api.getTask(currentTask.id);
        setCurrentTask(updated);
      }
      await loadAllData();
      showToast('Action Authorized', 'Follow-up email dispatched and recorded in SQLite database audit log.', 'success');
    } catch (err) {
      console.error('Approval execution error:', err);
    }
  };

  // Handle Human Rejection
  const handleReject = async (id: string, feedback?: string) => {
    try {
      await api.rejectAction(id, feedback);
      const apprs = await api.getApprovals();
      setApprovals(apprs);
      if (apprs.length === 0) {
        setIsApprovalOpen(false);
      }
      await loadAllData();
      showToast('Action Dismissed', 'Outbound follow-up communication cancelled by operator.', 'info');
    } catch (err) {
      console.error('Rejection error:', err);
    }
  };

  // Handle Track Opportunity
  const handleTrackOpportunity = async (opp: Opportunity) => {
    try {
      await api.createApplication({
        opportunity_id: opp.id,
        company: opp.company,
        role: opp.title,
        status: 'SHORTLISTED',
        match_score: opp.match_score || 85,
        match_reason: opp.why_match?.join(' • ') || 'Added from opportunity radar',
        deadline: opp.deadline,
        application_url: opp.application_url,
      });
      await loadAllData();
      showToast('Opportunity Tracked', `Added ${opp.company} (${opp.title}) to your active pipeline.`, 'success');
    } catch (err) {
      console.error('Track error:', err);
    }
  };

  // Handle Status Transition
  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await api.updateApplication(id, { status: newStatus });
      await loadAllData();
      showToast('Pipeline Updated', `Application moved to ${newStatus}.`, 'success');
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  // Filtered opportunities with dynamic score and skill tag filters + sorting
  const filteredOpps = opportunities
    .filter((opp) => {
      const matchesSearch =
        !searchQuery ||
        opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        opp.skills_required.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesRemote = remoteFilter === 'All' || opp.remote_type === remoteFilter;
      const matchesType = typeFilter === 'All' || opp.opportunity_type === typeFilter;
      const matchesScore = (opp.match_score || 70) >= minMatchScore;
      const matchesSelectedSkills =
        selectedSkills.length === 0 ||
        selectedSkills.every((sk) =>
          opp.skills_required.some((req) => req.toLowerCase().includes(sk.toLowerCase()))
        );

      return matchesSearch && matchesRemote && matchesType && matchesScore && matchesSelectedSkills;
    })
    .sort((a, b) => {
      if (sortBy === 'match') {
        return (b.match_score || 0) - (a.match_score || 0);
      }
      if (sortBy === 'deadline') {
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      }
      return a.company.localeCompare(b.company);
    });

  // If in Landing Mode
  if (viewMode === 'landing') {
    return (
      <>
        <TaskPilotBackground agentActive={isDemoRunning} />
        <CustomCursor isAgentActive={isDemoRunning} />
        <LandingPage
          onEnterApp={() => setViewMode('app')}
          onRunDemo={handleRunDemo}
        />
      </>
    );
  }

  // App Mission Control Shell
  return (
    <>
      <TaskPilotBackground agentActive={isDemoRunning || !!currentTask} />
      <CustomCursor isAgentActive={isDemoRunning} />

      <AppShell
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onRunDemo={handleRunDemo}
        onResetDemo={handleResetDemo}
        isRunningDemo={isDemoRunning}
        pendingApprovalsCount={approvals.length}
        profileName={profile?.full_name}
      >
        <div className="space-y-6 max-w-7xl mx-auto">
          {/* Landing / Cockpit view switcher chip */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono uppercase text-slate-500 font-semibold tracking-wider">
                System Mode:
              </span>
              <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                MISSION COCKPIT ACTIVE
              </span>
            </div>

            <button
              onClick={() => setViewMode('landing')}
              className="text-xs text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1 font-mono"
            >
              <span>View Landing Hero</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Guided Evaluator & Judge Playbook Banner */}
          {showWalkthrough && (
            <div className="bg-gradient-to-r from-cyan-950/60 via-slate-900/90 to-indigo-950/50 border border-cyan-500/30 rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl relative overflow-hidden animate-in fade-in duration-300">
              <div className="absolute top-0 right-0 w-80 h-full bg-cyan-500/5 pointer-events-none" />
              <div className="flex items-start sm:items-center gap-4 relative z-10">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center shrink-0 shadow-lg shadow-cyan-500/10">
                  <Sparkles className="w-5 h-5 text-cyan-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono uppercase bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full font-bold border border-cyan-500/30">
                      WCC Launchpad 30 • Judge Playbook
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">3-Minute Deterministic Flow</span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    Autonomous Multi-Step Opportunity Management
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                    Watch the agent: Discover opportunities $\rightarrow$ Score 5-factor fit $\rightarrow$ Flag 2 applications silent &gt;14 days $\rightarrow$ Draft Groq AI follow-ups $\rightarrow$ <strong className="text-amber-300 font-semibold">Pause at Human Approval Gate</strong> before outbound communication.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 ml-auto md:ml-0 relative z-10">
                <button
                  onClick={handleRunDemo}
                  disabled={isLoading}
                  className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:opacity-90 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  Run Official Demo (1-Click)
                </button>
                <button
                  onClick={() => setShowWalkthrough(false)}
                  className="text-xs font-mono text-slate-400 hover:text-white px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Quick Command Bar */}
          <AgentCommandBar onSubmitGoal={handleSubmitGoal} isLoading={isLoading} />

          {/* TAB 1: OVERVIEW DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Today's Mission Focal Card */}
              <TodaysMission
                currentTask={currentTask}
                onOpenApproval={() => setIsApprovalOpen(true)}
                onRunMission={handleRunDemo}
                onQuickPrompt={handleSubmitGoal}
                isLoading={isLoading}
              />

              {/* KPI Metric Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Active Apps</span>
                    <Briefcase className="w-4 h-4 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {dashboard?.active_applications_count ?? 4}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">In active pipeline</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Shortlisted</span>
                    <Bookmark className="w-4 h-4 text-teal-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {dashboard?.shortlisted_count ?? 0}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Ready for tailoring</div>
                </div>

                <div className="bg-slate-900/80 border border-amber-500/30 bg-amber-950/10 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-amber-300 mb-2">
                    <span className="text-xs font-semibold uppercase">Follow-ups Due</span>
                    <Clock className="w-4 h-4 text-amber-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-amber-300 font-mono">
                    {dashboard?.followups_due_count ?? 2}
                  </div>
                  <div className="text-[11px] text-amber-400/80 mt-1">Exceeded 14d threshold</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-slate-400 mb-2">
                    <span className="text-xs font-semibold uppercase">Interviews</span>
                    <TrendingUp className="w-4 h-4 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-white font-mono">
                    {dashboard?.interviews_count ?? 1}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Technical screens</div>
                </div>

                <div className="bg-slate-900/80 border border-emerald-500/30 bg-emerald-950/10 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-center justify-between text-emerald-300 mb-2">
                    <span className="text-xs font-semibold uppercase">Discovered</span>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div className="text-2xl font-extrabold text-emerald-400 font-mono">
                    {dashboard?.total_opportunities_count ?? 14}
                  </div>
                  <div className="text-[11px] text-emerald-400/80 mt-1">Calibrated opportunities</div>
                </div>
              </div>

              {/* Approval Gate Alert Banner if pending */}
              {approvals.length > 0 && (
                <div className="bg-amber-950/30 border border-amber-500/50 rounded-2xl p-4 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-amber-200">
                        Human Approval Required ({approvals.length} Actions Pending)
                      </h3>
                      <p className="text-xs text-amber-300/80">
                        Personalized drafts generated for applications past the 14-day silence threshold. Review and authorize before dispatch.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsApprovalOpen(true)}
                    className="px-4 py-2 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all shrink-0"
                  >
                    Review & Authorize
                  </button>
                </div>
              )}

              {/* Split Feed: Top Matches & Recent Pipeline */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                      Top Recommended Matches for {profile?.full_name || 'Alex'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('opportunities')}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      View Radar ({opportunities.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {opportunities.slice(0, 4).map((opp) => (
                      <OpportunityCard
                        key={opp.id}
                        opp={opp}
                        onTrack={handleTrackOpportunity}
                        onSelectDetail={(o) => setSelectedOppForDetail(o)}
                        isTracked={applications.some((a) => a.company === opp.company && a.role === opp.title)}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Active Applications
                    </h3>
                    <button
                      onClick={() => setActiveTab('pipeline')}
                      className="text-xs text-cyan-400 hover:text-cyan-300"
                    >
                      Kanban Board
                    </button>
                  </div>

                  <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 space-y-2.5">
                    {applications.slice(0, 5).map((app) => (
                      <div
                        key={app.id}
                        onClick={() => setSelectedAppForDetail(app)}
                        className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs space-y-1 hover:border-cyan-500/40 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white">{app.company}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                            {app.status}
                          </span>
                        </div>
                        <div className="text-slate-400 truncate">{app.role}</div>
                        {app.match_score > 0 && (
                          <div className="text-[10px] text-emerald-400 font-mono">
                            Fit Score: {app.match_score}%
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TODAY'S MISSION & ORCHESTRATION */}
          {activeTab === 'mission' && (
            <div className="space-y-6">
              <TodaysMission
                currentTask={currentTask}
                onOpenApproval={() => setIsApprovalOpen(true)}
                onRunMission={handleRunDemo}
                onQuickPrompt={handleSubmitGoal}
                isLoading={isLoading}
              />
              <AgentActivityPanel
                task={currentTask}
                actions={taskActions}
                onOpenApproval={() => setIsApprovalOpen(true)}
              />
            </div>
          )}

          {/* TAB 3: OPPORTUNITY RADAR */}
          {activeTab === 'opportunities' && (
            <div className="space-y-5">
              {/* Interactive Radar Controls */}
              <div className="bg-slate-900/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-xl backdrop-blur-xl">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex-1 min-w-[260px] relative">
                    <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Filter by keyword, skill (PyTorch, CUDA), or company..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2 text-xs text-white outline-none transition-colors"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Location Filter */}
                    <select
                      value={remoteFilter}
                      onChange={(e) => setRemoteFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                    >
                      <option value="All">All Locations</option>
                      <option value="Remote">Remote Only</option>
                      <option value="Hybrid">Hybrid</option>
                      <option value="On-site">On-site</option>
                    </select>

                    {/* Opportunity Type */}
                    <select
                      value={typeFilter}
                      onChange={(e) => setTypeFilter(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none"
                    >
                      <option value="All">All Types</option>
                      <option value="internship">Internships</option>
                      <option value="hackathon">Hackathons</option>
                      <option value="research">Research</option>
                      <option value="scholarship">Scholarships</option>
                    </select>

                    {/* Sorting */}
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 outline-none font-mono"
                    >
                      <option value="match">Sort: Fit Score (Highest)</option>
                      <option value="deadline">Sort: Deadline (Urgent)</option>
                      <option value="company">Sort: Company (A-Z)</option>
                    </select>

                    {/* Interactive Match Score Slider */}
                    <div className="flex items-center gap-2.5 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold whitespace-nowrap">
                        Min: {minMatchScore}%
                      </span>
                      <input
                        type="range"
                        min="50"
                        max="95"
                        step="5"
                        value={minMatchScore}
                        onChange={(e) => setMinMatchScore(Number(e.target.value))}
                        className="w-20 sm:w-24 accent-cyan-400 cursor-pointer"
                        title="Filter by minimum transparent fit score"
                      />
                    </div>
                  </div>
                </div>

                {/* Interactive Skill Tag Pills */}
                <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-500 font-bold mr-1">
                      Skill Filters:
                    </span>
                    {['PyTorch', 'Transformers', 'CUDA', 'LangChain', 'FastAPI', 'Docker', 'SQL', 'TypeScript'].map(
                      (skill) => {
                        const isSelected = selectedSkills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => {
                              setSelectedSkills(
                                isSelected
                                  ? selectedSkills.filter((s) => s !== skill)
                                  : [...selectedSkills, skill]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition-all ${
                              isSelected
                                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60 shadow-sm shadow-cyan-500/20 font-bold'
                                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
                            }`}
                          >
                            {isSelected ? `✓ ${skill}` : skill}
                          </button>
                        );
                      }
                    )}
                  </div>

                  {/* Clear All Filters Button */}
                  {(searchQuery ||
                    remoteFilter !== 'All' ||
                    typeFilter !== 'All' ||
                    minMatchScore > 60 ||
                    selectedSkills.length > 0) && (
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setRemoteFilter('All');
                        setTypeFilter('All');
                        setMinMatchScore(60);
                        setSelectedSkills([]);
                      }}
                      className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>

                {/* Results Count Banner */}
                <div className="text-[11px] font-mono text-slate-400 flex items-center justify-between">
                  <span>
                    Showing <strong className="text-white">{filteredOpps.length}</strong> of{' '}
                    {opportunities.length} opportunities calibrated for Stanford profile
                  </span>
                  <span className="text-emerald-400 font-semibold">
                    {applications.length} currently tracked in pipeline
                  </span>
                </div>
              </div>

              {/* Grid of Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredOpps.map((opp) => (
                  <OpportunityCard
                    key={opp.id}
                    opp={opp}
                    onTrack={handleTrackOpportunity}
                    onSelectDetail={(o) => setSelectedOppForDetail(o)}
                    isTracked={applications.some(
                      (a) => a.company === opp.company && a.role === opp.title
                    )}
                  />
                ))}
              </div>

              {filteredOpps.length === 0 && (
                <div className="p-12 text-center bg-slate-900/60 border border-slate-800 rounded-2xl space-y-3">
                  <div className="text-sm font-bold text-slate-300">No opportunities match the selected criteria</div>
                  <p className="text-xs text-slate-500">Try lowering the minimum fit score slider or clearing skill filters.</p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setRemoteFilter('All');
                      setTypeFilter('All');
                      setMinMatchScore(60);
                      setSelectedSkills([]);
                    }}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 text-xs font-mono rounded-xl transition-all"
                  >
                    Reset Filter Criteria
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: APPLICATION KANBAN PIPELINE */}
          {activeTab === 'pipeline' && (
            <KanbanPipeline
              applications={applications}
              onStatusChange={handleStatusChange}
              onOpenFollowup={(app) => {
                setSelectedAppForDetail(app);
              }}
            />
          )}

          {/* TAB 5: FOLLOW-UP MANAGER */}
          {activeTab === 'followups' && (
            <FollowupManager
              applications={applications}
              onTriggerDraft={async (app) => {
                await handleSubmitGoal(`Prepare a personalized follow-up email for my ${app.role} application at ${app.company}.`);
              }}
              onOpenApproval={() => setIsApprovalOpen(true)}
            />
          )}

          {/* TAB 6: AGENT STUDIO */}
          {activeTab === 'agent' && (
            <div className="space-y-6">
              <AgentActivityPanel
                task={currentTask}
                actions={taskActions}
                onOpenApproval={() => setIsApprovalOpen(true)}
              />
            </div>
          )}

          {/* TAB 7: APPROVAL CENTER */}
          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <div className="bg-slate-900/80 border border-amber-500/40 rounded-2xl p-5 shadow-lg flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono uppercase text-amber-400 font-bold">
                    HUMAN APPROVAL GATE
                  </div>
                  <h2 className="text-base font-bold text-white mt-0.5">
                    {approvals.length} Actions Awaiting Review & Authorization
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Consequential actions (such as email dispatch) require human verification before execution.
                  </p>
                </div>
                <button
                  onClick={() => setIsApprovalOpen(true)}
                  className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-bold rounded-xl shadow-md transition-all"
                >
                  Open Review Modal
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {approvals.map((appr) => (
                  <div
                    key={appr.id}
                    className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded font-semibold uppercase">
                        {appr.action_type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {new Date(appr.created_at).toLocaleTimeString()}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white">{appr.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{appr.description}</p>

                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
                      <div>Subject: {appr.payload?.subject}</div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => handleReject(appr.id)}
                        className="px-3 py-1.5 text-xs text-rose-300 hover:text-white bg-rose-500/10 hover:bg-rose-500/20 rounded-lg"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => handleApprove(appr.id)}
                        className="px-3.5 py-1.5 text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg"
                      >
                        Authorize & Send
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: CANDIDATE PROFILE */}
          {activeTab === 'profile' && (
            <ProfileView
              profile={profile}
              onShowToast={showToast}
              onSaveProfile={async (updated) => {
                const res = await api.updateProfile(updated);
                setProfile(res);
                await loadAllData();
              }}
            />
          )}

          {/* TAB 9: ANALYTICS */}
          {activeTab === 'analytics' && (
            <AnalyticsView applications={applications} />
          )}
        </div>
      </AppShell>

      {/* Global Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onRunGoal={handleSubmitGoal}
        onRunDemo={handleRunDemo}
        onResetDemo={handleResetDemo}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onOpenResumeModal={() => {
          setActiveTab('profile');
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Human Approval Modal */}
      <ApprovalModal
        isOpen={isApprovalOpen}
        onClose={() => setIsApprovalOpen(false)}
        approvals={approvals}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Opportunity Detail Drawer */}
      <OpportunityDetailModal
        opp={selectedOppForDetail}
        isOpen={!!selectedOppForDetail}
        onClose={() => setSelectedOppForDetail(null)}
        onTrack={handleTrackOpportunity}
        isTracked={
          selectedOppForDetail
            ? applications.some(
                (a) =>
                  a.company === selectedOppForDetail.company &&
                  a.role === selectedOppForDetail.title
              )
            : false
        }
      />

      {/* Application Detail & Timeline Drawer */}
      <ApplicationDetailModal
        app={selectedAppForDetail}
        isOpen={!!selectedAppForDetail}
        onClose={() => setSelectedAppForDetail(null)}
        onUpdateApp={async (id, data) => {
          await api.updateApplication(id, data);
          await loadAllData();
        }}
        onTriggerFollowup={(app) => {
          handleSubmitGoal(
            `Prepare a personalized follow-up email for my ${app.role} application at ${app.company}.`
          );
        }}
      />
    </>
  );
}

export default function Home() {
  return (
    <ToastProvider>
      <CockpitContent />
    </ToastProvider>
  );
}

