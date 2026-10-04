'use client';

import React from 'react';
import {
  IconLogo,
  IconAgent,
  IconMission,
  IconOpportunity,
  IconEligibility,
  IconApproval,
  IconVerification,
  IconMatch,
  IconFollowup,
} from '../icons/TaskPilotIcons';
import { Sparkles, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, Play } from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onRunDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp, onRunDemo }) => {
  return (
    <div className="min-h-screen flex flex-col justify-between text-slate-100">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={onEnterApp}>
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <IconLogo className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-white">TaskPilot</span>
                <span className="px-2 py-0.5 text-[9px] font-mono uppercase bg-cyan-500/10 text-cyan-300 rounded-full border border-cyan-500/20">
                  Mission Control
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Opportunity Operations Platform</p>
            </div>
          </div>

          {/* Links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-slate-400 font-medium">
            <a href="#how-it-works" className="hover:text-cyan-300 transition-colors">How it works</a>
            <a href="#agent" className="hover:text-cyan-300 transition-colors">Agent Architecture</a>
            <a href="#approval" className="hover:text-cyan-300 transition-colors">Human Approval Gate</a>
            <a href="#opportunities" className="hover:text-cyan-300 transition-colors">Opportunity Radar</a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={onRunDemo}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-cyan-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 rounded-xl transition-all"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>3-Min Judge Demo</span>
            </button>

            <button
              onClick={onEnterApp}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-lg shadow-cyan-500/20 transition-all"
            >
              <span>Launch TaskPilot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Left Copy */}
        <div className="max-w-2xl space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>WCC Launchpad 30 — Agentic AI Track</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]">
            Give AI the task. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
              Keep the control.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-xl">
            TaskPilot finds opportunities, evaluates your fit, manages applications, prepares follow-ups, and takes approved actions — so you spend less time managing the work and more time acting on it.
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
            <button
              onClick={onEnterApp}
              className="flex items-center gap-2 px-6 py-3.5 text-sm font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 rounded-xl shadow-xl shadow-cyan-500/25 transition-all"
            >
              <span>Launch Mission Control</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onRunDemo}
              className="flex items-center gap-2 px-5 py-3.5 text-sm font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all"
            >
              <IconAgent className="w-4 h-4 text-cyan-400" />
              <span>See the Agent Work</span>
            </button>
          </div>

          <div className="pt-4 flex items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Explainable Fit Scores
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> Strict Human Gate
            </span>
            <span className="flex items-center gap-1.5">
              <IconVerification className="w-3.5 h-3.5 text-teal-400" /> DB Post-Verification
            </span>
          </div>
        </div>

        {/* Right: Live-Looking Agent Mission Console */}
        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md text-left">
          <div className="p-3.5 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-[11px] font-mono uppercase font-bold text-cyan-300 tracking-wider">
                MISSION ACTIVE
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">
              Trajectory: #TKP-0891
            </span>
          </div>

          <div className="p-4 space-y-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
              <div className="text-[10px] font-mono text-slate-500 uppercase">Input Goal</div>
              <div className="font-semibold text-white mt-0.5">
                "Find the best AI/ML internships for me and manage my pending applications."
              </div>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Understanding student profile & constraints</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Building 8-step autonomous execution plan</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Searching 14+ opportunities across configured sources</span>
              </div>
              <div className="flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Evaluating eligibility & explainable match scoring</span>
              </div>
              <div className="flex items-center gap-2 text-amber-300 animate-pulse">
                <IconApproval className="w-4 h-4 shrink-0 text-amber-400" />
                <span>Human Approval Gate: 2 follow-ups prepared</span>
              </div>
            </div>

            <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-amber-300">Action Paused for Approval</div>
                <div className="text-[11px] text-amber-400/80">Send follow-up email to Google Recruiting</div>
              </div>
              <button
                onClick={onEnterApp}
                className="px-3 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-lg shrink-0"
              >
                Inspect
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works / Core Loop */}
      <section id="how-it-works" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 mb-2">
            The Autonomous Agent Loop
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How TaskPilot Executes Your Career Workflow
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Not a chatbot. A goal-oriented operations system that performs multi-step work and pauses at consequential gates.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold font-mono text-sm">
              01
            </div>
            <h4 className="text-sm font-bold text-white">Understand & Plan</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              TaskPilot breaks your high-level objective into an explicit sequence of tool calls and sets execution parameters.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-bold font-mono text-sm">
              02
            </div>
            <h4 className="text-sm font-bold text-white">Discover & Score</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scans active internships and scores fit using transparent weights (Skills, Eligibility, Roles, Remote Fit, Urgency).
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold font-mono text-sm">
              03
            </div>
            <h4 className="text-sm font-bold text-white">Human Approval Gate</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The agent pauses before consequential actions. Review, edit, approve, or reject email dispatches and modifications.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold font-mono text-sm">
              04
            </div>
            <h4 className="text-sm font-bold text-white">Execute & Verify</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes authorized actions and performs a database verification audit to eliminate silent failures.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500 font-mono">
        TaskPilot © 2026 • WCC Launchpad 30 — Agentic AI Track • Production Release v1.0
      </footer>
    </div>
  );
};
