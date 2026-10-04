'use client';

import React, { useState } from 'react';
import {
  IconApplication,
  IconTimeline,
  IconFollowup,
  IconVerification,
} from './icons/TaskPilotIcons';
import {
  Building,
  Calendar,
  Clock,
  ExternalLink,
  Save,
  X,
  CheckCircle2,
  FileText,
  Trash2,
  Link2,
} from 'lucide-react';
import { Application } from '@/lib/api';

interface ApplicationDetailModalProps {
  app: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApp: (id: number, data: Partial<Application>) => Promise<void>;
  onDeleteApp?: (id: number) => Promise<void>;
  onTriggerFollowup: (app: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  onUpdateApp,
  onDeleteApp,
  onTriggerFollowup,
}) => {
  const [status, setStatus] = useState(app?.status || 'SHORTLISTED');
  const [notes, setNotes] = useState(app?.notes || '');
  const [appUrl, setAppUrl] = useState(app?.application_url || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  React.useEffect(() => {
    if (app) {
      setStatus(app.status);
      setNotes(app.notes || '');
      setAppUrl(app.application_url || '');
      setConfirmDelete(false);
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateApp(app.id, { status, notes, application_url: appUrl });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDeleteApp) return;
    setIsDeleting(true);
    try {
      await onDeleteApp(app.id);
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="neuro-panel rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#090c13] border-b border-black/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-slate-400" />
                {app.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neuro-inset text-slate-300 border border-slate-800">
                {app.status}
              </span>
              {app.match_score > 0 && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                  {app.match_score}% Fit
                </span>
              )}
            </div>
            <h2 className="text-base font-bold text-slate-100">{app.role}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white neuro-btn-tactile rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Timing Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Lifecycle Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full neuro-inset rounded-xl p-2.5 text-xs text-slate-200 outline-none font-semibold focus:border-slate-500"
              >
                <option value="SHORTLISTED">SHORTLISTED</option>
                <option value="PREPARING">PREPARING</option>
                <option value="APPLIED">APPLIED</option>
                <option value="UNDER_REVIEW">UNDER REVIEW</option>
                <option value="INTERVIEW">INTERVIEW</option>
                <option value="OFFER">OFFER</option>
                <option value="REJECTED">REJECTED</option>
                <option value="CLOSED">CLOSED</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Submission Date
              </label>
              <div className="mt-1.5 neuro-inset rounded-xl p-2.5 text-xs text-slate-300 font-mono flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'Not Yet Submitted'}
                </span>
              </div>
            </div>
          </div>

          {/* Portal / Job URL */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Application Portal URL</span>
              {appUrl && (
                <a
                  href={appUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] text-slate-400 hover:text-slate-100 flex items-center gap-1"
                >
                  <span>Open Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <div className="relative flex-1">
                <Link2 className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  value={appUrl}
                  onChange={(e) => setAppUrl(e.target.value)}
                  placeholder="https://jobs.company.com/apply/..."
                  className="w-full neuro-inset rounded-xl pl-9 pr-3 py-2 text-xs text-slate-200 placeholder-slate-600 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Notes Area */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 font-semibold flex items-center justify-between">
              <span>Candidate & Agent Notes</span>
              <span className="text-[10px] text-slate-500 font-normal">Auto-timestamped</span>
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add interview feedback, referral contacts, or tailoring notes..."
              className="mt-1.5 w-full neuro-inset rounded-xl p-3 text-xs text-slate-200 outline-none font-sans leading-relaxed placeholder-slate-600"
            />
          </div>

          {/* Application Event Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <IconTimeline className="w-4 h-4 text-slate-400" />
              Application History Timeline
            </h3>

            <div className="neuro-inset rounded-xl p-4 space-y-3">
              {app.events && app.events.length > 0 ? (
                app.events.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-3 text-xs relative pl-2">
                    <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0 shadow-[0_0_4px_rgba(255,255,255,0.4)]" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-slate-200">{evt.description}</span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {new Date(evt.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 uppercase">
                        {evt.event_type}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-xs text-slate-500 italic">
                  Initial discovery event recorded.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#090c13] border-t border-black/80 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            {onDeleteApp && (
              confirmDelete ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="px-3 py-1.5 text-xs font-bold text-rose-300 bg-rose-950/60 border border-rose-800/60 rounded-xl hover:bg-rose-900/80 transition-all"
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-2 py-1.5 text-xs text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-rose-300 neuro-btn-tactile rounded-xl transition-all"
                  title="Remove application from pipeline"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              )
            )}

            <button
              onClick={() => {
                onTriggerFollowup(app);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-amber-200 bg-[#2b1c0e] hover:bg-[#382412] border border-amber-700/50 rounded-xl transition-all"
            >
              <IconFollowup className="w-3.5 h-3.5 text-amber-300" />
              <span>Draft Follow-Up</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-100 neuro-btn-tactile rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
