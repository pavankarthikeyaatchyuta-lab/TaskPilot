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

  React.useEffect(() => {
    if (approvals.length > 0 && (!selectedApproval || !approvals.some((a) => a.id === selectedApproval.id))) {
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

      await onApprove(current.id, 'Approved by user via Human Approval Gate', payloadUpdate);
      setIsEditing(false);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectCurrent = async () => {
    if (!current) return;
    setIsProcessing(true);
    try {
      await onReject(current.id, 'Rejected by user');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white uppercase tracking-wider flex items-center gap-2">
                Human-in-the-Loop Approval Gate
                <span className="px-2 py-0.5 text-[10px] bg-amber-500/20 text-amber-300 rounded-full font-bold">
                  {approvals.length} Actions Awaiting Review
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Consequential actions require human authorization before execution.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-xs px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Approval list sidebar */}
          <div className="space-y-2 border-r border-slate-800/80 pr-4">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Pending Authorization
            </div>
            {approvals.length === 0 ? (
              <div className="text-xs text-slate-500 italic p-3">
                No pending approval requests. All clear!
              </div>
            ) : (
              approvals.map((appr) => {
                const isSelected = current?.id === appr.id;
                return (
                  <button
                    key={appr.id}
                    onClick={() => handleSelect(appr)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all ${
                      isSelected
                        ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-sm'
                        : 'bg-slate-950/40 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-semibold truncate">{appr.title}</div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-1">
                      <Building className="w-3 h-3" />
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
                <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded font-semibold">
                        {current.action_type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-100 mt-1">
                        {current.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20"
                    >
                      <Edit3 className="w-3 h-3" />
                      <span>{isEditing ? 'Preview Draft' : 'Edit Email Draft'}</span>
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {current.description}
                  </p>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800/60">
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
                <div className="flex-1 bg-slate-950/90 rounded-xl border border-slate-800 p-4 flex flex-col space-y-3">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-indigo-400" /> Generated Follow-Up Message
                    </span>
                    <span className="text-[10px] font-mono text-emerald-400">
                      Tone: {current.payload?.tone || 'Professional & Courteous'}
                    </span>
                  </div>

                  {isEditing ? (
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold">Subject</label>
                        <input
                          type="text"
                          value={editedSubject}
                          onChange={(e) => setEditedSubject(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500 uppercase font-semibold">Message Body</label>
                        <textarea
                          rows={6}
                          value={editedBody}
                          onChange={(e) => setEditedBody(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white font-sans leading-relaxed outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="text-xs text-slate-200">
                        <span className="text-slate-500 font-semibold">Subject: </span>
                        {editedSubject || current.payload?.subject}
                      </div>
                      <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800/80 text-xs text-slate-300 whitespace-pre-line leading-relaxed font-sans">
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
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Approved actions will be verified and logged in the audit trail.</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRejectCurrent}
              disabled={isProcessing || !current}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-xl transition-all disabled:opacity-40"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>Reject Action</span>
            </button>

            <button
              onClick={handleApproveCurrent}
              disabled={isProcessing || !current}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all disabled:opacity-40"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              <span>{isProcessing ? 'Verifying & Executing...' : 'Authorize & Send'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
