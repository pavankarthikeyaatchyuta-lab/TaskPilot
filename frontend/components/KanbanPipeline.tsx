'use client';

import React from 'react';
import {
  Building,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';
import { Application, api } from '@/lib/api';

interface KanbanPipelineProps {
  applications: Application[];
  onStatusChange: (id: number, newStatus: string) => void;
  onOpenFollowup: (app: Application) => void;
}

const COLUMNS = [
  { id: 'SHORTLISTED', label: 'Shortlisted', color: 'border-slate-700' },
  { id: 'PREPARING', label: 'Preparing', color: 'border-sky-700' },
  { id: 'APPLIED', label: 'Applied', color: 'border-indigo-700' },
  { id: 'UNDER_REVIEW', label: 'Under Review', color: 'border-violet-700' },
  { id: 'INTERVIEW', label: 'Interview', color: 'border-amber-700' },
  { id: 'OFFER', label: 'Offer', color: 'border-emerald-700' },
];

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  applications,
  onStatusChange,
  onOpenFollowup,
}) => {
  const getDaysSinceApplied = (appliedDate?: string) => {
    if (!appliedDate) return null;
    const diff = Math.floor(
      (new Date().getTime() - new Date(appliedDate).getTime()) / (1000 * 3600 * 24)
    );
    return diff;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Application Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Drag or transition applications across career lifecycle stages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <a
            href={api.getExportCsvUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>
          <span className="text-xs text-slate-400 font-mono">
            Total: {applications.length} applications
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
        {COLUMNS.map((col) => {
          const colApps = applications.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 flex flex-col min-w-[210px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-800">
                <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-mono font-bold flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              {/* Application Cards in Column */}
              <div className="space-y-2.5 flex-1 min-h-[350px]">
                {colApps.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-600">
                    No applications
                  </div>
                ) : (
                  colApps.map((app) => {
                    const days = getDaysSinceApplied(app.applied_date);
                    const isOverdue = days !== null && days >= 14 && (app.status === 'APPLIED' || app.status === 'UNDER_REVIEW');

                    return (
                      <div
                        key={app.id}
                        className={`bg-slate-950/80 border rounded-xl p-3 text-xs shadow-sm hover:border-slate-700 transition-all flex flex-col justify-between gap-2 ${
                          isOverdue ? 'border-amber-500/50 bg-amber-950/10' : 'border-slate-800'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-indigo-400 truncate flex items-center gap-1">
                              <Building className="w-3 h-3" />
                              {app.company}
                            </span>
                            {app.match_score > 0 && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {app.match_score}%
                              </span>
                            )}
                          </div>

                          <div className="font-medium text-slate-200 text-[11px] line-clamp-1 mb-2">
                            {app.role}
                          </div>

                          {/* Overdue Badge */}
                          {isOverdue && (
                            <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-1.5 rounded-lg text-[10px] flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3 text-amber-400" />
                                {days}d without response
                              </span>
                              <button
                                onClick={() => onOpenFollowup(app)}
                                className="underline font-bold hover:text-white"
                              >
                                Draft
                              </button>
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-2 bg-slate-900/60 p-1.5 rounded border border-slate-800/60 mb-2">
                              {app.notes.split('\n').pop()}
                            </p>
                          )}
                        </div>

                        {/* Status Transition Select */}
                        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-500">Stage:</span>
                          <select
                            value={app.status}
                            onChange={(e) => onStatusChange(app.id, e.target.value)}
                            className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none"
                          >
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="APPLIED">Applied</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="OFFER">Offer</option>
                            <option value="REJECTED">Rejected</option>
                          </select>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
