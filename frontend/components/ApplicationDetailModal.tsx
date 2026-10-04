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
} from 'lucide-react';
import { Application } from '@/lib/api';

interface ApplicationDetailModalProps {
  app: Application | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateApp: (id: number, data: Partial<Application>) => Promise<void>;
  onTriggerFollowup: (app: Application) => void;
}

export const ApplicationDetailModal: React.FC<ApplicationDetailModalProps> = ({
  app,
  isOpen,
  onClose,
  onUpdateApp,
  onTriggerFollowup,
}) => {
  const [status, setStatus] = useState(app?.status || 'SHORTLISTED');
  const [notes, setNotes] = useState(app?.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  React.useEffect(() => {
    if (app) {
      setStatus(app.status);
      setNotes(app.notes || '');
    }
  }, [app]);

  if (!isOpen || !app) return null;

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onUpdateApp(app.id, { status, notes });
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Building className="w-4 h-4" />
                {app.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                {app.status}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{app.role}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Status & Timing Controls */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 font-semibold">
                Lifecycle Stage
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="mt-1.5 w-full bg-slate-950 border border-slate-750 focus:border-cyan-500 rounded-xl p-2.5 text-xs text-white outline-none font-semibold"
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
                Applied Date
              </label>
              <div className="mt-1.5 bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-300 font-mono flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>
                  {app.applied_date ? new Date(app.applied_date).toLocaleDateString() : 'Not Yet Submitted'}
                </span>
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
              className="mt-1.5 w-full bg-slate-950 border border-slate-750 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none font-sans leading-relaxed"
            />
          </div>

          {/* Application Event Timeline */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <IconTimeline className="w-4 h-4 text-cyan-400" />
              Application History Timeline
            </h3>

            <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-4 space-y-3">
              {app.events && app.events.length > 0 ? (
                app.events.map((evt) => (
                  <div key={evt.id} className="flex items-start gap-3 text-xs relative pl-2">
                    <div className="w-2 h-2 rounded-full bg-cyan-400 mt-1.5 shrink-0 shadow-[0_0_6px_#06b6d4]" />
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
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={() => {
              onTriggerFollowup(app);
              onClose();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-xl transition-all"
          >
            <IconFollowup className="w-3.5 h-3.5" />
            <span>Generate Follow-Up</span>
          </button>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-md transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
