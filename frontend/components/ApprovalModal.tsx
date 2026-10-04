'use client';

import React, { useState } from 'react';
import {
  ShieldAlert,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  Edit3,
  Send,
  Building,
  Briefcase,
  Calendar,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { ApprovalRequest } from '@/lib/api';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  approvals: ApprovalRequest[];
  onApprove: (id: string, feedback?: string, editedPayload?: any) => Promise<void>;
  onReject: (id: string, feedback?: string) => Promise<void>;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({
  isOpen,
  onClose,
  approvals,
  onApprove,
  onReject,
}) => {
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(
    approvals[0] || null
  );
  const [editedSubject, setEditedSubject] = useState('');
  const [editedBody, setEditedBody] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  React.useEffect(() => {
    if (
      approvals.length > 0 &&
      (!selectedApproval || !approvals.some((a) => a.id === selectedApproval.id))
    ) {
      const first = approvals[0];
      setSelectedApproval(first);
      setEditedSubject(first.payload?.subject || '');
      setEditedBody(first.payload?.body || '');
    }
  }, [approvals, selectedApproval]);

  if (!isOpen) return null;

  const current = selectedApproval || approvals[0];

  const handleSelect = (appr: ApprovalRequest) => {
    setSelectedApproval(appr);
    setEditedSubject(appr.payload?.subject || '');
    setEditedBody(appr.payload?.body || '');
    setIsEditing(false);
  };

  const handleCopyDraft = () => {
    const text = `Subject: ${editedSubject || current?.payload?.subject}\n\n${
      editedBody || current?.payload?.body
    }`;
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleResetToOriginal = () => {
    if (current) {
      setEditedSubject(current.payload?.subject || '');
      setEditedBody(current.payload?.body || '');
      setIsEditing(false);
    }
  };

  const handleApproveCurrent = async () => {
    if (!current) return;
    setIsProcessing(true);
    try {
      const payloadUpdate = isEditing
        ? {
            ...current.payload,
            subject: editedSubject,
            body: editedBody,
          }
        : undefined;

      await onApprove(
        current.id,
        'Authorized by operator via Human Approval Gate',
        payloadUpdate
      );
      setIsEditing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCurrent = async () => {
    if (!current) return;
    setIsProcessing(true);
    try {
      await onReject(current.id, 'Action cancelled by operator');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                Human-in-the-Loop Approval Gate
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded-full font-bold border border-amber-500/30">
                  {approvals.length} Pending
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Autonomous agent halted at consequential boundary. Review, edit, and authorize execution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors font-mono"
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Approval list sidebar */}
          <div className="space-y-2 border-r border-slate-800/80 pr-4">
            <div className="text-[11px] font-mono uppercase text-slate-500 font-bold tracking-wider mb-2">
              Action Queue
            </div>
            {approvals.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3">
                No pending actions. Gate clear!
              </div>
            ) : (
              approvals.map((appr) => {
                const isSelected = current?.id === appr.id;
                return (
                  <button
                    key={appr.id}
                    onClick={() => handleSelect(appr)}
                    className={`w-full text-left p-3 rounded-2xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/60 text-white shadow-md shadow-cyan-500/10'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold truncate">{appr.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1 font-mono">
                      <Building className="w-3 h-3 text-cyan-400" />
                      <span className="truncate">{appr.payload?.company}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Detailed Review & Draft Editor */}
          <div className="md:col-span-2 flex flex-col space-y-4">
            {current ? (
              <>
                <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/15 text-amber-300 border border-amber-500/30 rounded font-semibold">
                        CONSEQUENTIAL ACTION • {current.action_type}
                      </span>
                      <h3 className="text-sm font-bold text-white mt-1.5">
                        {current.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyDraft}
                        className="flex items-center gap-1 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 transition-colors"
                        title="Copy draft to clipboard"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-mono text-[11px]">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-400" />
                            <span className="font-mono text-[11px]">Copy</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl border transition-all ${
                          isEditing
                            ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                            : 'bg-cyan-950/40 text-cyan-300 border-cyan-500/30 hover:bg-cyan-900/50'
                        }`}
                      >
                        <Edit3 className="w-3 h-3" />
                        <span>{isEditing ? 'Preview' : 'Edit Draft'}</span>
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                      <span>Role: <strong>{current.payload?.role}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      <span>Applied: <strong>{current.payload?.applied_date || '18 days ago'}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Email Draft Card */}
                <div className="flex-1 bg-slate-950/90 rounded-2xl border border-slate-800 p-4 flex flex-col space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-cyan-300 font-mono">
                      <Mail className="w-3.5 h-3.5 text-cyan-400" /> Tailored Follow-Up Message
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Tone: {current.payload?.tone || 'Professional & Courteous'}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-3 animate-in fade-in duration-150">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold font-mono">Subject Line</label>
                        <input
                          type="text"
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white outline-none focus:border-cyan-500 transition-colors font-medium"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-[10px] text-slate-500 uppercase font-semibold font-mono">Message Body</label>
                          <button
                            type="button"
                            onClick={handleResetToOriginal}
                            className="text-[10px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>Reset to AI Draft</span>
                          </button>
                        </div>
                        <textarea
                          rows={7}
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white font-sans leading-relaxed outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-slate-200">
                        <span className="text-slate-500 font-semibold font-mono">Subject: </span>
                        {editedSubject || current.payload?.subject}
                      </div>
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans max-h-56 overflow-y-auto">
                        {editedBody || current.payload?.body}
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No active authorization request selected.
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 hidden sm:flex font-mono">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Post-action verification will record to SQLite audit log.</span>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handleRejectCurrent}
              disabled={isProcessing || !current}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all disabled:opacity-40"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Cancel Action</span>
            </button>

            <button
              onClick={handleApproveCurrent}
              disabled={isProcessing || !current}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-extrabold text-slate-950 bg-gradient-to-r from-emerald-400 to-teal-300 hover:opacity-90 rounded-xl shadow-lg shadow-emerald-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Verifying & Executing...' : 'Authorize & Execute'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
