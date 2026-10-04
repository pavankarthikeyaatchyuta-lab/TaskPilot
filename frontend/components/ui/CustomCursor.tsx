'use client';

import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  isAgentActive?: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ isAgentActive = false }) => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Only run on non-touch devices with fine pointers
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (!mediaQuery.matches) return;

    // Check reduced motion
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (motionQuery.matches) return;

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const isClickable =
          target.closest('button') ||
          target.closest('a') ||
          target.closest('input') ||
          target.closest('select') ||
          target.closest('textarea') ||
          target.closest('.interactive') ||
          target.getAttribute('role') === 'button';

        setIsHovered(!!isClickable);
      }
    };

    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Precision Core Dot */}
      <div
        className="fixed w-1.5 h-1.5 bg-cyan-400 rounded-full -translate-x-1/2 -translate-y-1/2 transition-transform duration-75 ease-out shadow-[0_0_8px_#06b6d4]"
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />

      {/* Target Orbit Ring */}
      <div
        className={`fixed rounded-full -translate-x-1/2 -translate-y-1/2 border transition-all duration-200 ease-out ${
          isHovered
            ? 'w-8 h-8 border-cyan-400/80 bg-cyan-500/10 scale-100'
            : isAgentActive
            ? 'w-7 h-7 border-indigo-400/60 bg-indigo-500/10 animate-pulse'
            : 'w-5 h-5 border-slate-500/40 bg-transparent'
        }`}
        style={{
          left: `${pos.x}px`,
          top: `${pos.y}px`,
        }}
      />
    </div>
  );
};
