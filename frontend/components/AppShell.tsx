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
} from './icons/TaskPilotIcons';
import {
  RotateCcw,
  Search,
  LayoutDashboard,
  BarChart3,
  Menu,
  X,
  Play,
  Cpu,
  Shield,
  Layers,
  Sparkles,
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

interface NavSection {
  title: string;
  items: {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[];
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

  const navSections: NavSection[] = [
    {
      title: 'Operations',
      items: [
        { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
        { id: 'mission', label: "Today's Mission", icon: IconMission },
        { id: 'opportunities', label: 'Opportunity Radar', icon: IconOpportunity },
        { id: 'pipeline', label: 'Application Pipeline', icon: IconApplication },
      ],
    },
    {
      title: 'Agentic Control',
      items: [
        {
          id: 'followups',
          label: 'Follow-ups',
          icon: IconFollowup,
          badge: pendingApprovalsCount,
        },
        {
          id: 'approvals',
          label: 'Approval Gate',
          icon: IconApproval,
          badge: pendingApprovalsCount,
        },
        { id: 'agent', label: 'Agent Studio', icon: IconAgent },
      ],
    },
    {
      title: 'Intelligence',
      items: [
        { id: 'profile', label: 'Candidate Profile', icon: IconProfile },
        { id: 'analytics', label: 'Analytics & Intel', icon: BarChart3 },
      ],
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-[#07090e] text-slate-100 font-sans selection:bg-slate-700 selection:text-white overflow-hidden">
      {/* Top Cockpit Header - Fixed at Top */}
      <header className="h-14 shrink-0 z-40 bg-[#090c13]/95 backdrop-blur-md border-b border-black/80 shadow-[0_4px_12px_#030508]">
        <div className="max-w-[1480px] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          {/* Logo & Cockpit Identity */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 neuro-btn-tactile rounded-xl text-slate-400 hover:text-white"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>

            <div
              className="flex items-center gap-3 cursor-pointer select-none group"
              onClick={() => setActiveTab('dashboard')}
            >
              {/* 3D Neuromorphic Embossed Brand Emblem */}
              <div className="w-9 h-9 rounded-xl neuro-convex flex items-center justify-center p-1 border border-slate-700/50 group-hover:border-slate-500/80 transition-all">
                <IconLogo className="w-4 h-4 text-slate-200 group-hover:text-white transition-colors" />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm tracking-tight text-slate-100">TaskPilot</span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider text-slate-300 neuro-inset rounded-md border border-slate-800">
                  Cockpit
                </span>
              </div>
            </div>
          </div>

          {/* Center: Command Palette Trigger (3D Recessed Slot) */}
          <div className="flex-1 max-w-md hidden md:block">
            <button
              onClick={onOpenCommandPalette}
              className="w-full neuro-inset hover:border-slate-700/80 rounded-xl px-3.5 py-1.5 text-xs text-slate-400 flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-colors" />
                <span className="text-slate-400 group-hover:text-slate-300">
                  Search missions, opportunities, or execute...
                </span>
              </div>
              <kbd className="text-[10px] font-mono text-slate-300 neuro-badge-pill px-2 py-0.5 rounded border border-slate-700/50">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Right Action Bar - 3D Tactile Buttons (Zero Neon) */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={onResetDemo}
              title="Reset to benchmark demo state"
              className="p-2 text-slate-400 hover:text-slate-100 neuro-btn-tactile rounded-xl transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={onRunDemo}
              disabled={isRunningDemo}
              className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-slate-100 neuro-btn-tactile rounded-xl transition-all disabled:opacity-50"
            >
              <Play className="w-3 h-3 fill-current text-slate-300" />
              <span>{isRunningDemo ? 'Agent Active...' : '3-Min Demo'}</span>
            </button>

            {/* Profile Avatar Chip - Tactile Coin */}
            <div
              onClick={() => setActiveTab('profile')}
              title={`Active Profile: ${profileName}`}
              className="flex items-center gap-2 pl-2 border-l border-slate-800/80 cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full neuro-convex flex items-center justify-center text-[11px] font-bold text-slate-200 border border-slate-700/60 hover:border-slate-500 transition-all">
                AC
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container with 3D Neuromorphic Fixed Sidebar */}
      <div className="flex-1 flex overflow-hidden max-w-[1480px] w-full mx-auto">
        {/* Desktop 3D Neuromorphic Sidebar - Fixed & Immovable */}
        <aside className="w-64 shrink-0 hidden lg:flex flex-col justify-between neuro-sidebar p-3 space-y-4 select-none h-full overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="space-y-4">
            {navSections.map((section, idx) => (
              <div key={section.title} className="space-y-1">
                {/* Section Engraved Header */}
                <div className="flex items-center justify-between px-3 pt-1 pb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                    {section.title}
                  </span>
                  <div className="h-[1px] flex-1 ml-3 bg-gradient-to-r from-slate-800/60 to-transparent" />
                </div>

                {/* Section Items */}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = activeTab === item.id;
                    const IconComponent = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full neuro-nav-item flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                          active
                            ? 'active text-slate-100 font-semibold'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          {/* Tactile Inset Marker for Active Tab */}
                          {active && (
                            <span className="w-1 h-4 rounded-full bg-slate-200 shadow-[0_0_4px_rgba(255,255,255,0.4)] mr-0.5" />
                          )}
                          <span
                            className={
                              active
                                ? 'text-slate-200'
                                : 'text-slate-500 group-hover:text-slate-300'
                            }
                          >
                            <IconComponent className="w-4 h-4" />
                          </span>
                          <span className="tracking-tight">{item.label}</span>
                        </div>

                        {/* 3D Embossed Pill Badge */}
                        {item.badge && item.badge > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#26190f] text-amber-300 border border-amber-700/50 shadow-[inset_1px_1px_2px_rgba(255,255,255,0.06),2px_2px_4px_#040608]">
                            {item.badge}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom 3D Hardware Telemetry Pod - Machined Avionics Style */}
          <div className="pt-2">
            <div className="neuro-hardware-bay rounded-2xl p-3 space-y-2.5">
              {/* Top Row: Tactile Power Status LED */}
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-slate-400" />
                  Agent Core
                </span>
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full neuro-convex border border-slate-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                  <span className="text-slate-300 text-[10px] font-bold">READY</span>
                </div>
              </div>

              {/* Engine Readout Plaque */}
              <div className="neuro-inset rounded-xl p-2.5 space-y-1">
                <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                  <span className="text-slate-500">LLM Engine:</span>
                  <span className="font-bold text-slate-200">Groq · 120B</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">Schema Guard:</span>
                  <span className="text-emerald-400/90 font-semibold">Strict JSON</span>
                </div>
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                  <span className="text-slate-500">Avg Latency:</span>
                  <span className="text-slate-300 font-semibold">0.09s</span>
                </div>
              </div>

              {/* Quick Calibration Action */}
              <button
                onClick={onRunDemo}
                disabled={isRunningDemo}
                className="w-full neuro-btn-tactile py-1.5 px-2 rounded-xl text-[11px] font-semibold text-slate-300 hover:text-white flex items-center justify-center gap-1.5 transition-all"
              >
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>Run Agent Simulation</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Mobile Dropdown Menu (Matching 3D Neuromorphic Styling) */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-x-0 top-14 bg-[#090c13]/95 border-b border-black/80 z-50 p-4 space-y-3 backdrop-blur-md shadow-2xl">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold px-2">
                  {section.title}
                </div>
                {section.items.map((item) => {
                  const active = activeTab === item.id;
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full neuro-nav-item flex items-center justify-between p-2.5 rounded-xl text-xs font-semibold ${
                        active ? 'active text-slate-100' : 'text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent className="w-4 h-4 text-slate-300" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && item.badge > 0 ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#26190f] text-amber-300 border border-amber-700/50">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        )}

        {/* Main Content Workspace - Independent Smooth Scrolling */}
        <main className="flex-1 h-full overflow-y-auto p-4 sm:p-6 pb-28 scroll-smooth">
          {children}
        </main>
      </div>

      {/* Persistent Floating 3D Neuromorphic Cockpit HUD (No neon) */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 neuro-panel rounded-2xl px-3 sm:px-4 py-2 flex items-center gap-2 sm:gap-3 shadow-[8px_8px_24px_#020305,-2px_-2px_12px_rgba(255,255,255,0.03)] border border-slate-700/40">
        <button
          onClick={onRunDemo}
          disabled={isRunningDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-100 neuro-btn-tactile rounded-xl transition-all active:scale-95 disabled:opacity-50"
        >
          <Play className="w-3 h-3 fill-current text-slate-300" />
          <span className="hidden sm:inline">Run Judge Demo</span>
          <span className="sm:hidden">Demo</span>
        </button>

        {pendingApprovalsCount > 0 && (
          <button
            onClick={() => setActiveTab('approvals')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-amber-200 bg-[#2b1c0e] hover:bg-[#382412] border border-amber-700/50 rounded-xl shadow-[2px_2px_6px_#030508] transition-all active:scale-95"
          >
            <IconApproval className="w-3.5 h-3.5 text-amber-300" />
            <span>Gate ({pendingApprovalsCount})</span>
          </button>
        )}

        <div className="h-4 w-[1px] bg-slate-800 hidden sm:block" />

        <button
          onClick={onOpenCommandPalette}
          className="text-xs font-mono text-slate-400 hover:text-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-800/50 transition-colors flex items-center gap-1.5"
        >
          <Search className="w-3 h-3 text-slate-400" />
          <span className="hidden md:inline">Command</span>
          <kbd className="text-[10px] neuro-badge-pill px-1.5 py-0.5 rounded border border-slate-700/50 text-slate-300">
            ⌘K
          </kbd>
        </button>

        <button
          onClick={onResetDemo}
          title="Reset to benchmark demo state"
          className="p-1.5 text-slate-400 hover:text-slate-200 neuro-btn-tactile rounded-lg transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
