'use client';

import React, { useState, useEffect } from 'react';
import {
  IconSearch,
  IconAgent,
  IconOpportunity,
  IconFollowup,
  IconApproval,
  IconProfile,
  IconResume,
} from './icons/TaskPilotIcons';
import { Sparkles, X, ArrowRight, CornerDownLeft, RotateCcw, Download } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onRunGoal: (goal: string) => void;
  onRunDemo: () => void;
  onResetDemo: () => void;
  onSelectTab: (tab: string) => void;
  onOpenResumeModal: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onRunGoal,
  onRunDemo,
  onResetDemo,
  onSelectTab,
  onOpenResumeModal,
}) => {
  const [query, setQuery] = useState('');

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent will toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const actions = [
    {
      id: 'demo',
      title: 'Run 3-Min Judge Demo',
      subtitle: 'Execute canonical end-to-end agentic workflow with human approval gate',
      category: 'Agent Missions',
      icon: <Sparkles className="w-4 h-4 text-cyan-400" />,
      run: () => {
        onRunDemo();
        onClose();
      },
    },
    {
      id: 'aiml',
      title: 'Find the best AI/ML internships for me and manage follow-ups',
      subtitle: 'Analyze 14+ opportunities, score fit against Alex Chen, and flag overdue applications',
      category: 'Agent Missions',
      icon: <IconAgent className="w-4 h-4 text-indigo-400" />,
      run: () => {
        onRunGoal('Find the best AI/ML internships for me and check which applications need follow-up.');
        onClose();
      },
    },
    {
      id: 'followups',
      title: 'Prepare follow-ups for applications > 14 days silent',
      subtitle: 'Scan pipeline and generate tailored professional drafts awaiting approval',
      category: 'Actions',
      icon: <IconFollowup className="w-4 h-4 text-amber-400" />,
      run: () => {
        onSelectTab('followups');
        onClose();
      },
    },
    {
      id: 'radar',
      title: 'Explore Opportunity Radar',
      subtitle: 'Filter internships by match score, remote preference, and deadlines',
      category: 'Navigation',
      icon: <IconOpportunity className="w-4 h-4 text-teal-400" />,
      run: () => {
        onSelectTab('opportunities');
        onClose();
      },
    },
    {
      id: 'pipeline',
      title: 'View Application Pipeline (Kanban)',
      subtitle: 'Manage applications across Shortlisted, Preparing, Applied, Interview, Offer',
      category: 'Navigation',
      icon: <ArrowRight className="w-4 h-4 text-slate-400" />,
      run: () => {
        onSelectTab('pipeline');
        onClose();
      },
    },
    {
      id: 'resume',
      title: 'AI Resume Parser & Skills Extraction',
      subtitle: 'Paste raw resume or LinkedIn text to auto-calibrate candidate profile',
      category: 'Tools',
      icon: <IconResume className="w-4 h-4 text-violet-400" />,
      run: () => {
        onOpenResumeModal();
        onClose();
      },
    },
    {
      id: 'reset',
      title: 'Reset Benchmark Demo Data',
      subtitle: 'Restore database to initial benchmark state for fresh presentation',
      category: 'Maintenance',
      icon: <RotateCcw className="w-4 h-4 text-slate-400" />,
      run: () => {
        onResetDemo();
        onClose();
      },
    },
  ];

  const filtered = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onRunGoal(query.trim());
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <form onSubmit={handleCustomSubmit} className="p-4 border-b border-slate-800 flex items-center gap-3">
          <IconSearch className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a goal or command (e.g., 'Find AI/ML internships' or 'Check followups')..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-500 outline-none"
          />
          {query ? (
            <button
              type="submit"
              className="text-xs px-2.5 py-1 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 rounded-lg flex items-center gap-1 font-semibold"
            >
              <span>Execute</span>
              <CornerDownLeft className="w-3 h-3" />
            </button>
          ) : (
            <kbd className="text-[10px] text-slate-500 font-mono bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              ESC to exit
            </kbd>
          )}
        </form>

        {/* Command list */}
        <div className="p-3 overflow-y-auto space-y-1">
          {filtered.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No matching commands. Press Enter to submit "{query}" directly to TaskPilot Agent.
            </div>
          ) : (
            filtered.map((item) => (
              <button
                key={item.id}
                onClick={item.run}
                className="w-full p-3 rounded-xl hover:bg-slate-800/80 transition-colors flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover:border-cyan-500/40">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {item.subtitle}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                  {item.category}
                </span>
              </button>
            ))
          )}
        </div>

        {/* Footer tips */}
        <div className="p-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500 font-mono">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
            <span>ESC Close</span>
          </div>
          <span className="text-cyan-400/80">TaskPilot Operations Cockpit</span>
        </div>
      </div>
    </div>
  );
};
