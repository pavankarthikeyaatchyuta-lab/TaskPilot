'use client';

import React from 'react';

interface TaskPilotBackgroundProps {
  agentActive?: boolean;
}

export const TaskPilotBackground: React.FC<TaskPilotBackgroundProps> = ({ agentActive = false }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] overflow-hidden bg-[#07090e]">
      {/* Layer 2: Subtle radial atmospheric glow */}
      <div
        className={`absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] rounded-full blur-[140px] transition-all duration-1000 ${
          agentActive
            ? 'bg-gradient-to-b from-cyan-500/15 via-indigo-500/10 to-transparent'
            : 'bg-gradient-to-b from-cyan-600/10 via-slate-800/10 to-transparent'
        }`}
      />

      <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[500px] rounded-full blur-[120px] bg-indigo-600/5" />
      <div className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[130px] bg-teal-500/5" />

      {/* Layer 3: Technical fine grid */}
      <div className="absolute inset-0 tech-grid-pattern opacity-60" />

      {/* Layer 4: Subtle SVG mission trajectory lines */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.08]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        <path
          d="M-50,200 Q400,100 800,450 T1800,300"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="1.2"
          strokeDasharray="6 6"
        />
        <path
          d="M100,800 Q600,600 1200,850 T2000,700"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="1"
          strokeDasharray="4 8"
        />

        {/* Subtle coordinate markers */}
        <circle cx="800" cy="450" r="3" fill="#06b6d4" />
        <circle cx="1200" cy="850" r="3" fill="#10b981" />
      </svg>
    </div>
  );
};
