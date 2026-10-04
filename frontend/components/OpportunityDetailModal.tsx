'use client';

import React from 'react';
import {
  IconOpportunity,
  IconMatch,
  IconEligibility,
  IconSuccess,
  IconWarning,
} from './icons/TaskPilotIcons';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  DollarSign,
  PlusCircle,
  X,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { Opportunity } from '@/lib/api';

interface OpportunityDetailModalProps {
  opp: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  onTrack: (opp: Opportunity) => void;
  isTracked?: boolean;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opp,
  isOpen,
  onClose,
  onTrack,
  isTracked = false,
}) => {
  if (!isOpen || !opp) return null;

  const matchScore = opp.match_score || 85;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="neuro-panel rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] border border-slate-700/60 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-[#090c13] border-b border-black/80 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-slate-400" />
                {opp.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neuro-inset text-slate-300 border border-slate-800">
                {opp.remote_type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neuro-badge-pill text-slate-400 uppercase border border-slate-700/50">
                {opp.opportunity_type}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-100">{opp.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white neuro-btn-tactile rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Meta Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="neuro-inset p-3 rounded-xl text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Fit Match</div>
              <div className="text-xl font-extrabold text-slate-100 font-mono mt-0.5">
                {matchScore}%
              </div>
            </div>

            <div className="neuro-inset p-3 rounded-xl text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Location</div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                {opp.location}
              </div>
            </div>

            <div className="neuro-inset p-3 rounded-xl text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Compensation</div>
              <div className="text-xs font-semibold text-emerald-400/90 mt-1 truncate">
                {opp.stipend || 'Competitive'}
              </div>
            </div>
          </div>

          {/* Agent Recommendation Box */}
          <div className="neuro-convex rounded-xl p-4 space-y-2 border border-slate-700/60">
            <div className="text-[11px] font-mono uppercase font-bold text-slate-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-400" />
              Agent Recommendation & Fit Analysis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strong alignment with candidate background in PyTorch, distributed training, and foundational deep learning algorithms. Recommended action: <strong>Shortlist to Tracker</strong> and tailor resume bullets to emphasize project demos.
            </p>
          </div>

          {/* Why this match & Potential gaps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Match Breakdown
            </h3>
            <div className="space-y-2">
              {opp.why_match?.map((why, i) => (
                <div key={i} className="text-xs text-emerald-300 flex items-start gap-2 bg-emerald-950/30 border border-emerald-800/40 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{why}</span>
                </div>
              ))}

              {opp.potential_gaps?.map((gap, i) => (
                <div key={i} className="text-xs text-amber-300 flex items-start gap-2 bg-[#26190f] border border-amber-800/40 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Role Description
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed neuro-inset p-4 rounded-xl border border-slate-800/80">
              {opp.description}
            </p>
          </div>

          {/* Eligibility Requirement */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Eligibility Criteria
            </h3>
            <p className="text-xs text-slate-400 neuro-inset p-3 rounded-xl border border-slate-800/80">
              {opp.eligibility}
            </p>
          </div>

          {/* Skills Required */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {opp.skills_required.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-lg neuro-inset text-slate-300 border border-slate-800 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#090c13] border-t border-black/80 flex items-center justify-between">
          <a
            href={opp.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white"
          >
            <span>External Application Link</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onTrack(opp);
                onClose();
              }}
              disabled={isTracked}
              className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition-all ${
                isTracked
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 cursor-default'
                  : 'neuro-btn-tactile text-slate-100 shadow-md active:scale-95'
              }`}
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isTracked ? 'Tracked in Pipeline' : 'Shortlist & Track'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
