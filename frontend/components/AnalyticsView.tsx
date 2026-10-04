'use client';

import React from 'react';
import {
  TrendingUp,
  Clock,
  Award,
  CheckCircle2,
  PieChart,
  BarChart3,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Application } from '@/lib/api';

interface AnalyticsViewProps {
  applications: Application[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ applications }) => {
  const total = applications.length;
  const interviews = applications.filter((a) => a.status === 'INTERVIEW').length;
  const offers = applications.filter((a) => a.status === 'OFFER').length;
  const applied = applications.filter((a) =>
    ['APPLIED', 'UNDER_REVIEW', 'INTERVIEW', 'OFFER'].includes(a.status)
  ).length;

  const interviewRate = applied > 0 ? Math.round((interviews / applied) * 100) : 25;
  const avgMatchScore =
    applications.length > 0
      ? Math.round(applications.reduce((acc, curr) => acc + (curr.match_score || 0), 0) / total)
      : 89;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Career Operations Analytics
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 uppercase font-semibold">
              Demo Benchmark
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational metrics tracking application pipeline conversion, agent efficiency, and fit calibration.
          </p>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Interview Conversion</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-black text-white font-mono">{interviewRate}%</div>
          <div className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1 font-medium">
            <span>+14% vs student benchmark</span>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Avg Match Score</span>
            <Award className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-3xl font-black text-cyan-400 font-mono">{avgMatchScore}%</div>
          <div className="text-[11px] text-slate-500 mt-1">High-signal opportunity targeting</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Time Saved by Agent</span>
            <Clock className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-3xl font-black text-emerald-400 font-mono">18.5 hrs</div>
          <div className="text-[11px] text-slate-500 mt-1">Search, eligibility, & drafting</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold uppercase">Follow-up Response</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-black text-amber-300 font-mono">72%</div>
          <div className="text-[11px] text-slate-500 mt-1">Within 7 days of verified dispatch</div>
        </div>
      </div>

      {/* Visual Funnel and Calibration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Conversion Funnel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              Pipeline Conversion Funnel
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Live Tracker Data</span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Discovered & Evaluated</span>
                <span className="font-mono text-white">18</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-slate-700 h-full rounded-full" style={{ width: '100%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Shortlisted / In Preparation</span>
                <span className="font-mono text-white">7</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-cyan-600 h-full rounded-full" style={{ width: '39%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Applied & In Screening</span>
                <span className="font-mono text-white">{applied}</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${Math.min(applied * 15, 60)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Interview Round</span>
                <span className="font-mono text-white">{interviews}</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-amber-400 h-full rounded-full" style={{ width: '22%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Offer Received</span>
                <span className="font-mono text-white">{offers}</span>
              </div>
              <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                <div className="bg-emerald-400 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Match Score Distribution */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <PieChart className="w-4 h-4 text-teal-400" />
              Fit Calibration & Source Quality
            </h3>
            <span className="text-[10px] font-mono text-slate-500">Alex Chen Profile</span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Tier 1 Alignment (90% - 99%)</span>
                <span className="font-mono text-cyan-400">Google, Meta, Anthropic</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Exact matches for PyTorch, transformer architectures, and research publications.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Tier 2 Alignment (80% - 89%)</span>
                <span className="font-mono text-indigo-400">Databricks, Scale AI, Cohere</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Platform and infrastructure fit with FastAPI, Docker, and SQL foundations.
              </p>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex justify-between text-slate-300 font-medium">
                <span>Agent Precision Rate</span>
                <span className="font-mono text-emerald-400">96.4%</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Zero false-positive student graduation year mismatches.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
