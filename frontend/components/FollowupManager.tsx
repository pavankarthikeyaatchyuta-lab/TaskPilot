'use client';

import React, { useState } from 'react';
import {
  Clock,
  Mail,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
  Filter,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Application } from '@/lib/api';

interface FollowupManagerProps {
  applications: Application[];
  onTriggerDraft: (app: Application) => void;
  onOpenApproval: () => void;
}

export const FollowupManager: React.FC<FollowupManagerProps> = ({
  applications,
  onTriggerDraft,
  onOpenApproval,
}) => {
  const [filterThreshold, setFilterThreshold] = useState<number>(14);

  const getDaysSinceApplied = (appliedDate?: string) => {
    if (!appliedDate) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(appliedDate).getTime()) / (1000 * 3600 * 24)
    );
  };

  const activeApps = applications.filter(
    (app) => app.status === 'APPLIED' || app.status === 'UNDER_REVIEW' || app.status === 'FOLLOW_UP_REQUIRED'
  );

  const filteredApps = activeApps.filter((app) => {
    if (filterThreshold === 0) return true; // Show all
    const days = getDaysSinceApplied(app.applied_date);
    return days >= filterThreshold;
  });

  return (
    <div className="space-y-4">
      {/* 3D Neuromorphic Header Banner */}
      <div className="neuro-panel rounded-2xl p-5 shadow-lg border border-slate-700/60">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl neuro-convex flex items-center justify-center shrink-0 border border-slate-700/60">
              <Clock className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Follow-up Command Center
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Autonomous timestamp tracking with verified operator oversight
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenApproval}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-200 bg-[#2b1c0e] hover:bg-[#382412] border border-amber-700/50 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Review Pending Approvals</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Tabs for Follow-up Threshold */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] font-mono uppercase text-slate-500 font-semibold mr-1">
            Silence Threshold:
          </span>
          {[
            { label: '≥ 14 Days (Overdue)', value: 14 },
            { label: '≥ 7 Days', value: 7 },
            { label: 'All Active Applications', value: 0 },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterThreshold(tab.value)}
              className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                filterThreshold === tab.value
                  ? 'active neuro-nav-item text-slate-100 font-semibold border-slate-700/80'
                  : 'neuro-btn-tactile text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-400">
          Showing {filteredApps.length} candidate applications
        </span>
      </div>

      {/* List of Applications eligible for Follow-up */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApps.length === 0 ? (
          <div className="col-span-2 neuro-panel rounded-2xl p-8 text-center text-slate-500 text-xs space-y-2">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/60 mx-auto" />
            <div className="font-semibold text-slate-300">
              No applications match the {filterThreshold > 0 ? `${filterThreshold}-day` : 'active'} threshold.
            </div>
            <p className="text-slate-500 max-w-sm mx-auto">
              Select &quot;All Active Applications&quot; to draft a proactive check-in for any tracked role.
            </p>
          </div>
        ) : (
          filteredApps.map((app) => {
            const days = getDaysSinceApplied(app.applied_date);
            const isOverdue = days >= 14;

            return (
              <div
                key={app.id}
                className="neuro-panel rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4 border border-slate-700/60 hover:border-slate-500/80 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5 text-slate-400" />
                        {app.company}
                      </div>
                      <h3 className="text-sm font-bold text-slate-100 mt-0.5">{app.role}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-1 text-[10px] font-mono font-bold uppercase rounded-full ${
                        isOverdue
                          ? 'bg-[#2b1c0e] text-amber-300 border border-amber-700/60'
                          : 'neuro-inset text-slate-300 border border-slate-700/50'
                      }`}
                    >
                      {days > 0 ? `${days} Days Since Applied` : 'Recent Application'}
                    </span>
                  </div>

                  {/* Recommendation Card */}
                  <div className="neuro-inset p-3 rounded-xl text-xs space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-slate-400" />
                      Agent Recommendation:
                    </div>
                    <div className="text-slate-200 text-xs font-medium">
                      {isOverdue
                        ? 'High-priority check-in: 14-day threshold reached. Polite status inquiry recommended.'
                        : 'Proactive engagement: Maintain recruiter interest with a brief value-add update.'}
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      Submission date: {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}.
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-black/60 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Stage: <strong className="text-slate-200">{app.status}</strong>
                  </span>

                  <button
                    onClick={() => onTriggerDraft(app)}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-100 neuro-btn-tactile rounded-xl shadow-md transition-all active:scale-95"
                  >
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Generate & Review Draft</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Outbox & Sent History (3D Neuromorphic Panel) */}
      <div className="neuro-panel rounded-2xl p-5 space-y-3 border border-slate-700/60">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            Approved & Dispatched Communication Outbox
          </h3>
          <span className="text-[11px] text-slate-400 font-mono">
            Cryptographically Audited Log
          </span>
        </div>

        {applications.flatMap((a) =>
          (a.events || [])
            .filter((e) => e.event_type === 'FOLLOW_UP_SENT')
            .map((e) => ({ ...e, company: a.company, role: a.role }))
        ).length === 0 ? (
          <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl select-none">
            No follow-up messages dispatched yet. Approved messages will appear here after passing the Human Approval Gate.
          </div>
        ) : (
          <div className="space-y-2">
            {applications
              .flatMap((a) =>
                (a.events || [])
                  .filter((e) => e.event_type === 'FOLLOW_UP_SENT')
                  .map((e) => ({ ...e, company: a.company, role: a.role }))
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="neuro-inset rounded-xl p-3 text-xs flex items-center justify-between gap-3"
                >
                  <div className="space-y-0.5">
                    <div className="font-semibold text-slate-100 flex items-center gap-2">
                      <span>{item.company}</span>
                      <span className="text-slate-400 font-normal">({item.role})</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-800/40">
                        VERIFIED DISPATCH
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate max-w-lg">
                      {item.metadata_json?.subject || item.description}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono shrink-0">
                    {new Date(item.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};
