'use client';

import React, { useState } from 'react';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  PlusCircle,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  DollarSign,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Opportunity } from '@/lib/api';

interface OpportunityCardProps {
  opp: Opportunity;
  onTrack: (opp: Opportunity) => void;
  onSelectDetail?: (opp: Opportunity) => void;
  isTracked?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opp,
  onTrack,
  onSelectDetail,
  isTracked,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [justTracked, setJustTracked] = useState(false);

  const matchScore = opp.match_score || 75;
  const isHighMatch = matchScore >= 85;

  const handleTrackClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isTracked) {
      onTrack(opp);
      setJustTracked(true);
      setTimeout(() => setJustTracked(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelectDetail && onSelectDetail(opp)}
      className="neuro-panel rounded-2xl p-5 shadow-lg transition-all duration-200 flex flex-col justify-between group cursor-pointer border border-slate-700/50 hover:border-slate-500/80 hover:-translate-y-0.5"
    >
      <div>
        {/* Top Header: Company, Role & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                {opp.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neuro-inset text-slate-300 border border-slate-800">
                {opp.remote_type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full neuro-badge-pill text-slate-400 uppercase border border-slate-700/50">
                {opp.opportunity_type}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors leading-snug">
              {opp.title}
            </h3>
          </div>

          {/* Match Score Badge (3D Neuromorphic) */}
          <div
            className={`shrink-0 flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border ${
              isHighMatch
                ? 'bg-emerald-950/40 border-emerald-700/50 text-emerald-300 shadow-sm'
                : 'neuro-inset border-slate-700/60 text-slate-300'
            }`}
          >
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-70">Fit</span>
            <span className="text-sm font-black font-mono">{matchScore}%</span>
          </div>
        </div>

        {/* Location & Stipend & Deadline Meta */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-3 text-xs text-slate-400 mb-3 font-medium">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-500" />
            {opp.location}
          </span>
          {opp.stipend && (
            <span className="flex items-center gap-1 text-emerald-400/90 font-mono">
              <DollarSign className="w-3 h-3 text-emerald-500" />
              {opp.stipend}
            </span>
          )}
          {opp.deadline && (
            <span className="flex items-center gap-1 text-slate-400 font-mono">
              <Calendar className="w-3 h-3 text-slate-500" />
              {new Date(opp.deadline).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Description snippet */}
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
          {opp.description}
        </p>

        {/* Skills Tags */}
        <div className="flex flex-wrap gap-1.5 mb-3.5">
          {opp.skills_required.slice(0, 5).map((skill, i) => (
            <span
              key={i}
              className="text-[10px] neuro-inset text-slate-300 px-2 py-0.5 rounded-md border border-slate-800 transition-colors"
            >
              {skill}
            </span>
          ))}
          {opp.skills_required.length > 5 && (
            <span className="text-[10px] text-slate-500 py-0.5">
              +{opp.skills_required.length - 5} more
            </span>
          )}
        </div>

        {/* Explainability Breakdown: "WHY THIS MATCH?" */}
        {opp.why_match && opp.why_match.length > 0 && (
          <div className="neuro-inset rounded-xl p-3 mb-3 text-xs space-y-1.5 border border-slate-800/80">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-between cursor-pointer text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              <div className="flex items-center gap-1.5 text-slate-300">
                <Sparkles className="w-3 h-3 text-slate-400" />
                <span>Explainable Fit Criteria</span>
              </div>
              <span className="text-slate-500 flex items-center gap-0.5 text-[9px]">
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </span>
            </div>

            {/* Always show top match reason */}
            <div className="text-emerald-400/90 text-[11px] flex items-start gap-1.5 leading-snug">
              <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
              <span>{opp.why_match[0]}</span>
            </div>

            {/* Expanded items */}
            {isExpanded && (
              <div className="space-y-1.5 pt-1.5 border-t border-slate-800/80">
                {opp.why_match.slice(1).map((why, i) => (
                  <div key={i} className="text-emerald-400/90 text-[11px] flex items-start gap-1.5 leading-snug">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{why}</span>
                  </div>
                ))}
                {opp.potential_gaps && opp.potential_gaps.length > 0 && (
                  <div className="text-amber-400/80 text-[11px] flex items-start gap-1.5 leading-snug pt-1">
                    <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                    <span>{opp.potential_gaps[0]}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-black/60 flex items-center justify-between gap-2">
        <a
          href={opp.application_url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>Portal</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <div className="flex items-center gap-2">
          <button
            onClick={handleTrackClick}
            disabled={isTracked}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all ${
              isTracked || justTracked
                ? 'bg-emerald-950/60 text-emerald-300 cursor-default border border-emerald-700/50'
                : 'neuro-btn-tactile text-slate-100 font-bold active:scale-95'
            }`}
          >
            {isTracked || justTracked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tracked</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5 text-slate-400" />
                <span>Track</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
