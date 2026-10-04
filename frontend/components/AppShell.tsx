'use client';

import React from 'react';
import {
  IconLogo,
  IconAgent,
  IconMission,
  IconOpportunity,
  IconApplication,
  IconFollowup,
  IconApproval,
  IconProfile,
  IconVerification,
} from './icons/TaskPilotIcons';
import {
  Sparkles,
  RotateCcw,
  Search,
  LayoutDashboard,
  BarChart3,
  Menu,
  X,
  Play,
  CheckCircle2,
} from 'lucide-react';

interface AppShellProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCommandPalette: () => void;
  onRunDemo: () => void;
  onResetDemo: () => void;
  isRunningDemo: boolean;
  pendingApprovalsCount: number;
  profileName?: string;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  activeTab,
  setActiveTab,
  onOpenCommandPalette,
  onRunDemo,
  onResetDemo,
  isRunningDemo,
  pendingApprovalsCount,
  profileName = 'Alex Chen',
  children,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'mission', label: "Today's Mission", icon: <IconMission className="w-4 h-4 text-cyan-400" /> },
    { id: 'opportunities', label: 'Opportunity Radar', icon: <IconOpportunity className="w-4 h-4 text-teal-400" /> },
    { id: 'pipeline', label: 'Application Pipeline', icon: <IconApplication className="w-4 h-4 text-indigo-400" /> },
    {
      id: 'followups',
      label: 'Follow-ups',
      icon: <IconFollowup className="w-4 h-4 text-amber-400" />,
      badge: pendingApprovalsCount,
    },
    { id: 'agent', label: 'Agent Studio', icon: <IconAgent className="w-4 h-4 text-cyan-400" /> },
    {
      id: 'approvals',
      label: 'Approval Gate',
      icon: <IconApproval className="w-4 h-4 text-amber-400" />,
      badge: pendingApprovalsCount,
    },
    { id: 'profile', label: 'Candidate Profile', icon: <IconProfile className="w-4 h-4 text-slate-400" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4 text-slate-400" /> },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans">
      {/* Top Cockpit Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 h-14">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo & Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-slate-400 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div
              className="flex items-center gap-2.5 cursor-pointer"
              onClick={() => setActiveTab('dashboard')}
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-md shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <IconLogo className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-white">TaskPilot</span>
                <span className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono uppercase bg-cyan-500/10 text-cyan-300 rounded border border-cyan-500/20">
                  Cockpit
                </span>
              </div>
            </div>
          </div>

          {/* Center: Command Palette Trigger (⌘K) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-400 flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Search missions, opportunities, or type a command...</span>
              </div>
              <kbd className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDemo}
              title="Reset to benchmark demo state"
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onRunDemo}
              disabled={isRunningDemo}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>{isRunningDemo ? 'Agent Active...' : '3-Min Judge Demo'}</span>
            </button>

            {/* Profile Avatar Chip */}
            <div
              onClick={() => setActiveTab('profile')}
              className="flex items-center gap-2 pl-2 border-l border-slate-800 cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-slate-950">
                AC
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with Sidebar */}
      <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
        {/* Desktop Sidebar Navigation */}
        <aside className="w-56 shrink-0 hidden lg:block border-r border-slate-800/80 p-3.5 space-y-1 select-none">
          <div className="text-[10px] font-mono uppercase text-slate-500 px-3 py-1 font-semibold tracking-wider">
            Navigation
          </div>

          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                  active
                    ? 'bg-slate-900 text-cyan-300 border border-slate-800 shadow-sm font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={active ? 'text-cyan-400' : 'text-slate-500'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}

          <div className="pt-6">
            <div className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono uppercase">
                <span className="text-slate-500 font-semibold">Agent Status</span>
                <span className="text-cyan-400 flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  Ready
                </span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono">
                Engine: <strong className="text-cyan-300">Groq (120B)</strong>
              </div>
              <div className="text-[10px] text-slate-500">
                Zero hallucinations via verified tool contracts
              </div>
            </div>
          </div>
        </aside>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bg-slate-950/95 border-b border-slate-800 z-50 p-4 space-y-2 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                  activeTab === item.id ? 'bg-slate-900 text-cyan-300' : 'text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon}
                  <span>{item.label}</span>
                </div>
                {item.badge && item.badge > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-bold text-[10px] flex items-center justify-center">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </div>
        )}

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-6 pb-24 overflow-y-auto">
          {children}
        </main>
      </div>

      {/* Persistent Floating Interactive Cockpit HUD */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-slate-950/90 backdrop-blur-xl border border-cyan-500/30 rounded-2xl px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 shadow-2xl shadow-cyan-950/80 transition-all hover:border-cyan-400/60">
        <button
          onClick={onRunDemo}
          disabled={isRunningDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current" />
          <span className="hidden sm:inline">Run Judge Demo</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveTab('approvals')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md transition-all animate-pulse active:scale-95"
          >
            <IconApproval className="w-3.5 h-3.5" />
            <span>Gate ({pendingApprovalsCount})</span>
          </button>
        )}

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        <button
          onClick={onOpenCommandPalette}
          className="text-xs font-mono text-slate-400 hover:text-cyan-300 px-2 py-1 rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3 h-3 text-cyan-400" />
          <span className="hidden md:inline">Command</span>
          <kbd className="text-[10px] bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-slate-400">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onResetDemo}
          title="Reset to benchmark demo state"
          className="p-1.5 text-slate-400 hover:text-white bg-slate-900/80 hover:bg-slate-800 rounded-lg border border-slate-800 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
