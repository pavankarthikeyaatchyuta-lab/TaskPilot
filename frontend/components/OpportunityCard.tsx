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
  FileCheck,
  Send,
  Zap,
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
      className="bg-slate-900/80 hover:bg-slate-900/95 border border-slate-800 hover:border-cyan-500/40 rounded-2xl p-5 shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden backdrop-blur-md hover:shadow-cyan-500/10 hover:shadow-xl hover:-translate-y-0.5"
    >
      {/* Top subtle hover accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

      <div>
        {/* Top Header: Company, Role & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-xs font-semibold text-cyan-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {opp.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-950 text-slate-300 border border-slate-800">
                {opp.remote_type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950/40 text-cyan-300 uppercase border border-cyan-500/20">
                {opp.opportunity_type}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-cyan-200 transition-colors leading-snug">
              {opp.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 flex flex-col items-center justify-center px-3 py-1.5 rounded-xl border ${
              isHighMatch
                ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/10'
                : 'bg-cyan-950/40 border-cyan-500/40 text-cyan-300'
            }`}
          >
            <span className="text-[9px] uppercase font-bold tracking-wider opacity-80">Match</span>
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
            <span className="flex items-center gap-1 text-emerald-400 font-mono">
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
              className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800/80 group-hover:border-slate-700 transition-colors"
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
          <div className="bg-slate-950/80 border border-slate-800/90 rounded-xl p-3 mb-3 text-xs space-y-1.5">
            <div
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="flex items-center justify-between cursor-pointer text-[10px] font-bold text-slate-400 uppercase tracking-wider"
            >
              <div className="flex items-center gap-1.5 text-cyan-300">
                <Sparkles className="w-3 h-3 text-cyan-400" />
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
              <div className="space-y-1.5 pt-1 border-t border-slate-800/80">
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
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
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
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isTracked || justTracked
                ? 'bg-emerald-950/60 text-emerald-300 cursor-default border border-emerald-500/30'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20 active:scale-95'
            }`}
          >
            {isTracked || justTracked ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Tracked</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Track</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
