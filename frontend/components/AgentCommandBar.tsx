'use client';

import React, { useState } from 'react';
import { Send, Sparkles, ArrowRight, CornerDownLeft, Loader2 } from 'lucide-react';

interface AgentCommandBarProps {
  onSubmitGoal: (goal: string) => void;
  isLoading: boolean;
}

export const AgentCommandBar: React.FC<AgentCommandBarProps> = ({ onSubmitGoal, isLoading }) => {
  const [goal, setGoal] = useState('');

  const quickPrompts = [
    'Find the best AI/ML internships for me and check which applications need follow-up.',
    'Shortlist opportunities with >85% match and add to tracker.',
    'Prepare follow-up emails for all applications older than 14 days.',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim() || isLoading) return;
    onSubmitGoal(goal.trim());
    setGoal('');
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input
          type="text"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
          placeholder="Instruct TaskPilot Agent (e.g., 'Find AI/ML internships suitable for me, shortlist the best, and prepare follow-ups')..."
          disabled={isLoading}
          className="w-full bg-slate-950/70 border border-slate-750 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3.5 pr-28 text-sm text-slate-100 placeholder-slate-500 transition-all outline-none"
        />

        <div className="absolute right-2 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={!goal.trim() || isLoading}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 rounded-lg transition-all"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Working...</span>
              </>
            ) : (
              <>
                <span>Orchestrate</span>
                <CornerDownLeft className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Suggested Command Pills */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium text-slate-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-indigo-400" /> Presets:
        </span>
        {quickPrompts.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSubmitGoal(p)}
            disabled={isLoading}
            className="text-[11px] bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 py-1 rounded-md border border-slate-700/60 transition-colors text-left"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
};
