'use client';

import React from 'react';
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
} from 'lucide-react';
import { Opportunity } from '@/lib/api';

interface OpportunityCardProps {
  opp: Opportunity;
  onTrack: (opp: Opportunity) => void;
  isTracked?: boolean;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opp, onTrack, isTracked }) => {
  const matchScore = opp.match_score || 75;
  const isHighMatch = matchScore >= 85;

  return (
    <div className="bg-slate-900/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 shadow-lg transition-all flex flex-col justify-between group">
      <div>
        {/* Top Header: Company, Role & Match Score */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                {opp.company}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
                {opp.remote_type}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800/80 text-slate-400 uppercase">
                {opp.opportunity_type}
              </span>
            </div>
            <h3 className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors leading-snug">
              {opp.title}
            </h3>
          </div>

          {/* Match Score Badge */}
          <div
            className={`shrink-0 flex flex-col items-center justify-center px-2.5 py-1.5 rounded-xl border ${
              isHighMatch
                ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-400'
                : 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300'
            }`}
          >
            <span className="text-[10px] uppercase font-bold tracking-wider">Match</span>
            <span className="text-sm font-extrabold font-mono">{matchScore}%</span>
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
              className="text-[10px] bg-slate-950 text-slate-300 px-2 py-0.5 rounded-md border border-slate-800"
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
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 mb-3 text-xs space-y-1.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-indigo-400" /> Why this match:
            </div>
            {opp.why_match.map((why, i) => (
              <div key={i} className="text-emerald-400/90 text-[11px] flex items-start gap-1.5 leading-snug">
                <CheckCircle2 className="w-3 h-3 text-emerald-400 mt-0.5 shrink-0" />
                <span>{why}</span>
              </div>
            ))}

            {opp.potential_gaps && opp.potential_gaps.length > 0 && (
              <div className="text-amber-400/80 text-[11px] flex items-start gap-1.5 leading-snug pt-1 border-t border-slate-800/60 mt-1">
                <AlertCircle className="w-3 h-3 text-amber-400 mt-0.5 shrink-0" />
                <span>{opp.potential_gaps[0]}</span>
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
          className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
        >
          <span>View Source</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        <button
          onClick={() => onTrack(opp)}
          disabled={isTracked}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
            isTracked
              ? 'bg-slate-800 text-emerald-400 cursor-default border border-emerald-500/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
          }`}
        >
          {isTracked ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tracked</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Add to Tracker</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
