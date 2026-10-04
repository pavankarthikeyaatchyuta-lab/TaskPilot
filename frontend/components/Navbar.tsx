'use client';

import React from 'react';
import { Bot, Sparkles, RotateCcw, User, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRunDemo: () => void;
  onResetDemo: () => void;
  isRunningDemo: boolean;
  pendingApprovalsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onRunDemo,
  onResetDemo,
  isRunningDemo,
  pendingApprovalsCount,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'agent', label: 'Agent Studio' },
    { id: 'opportunities', label: 'Opportunities' },
    { id: 'pipeline', label: 'Application Pipeline' },
    { id: 'followups', label: 'Follow-ups', badge: pendingApprovalsCount },
    { id: 'profile', label: 'Student Profile' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 p-[2px] shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white">TaskPilot</span>
                <span className="px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase bg-indigo-500/10 text-indigo-400 rounded-full border border-indigo-500/20">
                  Agentic AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Opportunity & Workflow Orchestrator</p>
            </div>
          </div>

          {/* Nav Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800/80">
            {tabs.map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                    active
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  {tab.label}
                  {tab.badge && tab.badge > 0 ? (
                    <span className="w-4 h-4 text-[10px] flex items-center justify-center rounded-full bg-amber-500 text-slate-950 font-bold">
                      {tab.badge}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDemo}
              title="Reset to benchmark demo state"
              className="p-2 text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={onRunDemo}
              disabled={isRunningDemo}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 rounded-xl shadow-md shadow-indigo-600/20 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-emerald-300 animate-pulse" />
              <span>{isRunningDemo ? 'Agent Orchestrating...' : 'Run 3-Min Judge Demo'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
