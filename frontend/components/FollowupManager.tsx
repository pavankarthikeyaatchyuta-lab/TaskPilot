'use client';

import React from 'react';
import {
  Clock,
  Mail,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Send,
  Sparkles,
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
  const getDaysSinceApplied = (appliedDate?: string) => {
    if (!appliedDate) return 0;
    return Math.floor(
      (new Date().getTime() - new Date(appliedDate).getTime()) / (1000 * 3600 * 24)
    );
  };

  const overdueApps = applications.filter((app) => {
    const days = getDaysSinceApplied(app.applied_date);
    return (
      (app.status === 'APPLIED' || app.status === 'UNDER_REVIEW' || app.status === 'FOLLOW_UP_REQUIRED') &&
      days >= 14
    );
  });

  return (
    <div className="space-y-4">
      {/* Header banner */}
      <div className="bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-lg">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Follow-up Command Center
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                TaskPilot monitors submission timestamps and triggers proactive follow-ups beyond the 14-day threshold.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenApproval}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Open Human Approval Gate</span>
          </button>
        </div>
      </div>

      {/* List of overdue applications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {overdueApps.length === 0 ? (
          <div className="col-span-2 bg-slate-900/40 border border-slate-800 rounded-2xl p-8 text-center text-slate-500 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-400/50 mx-auto mb-2" />
            No applications are currently past the 14-day follow-up threshold.
          </div>
        ) : (
          overdueApps.map((app) => {
            const days = getDaysSinceApplied(app.applied_date);

            return (
              <div
                key={app.id}
                className="bg-slate-900/80 border border-amber-500/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                        <Building className="w-3.5 h-3.5" />
                        {app.company}
                      </div>
                      <h3 className="text-sm font-bold text-white mt-0.5">{app.role}</h3>
                    </div>

                    <span className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      {days} Days Pending
                    </span>
                  </div>

                  {/* Recommendation card */}
                  <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl text-xs space-y-1.5">
                    <div className="text-[10px] uppercase font-bold text-slate-400">
                      Agent Recommendation:
                    </div>
                    <div className="text-slate-200 text-xs font-medium">
                      Follow up now: Application has exceeded 14-day silence threshold.
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Applied on {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'N/A'}. No candidate response recorded.
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">
                    Status: {app.status}
                  </span>

                  <button
                    onClick={() => onTriggerDraft(app)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Generate & Review Draft</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Outbox & Sent History */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            Approved & Dispatched Communication Outbox
          </h3>
          <span className="text-[11px] text-slate-500 font-mono">
            Verified Audit Log
          </span>
        </div>

        {applications.flatMap((a) => (a.events || []).filter((e) => e.event_type === 'FOLLOW_UP_SENT').map((e) => ({ ...e, company: a.company, role: a.role }))).length === 0 ? (
          <div className="text-xs text-slate-500 italic p-4 text-center border border-dashed border-slate-800 rounded-xl">
            No follow-up messages dispatched yet. Approved messages will appear here after passing the Human Approval Gate.
          </div>
        ) : (
          <div className="space-y-2">
            {applications.flatMap((a) =>
              (a.events || [])
                .filter((e) => e.event_type === 'FOLLOW_UP_SENT')
                .map((e) => ({ ...e, company: a.company, role: a.role }))
            ).map((item) => (
              <div
                key={item.id}
                className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-3 text-xs flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="font-semibold text-white flex items-center gap-2">
                    <span>{item.company}</span>
                    <span className="text-slate-400 font-normal">({item.role})</span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-semibold">
                      VERIFIED DISPATCH
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate max-w-lg">
                    {item.metadata_json?.subject || item.description}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-mono shrink-0">
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
