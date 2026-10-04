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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 bg-slate-950/80 border-b border-slate-800 flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <Building2 className="w-4 h-4" />
                {opp.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {opp.remote_type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 uppercase">
                {opp.opportunity_type}
              </span>
            </div>
            <h2 className="text-base font-bold text-white">{opp.title}</h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Key Meta Badges */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Fit Match</div>
              <div className="text-xl font-extrabold text-cyan-400 font-mono mt-0.5">
                {matchScore}%
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Location</div>
              <div className="text-xs font-semibold text-slate-200 mt-1 truncate">
                {opp.location}
              </div>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-center">
              <div className="text-[10px] font-mono uppercase text-slate-500">Compensation</div>
              <div className="text-xs font-semibold text-emerald-400 mt-1 truncate">
                {opp.stipend || 'Competitive'}
              </div>
            </div>
          </div>

          {/* Agent Recommendation Box */}
          <div className="bg-gradient-to-r from-cyan-950/30 to-indigo-950/20 border border-cyan-500/30 rounded-xl p-4 space-y-2">
            <div className="text-[11px] font-mono uppercase font-bold text-cyan-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Agent Recommendation & Fit Analysis
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Strong alignment with candidate background in PyTorch, distributed training, and foundational deep learning algorithms. Recommended action: <strong>Shortlist to Tracker</strong> and tailor resume bullets to emphasize project demos.
            </p>
          </div>

          {/* Why this match & Potential gaps */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Match Breakdown
            </h3>
            <div className="space-y-2">
              {opp.why_match?.map((why, i) => (
                <div key={i} className="text-xs text-emerald-300 flex items-start gap-2 bg-emerald-950/20 border border-emerald-800/30 p-2.5 rounded-lg">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{why}</span>
                </div>
              ))}

              {opp.potential_gaps?.map((gap, i) => (
                <div key={i} className="text-xs text-amber-300 flex items-start gap-2 bg-amber-950/20 border border-amber-800/30 p-2.5 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{gap}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Description & Requirements */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Role Description
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              {opp.description}
            </p>
          </div>

          {/* Eligibility Requirement */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Eligibility Criteria
            </h3>
            <p className="text-xs text-slate-400 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {opp.eligibility}
            </p>
          </div>

          {/* Skills Required */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {opp.skills_required.map((skill, i) => (
                <span
                  key={i}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-950 text-slate-300 border border-slate-800 font-mono"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
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
                  ? 'bg-slate-800 text-emerald-400'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-md shadow-cyan-500/20'
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
