'use client';

import React, { useState } from 'react';
import {
  Building,
  Calendar,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Download,
  Plus,
  Search,
  Filter,
  ArrowRight,
  X,
  Trash2,
} from 'lucide-react';
import { Application, api } from '@/lib/api';

interface KanbanPipelineProps {
  applications: Application[];
  onStatusChange: (id: number, newStatus: string) => void;
  onOpenFollowup: (app: Application) => void;
  onSelectApp: (app: Application) => void;
  onCreateApp?: (data: Partial<Application>) => Promise<void>;
  onDeleteApp?: (id: number) => Promise<void>;
}

const STAGE_ORDER = ['SHORTLISTED', 'PREPARING', 'APPLIED', 'UNDER_REVIEW', 'INTERVIEW', 'OFFER', 'REJECTED'];

const COLUMNS = [
  { id: 'SHORTLISTED', label: 'Shortlisted' },
  { id: 'PREPARING', label: 'Preparing' },
  { id: 'APPLIED', label: 'Applied' },
  { id: 'UNDER_REVIEW', label: 'Under Review' },
  { id: 'INTERVIEW', label: 'Interview' },
  { id: 'OFFER', label: 'Offer' },
  { id: 'REJECTED', label: 'Rejected' },
];

export const KanbanPipeline: React.FC<KanbanPipelineProps> = ({
  applications,
  onStatusChange,
  onOpenFollowup,
  onSelectApp,
  onCreateApp,
  onDeleteApp,
}) => {
  const [searchFilter, setSearchFilter] = useState('');
  const [showRejected, setShowRejected] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newRole, setNewRole] = useState('');
  const [newStatus, setNewStatus] = useState('SHORTLISTED');
  const [newUrl, setNewUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDaysSinceApplied = (appliedDate?: string) => {
    if (!appliedDate) return null;
    const diff = Math.floor(
      (new Date().getTime() - new Date(appliedDate).getTime()) / (1000 * 3600 * 24)
    );
    return diff;
  };

  const getNextStage = (currentStage: string) => {
    const idx = STAGE_ORDER.indexOf(currentStage);
    if (idx !== -1 && idx < STAGE_ORDER.length - 2) {
      return STAGE_ORDER[idx + 1];
    }
    return null;
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.trim() || !newRole.trim()) return;
    setIsSubmitting(true);
    try {
      if (onCreateApp) {
        await onCreateApp({
          company: newCompany.trim(),
          role: newRole.trim(),
          status: newStatus,
          application_url: newUrl.trim() || undefined,
          match_score: 85,
          applied_date: newStatus === 'APPLIED' ? new Date().toISOString() : undefined,
        });
      }
      setNewCompany('');
      setNewRole('');
      setNewUrl('');
      setNewStatus('SHORTLISTED');
      setIsAddModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const matchesSearch =
      searchFilter === '' ||
      app.company.toLowerCase().includes(searchFilter.toLowerCase()) ||
      app.role.toLowerCase().includes(searchFilter.toLowerCase());
    return matchesSearch;
  });

  const displayColumns = showRejected
    ? COLUMNS
    : COLUMNS.filter((c) => c.id !== 'REJECTED');

  return (
    <div className="space-y-4">
      {/* Top Operations Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
            Application Pipeline
          </h2>
          <p className="text-xs text-slate-400">
            Track and transition opportunity lifecycles across recruitment milestones
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Filter company or role..."
              className="neuro-inset rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 outline-none w-44 focus:w-56 transition-all"
            />
            {searchFilter && (
              <button
                onClick={() => setSearchFilter('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Toggle Rejected Column */}
          <button
            onClick={() => setShowRejected(!showRejected)}
            className={`px-3 py-1.5 text-xs rounded-xl transition-all neuro-btn-tactile text-slate-300 ${
              showRejected ? 'border-slate-600' : 'opacity-60'
            }`}
          >
            {showRejected ? 'Hide Rejected' : 'Show Rejected'}
          </button>

          {/* Export CSV */}
          <a
            href={api.getExportCsvUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white neuro-btn-tactile rounded-xl transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </a>

          {/* Add Application Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold text-slate-100 neuro-btn-tactile rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Track New</span>
          </button>
        </div>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-3 overflow-x-auto pb-4">
        {displayColumns.map((col) => {
          const colApps = filteredApps.filter((a) => a.status === col.id);

          return (
            <div
              key={col.id}
              className="neuro-panel rounded-2xl p-3 flex flex-col min-w-[200px]"
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-black/60">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="w-5 h-5 rounded-full neuro-inset text-slate-300 text-[10px] font-mono font-bold flex items-center justify-center">
                  {colApps.length}
                </span>
              </div>

              {/* Application Cards in Column */}
              <div className="space-y-2.5 flex-1 min-h-[350px]">
                {colApps.length === 0 ? (
                  <div className="h-28 border border-dashed border-slate-800 rounded-xl flex items-center justify-center text-[11px] text-slate-600 select-none">
                    Empty Stage
                  </div>
                ) : (
                  colApps.map((app) => {
                    const days = getDaysSinceApplied(app.applied_date);
                    const isOverdue =
                      days !== null &&
                      days >= 14 &&
                      (app.status === 'APPLIED' || app.status === 'UNDER_REVIEW');
                    const nextStage = getNextStage(app.status);

                    return (
                      <div
                        key={app.id}
                        onClick={() => onSelectApp(app)}
                        className={`neuro-convex rounded-xl p-3 text-xs shadow-md transition-all flex flex-col justify-between gap-2 cursor-pointer group hover:-translate-y-0.5 ${
                          isOverdue
                            ? 'border border-amber-700/50 bg-[#17130d]'
                            : 'hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-slate-200 group-hover:text-white truncate flex items-center gap-1">
                              <Building className="w-3 h-3 text-slate-400" />
                              {app.company}
                            </span>
                            {app.match_score > 0 && (
                              <span className="text-[10px] font-mono text-emerald-400 font-bold">
                                {app.match_score}%
                              </span>
                            )}
                          </div>

                          <div className="font-medium text-slate-300 text-[11px] line-clamp-1 mb-2">
                            {app.role}
                          </div>

                          {/* Overdue Badge */}
                          {isOverdue && (
                            <div className="bg-[#24170a] border border-amber-700/50 text-amber-300 p-1.5 rounded-lg text-[10px] flex items-center justify-between mb-2">
                              <span className="flex items-center gap-1 font-semibold">
                                <Clock className="w-3 h-3 text-amber-400" />
                                {days}d silence
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onOpenFollowup(app);
                                }}
                                className="underline font-bold hover:text-white"
                              >
                                Draft
                              </button>
                            </div>
                          )}

                          {app.notes && (
                            <p className="text-[10px] text-slate-400 italic line-clamp-2 neuro-inset p-1.5 rounded border border-slate-800/80 mb-2">
                              {app.notes.split('\n').pop()}
                            </p>
                          )}
                        </div>

                        {/* Status Transition Select & Quick Advance */}
                        <div
                          onClick={(e) => e.stopPropagation()}
                          className="pt-2 border-t border-black/60 flex items-center justify-between gap-1.5 text-[10px]"
                        >
                          <select
                            value={app.status}
                            onChange={(e) => onStatusChange(app.id, e.target.value)}
                            className="neuro-inset rounded px-1.5 py-0.5 text-[10px] text-slate-300 outline-none max-w-[105px]"
                          >
                            <option value="SHORTLISTED">Shortlisted</option>
                            <option value="PREPARING">Preparing</option>
                            <option value="APPLIED">Applied</option>
                            <option value="UNDER_REVIEW">Under Review</option>
                            <option value="INTERVIEW">Interview</option>
                            <option value="OFFER">Offer</option>
                            <option value="REJECTED">Rejected</option>
                          </select>

                          {nextStage && (
                            <button
                              onClick={() => onStatusChange(app.id, nextStage)}
                              title={`Advance to ${nextStage}`}
                              className="p-1 neuro-btn-tactile rounded text-slate-400 hover:text-white"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
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

      {/* Modal: Add New Application */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="neuro-panel rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-700/60 p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-black/80 pb-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-slate-400" />
                Track New Application
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white neuro-btn-tactile rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  placeholder="e.g. Anthropic, Google, Tesla"
                  className="w-full neuro-inset rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-600"
                />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                  Role Title *
                </label>
                <input
                  type="text"
                  required
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  placeholder="e.g. AI Research Intern, Software Engineer"
                  className="w-full neuro-inset rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                    Initial Stage
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full neuro-inset rounded-xl px-3 py-2 text-xs text-slate-200 outline-none"
                  >
                    <option value="SHORTLISTED">Shortlisted</option>
                    <option value="PREPARING">Preparing</option>
                    <option value="APPLIED">Applied</option>
                    <option value="UNDER_REVIEW">Under Review</option>
                    <option value="INTERVIEW">Interview</option>
                    <option value="OFFER">Offer</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase text-slate-400 font-semibold block mb-1">
                    Job Portal URL
                  </label>
                  <input
                    type="url"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full neuro-inset rounded-xl px-3 py-2 text-xs text-slate-200 outline-none placeholder-slate-600"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-black/80">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-slate-100 neuro-btn-tactile rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSubmitting ? 'Adding...' : 'Add to Pipeline'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
