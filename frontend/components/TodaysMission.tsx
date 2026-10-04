'use client';

import React from 'react';
import {
  IconMission,
  IconAgent,
  IconApproval,
  IconSuccess,
  IconFollowup,
} from './icons/TaskPilotIcons';
import { Sparkles, ArrowRight, CheckCircle2, Clock, ShieldAlert, Play } from 'lucide-react';
import { Task } from '@/lib/api';

interface TodaysMissionProps {
  currentTask: Task | null;
  onOpenApproval: () => void;
  onRunMission: () => void;
  isLoading: boolean;
}

export const TodaysMission: React.FC<TodaysMissionProps> = ({
  currentTask,
  onOpenApproval,
  onRunMission,
  isLoading,
}) => {
  const isWaitingApproval = currentTask?.status === 'WAITING_FOR_APPROVAL';
  const isCompleted = currentTask?.status === 'COMPLETED';

  // Calculate percentage
  let progressPct = 0;
  if (currentTask) {
    if (isCompleted) progressPct = 100;
    else if (isWaitingApproval) progressPct = 85;
    else if (currentTask.current_step) progressPct = Math.round((currentTask.current_step / (currentTask.total_steps || 8)) * 100);
  } else {
    progressPct = 0;
  }

  return (
    <div className="bg-gradient-to-r from-slate-900 via-slate-900/95 to-slate-950 border border-cyan-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
      {/* Background ambient beam */}
      <div className="absolute top-0 right-0 w-80 h-full bg-gradient-to-l from-cyan-500/5 to-transparent pointer-events-none" />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
        {/* Left: Mission Info */}
        <div className="space-y-3 max-w-xl">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] font-mono uppercase font-bold text-cyan-300 tracking-wider">
              TODAY'S MISSION
            </span>
            <span className="text-[10px] font-mono text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {currentTask ? currentTask.status : 'STANDBY'}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
            {currentTask?.user_goal ||
              'Find high-fit AI/ML internships and prepare pending follow-ups.'}
          </h2>

          <p className="text-xs text-slate-400 leading-relaxed">
            TaskPilot continuously benchmarks candidate fit against incoming technical opportunities, manages pipeline transitions, and drafts follow-ups beyond the 14-day silence threshold.
          </p>

          {/* Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs pt-1">
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>14 opportunities analyzed & ranked</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>Top 4 opportunities shortlisted</span>
            </div>
            <div className="flex items-center gap-2 text-amber-300 font-medium">
              <Clock className="w-4 h-4 shrink-0 text-amber-400" />
              <span>2 overdue applications identified</span>
            </div>
            <div className="flex items-center gap-2 text-cyan-300 font-medium">
              <ShieldAlert className="w-4 h-4 shrink-0 text-cyan-400" />
              <span>Human approval required for dispatch</span>
            </div>
          </div>
        </div>

        {/* Right: Progress Meter & Call to Action */}
        <div className="lg:w-80 bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 shrink-0">
          <div>
            <div className="flex justify-between items-center text-xs font-mono mb-2">
              <span className="text-slate-400">Mission Progress</span>
              <span className="font-bold text-cyan-400">{progressPct}%</span>
            </div>
            <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
              <div
                className="bg-gradient-to-r from-cyan-500 to-teal-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPct || 5}%` }}
              />
            </div>
          </div>

          <div className="text-xs text-slate-400">
            <div className="text-[10px] font-mono uppercase text-slate-500 font-semibold">
              Next Action
            </div>
            <div className="font-semibold text-slate-200 mt-0.5">
              {isWaitingApproval
                ? '→ Review & authorize 2 follow-up drafts'
                : isCompleted
                ? '✓ All steps completed & verified'
                : '→ Run mission execution cycle'}
            </div>
          </div>

          {isWaitingApproval ? (
            <button
              onClick={onOpenApproval}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all animate-pulse"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Open Human Approval Gate</span>
            </button>
          ) : (
            <button
              onClick={onRunMission}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoading ? 'Executing Mission...' : 'Execute Mission Cycle'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
