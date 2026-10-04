'use client';

import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlayCircle,
  ShieldAlert,
  ArrowRight,
  Terminal,
  Cpu,
} from 'lucide-react';
import { Task, AgentAction } from '@/lib/api';

interface AgentActivityPanelProps {
  task: Task | null;
  actions: AgentAction[];
  onOpenApproval: () => void;
}

export const AgentActivityPanel: React.FC<AgentActivityPanelProps> = ({
  task,
  actions,
  onOpenApproval,
}) => {
  if (!task && actions.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-8 text-center text-slate-400">
        <Cpu className="w-10 h-10 text-indigo-400/50 mx-auto mb-3" />
        <h3 className="text-base font-medium text-slate-200">TaskPilot Agent Idle</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
          Submit an instruction in the command bar or click "Run 3-Min Judge Demo" to observe autonomous planning, tool execution, and verification.
        </p>
      </div>
    );
  }

  const isAwaitingApproval = task?.status === 'WAITING_FOR_APPROVAL';

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
      {/* Top Header */}
      <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Agent Orchestration Engine
            </h3>
            <p className="text-xs text-slate-500 truncate max-w-md">
              Goal: "{task?.user_goal}"
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isAwaitingApproval && (
            <button
              onClick={onOpenApproval}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold rounded-lg hover:bg-amber-500/20 transition-all animate-bounce"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Approval Required</span>
            </button>
          )}

          <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-md uppercase tracking-wider ${
              task?.status === 'COMPLETED'
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : isAwaitingApproval
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
            }`}
          >
            {task?.status?.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Plan Progress Grid */}
      {task?.plan && task.plan.length > 0 && (
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/30">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
            Orchestration Plan ({task.plan.filter((s) => s.status === 'COMPLETED').length} / {task.plan.length} Completed)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {task.plan.map((step) => {
              const isDone = step.status === 'COMPLETED';
              const isWaiting = step.status === 'WAITING_APPROVAL';
              const isCurrent = task.current_step === step.step && !isDone;

              return (
                <div
                  key={step.step}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isDone
                      ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                      : isWaiting
                      ? 'bg-amber-950/20 border-amber-700/50 text-amber-300 animate-pulse'
                      : isCurrent
                      ? 'bg-indigo-950/30 border-indigo-700 text-indigo-200'
                      : 'bg-slate-950/20 border-slate-800/60 text-slate-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[10px] opacity-70">Step 0{step.step}</span>
                    {isDone ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : isWaiting ? (
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    ) : (
                      <Clock className="w-3.5 h-3.5 opacity-40" />
                    )}
                  </div>
                  <div className="font-medium truncate">{step.name}</div>
                  <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                    tool: {step.tool}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Execution Audit Stream */}
      <div className="p-4 max-h-72 overflow-y-auto space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Live Tool Execution Audit
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            {actions.length} records logged
          </span>
        </div>

        {actions.length === 0 ? (
          <div className="text-xs text-slate-500 italic py-2">
            Waiting for tool telemetry...
          </div>
        ) : (
          actions.map((act) => (
            <div
              key={act.id}
              className="p-3 bg-slate-950/50 border border-slate-800/70 rounded-xl text-xs flex flex-col gap-1.5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-md bg-indigo-500/20 text-indigo-300 font-mono text-[10px] flex items-center justify-center font-bold">
                    {act.step_number}
                  </span>
                  <span className="font-mono font-semibold text-slate-200">
                    {act.tool_name}()
                  </span>
                  <span
                    className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-semibold ${
                      act.permission_level === 'CONSEQUENT'
                        ? 'bg-amber-500/20 text-amber-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {act.permission_level}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-slate-400 text-[11px] font-mono">
                  <span>{act.execution_time_ms}ms</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                </div>
              </div>

              {/* Result summary */}
              <div className="bg-slate-900/60 p-2 rounded-lg text-[11px] font-mono text-slate-300 border border-slate-800/50">
                {JSON.stringify(act.output_result)}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Final Summary Banner */}
      {task?.final_summary && (
        <div className="p-4 bg-emerald-950/30 border-t border-emerald-800/40 text-xs text-emerald-200 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
          <div>
            <div className="font-semibold text-emerald-300 mb-0.5">Agent Execution Report</div>
            <p className="leading-relaxed opacity-90">{task.final_summary}</p>
          </div>
        </div>
      )}
    </div>
  );
};
