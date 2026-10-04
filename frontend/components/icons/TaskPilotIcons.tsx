'use client';

import React from 'react';

interface IconProps {
  className?: string;
  size?: number;
}

// 1. Official TaskPilot Logo Mark
export const IconLogo: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Navigation waypoint diamond */}
    <path
      d="M12 2L20.5 12L12 22L3.5 12L12 2Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      className="opacity-40"
    />
    {/* Forward velocity vector + checkmark */}
    <path
      d="M7.5 12.5L10.5 15.5L16.5 8.5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    {/* Central intelligence node */}
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
  </svg>
);

// 2. IconAgent: Autonomous navigation node with orbital coordinates
export const IconAgent: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="1.5" fill="currentColor" />
    <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5.5 5.5L7.5 7.5M16.5 16.5L18.5 18.5M18.5 5.5L16.5 7.5M7.5 16.5L5.5 18.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" className="opacity-50" />
  </svg>
);

// 3. IconMission: Crosshair target with trajectory path
export const IconMission: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7V17M7 12H17" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M12 4L14 2H19V7L17 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 4. IconOpportunity: Diamond beacon radar
export const IconOpportunity: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="4" width="16" height="16" rx="4" transform="rotate(45 12 12)" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
    <path d="M12 2V5M12 19V22M2 12H5M19 12H22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="opacity-60" />
  </svg>
);

// 5. IconSearch: Precision technical scanner
export const IconSearch: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M16 16L21 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <path d="M8 11H14M11 8V14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="opacity-50" />
  </svg>
);

// 6. IconMatch: Intersecting calibrated rings
export const IconMatch: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="9" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="15" cy="12" r="6" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8.5V15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// 7. IconEligibility: Shield with verified internal check node
export const IconEligibility: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L20 6.5V12C20 17 16 20.5 12 22C8 20.5 4 17 4 12V6.5L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8.5 12L11 14.5L15.5 9.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 8. IconApplication: Structured career dossier
export const IconApplication: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="4" y="3" width="16" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 8H16M8 12H16M8 16H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 9. IconFollowup: Chronometer dispatch arrow
export const IconFollowup: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M19 4L22 7M22 7H17M22 7V2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 10. IconApproval: Hexagonal human gate checkpoint
export const IconApproval: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 2L21 7V17L12 22L3 17V7L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="1" fill="currentColor" />
  </svg>
);

// 11. IconVerification: Double concentric verification badge
export const IconVerification: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="12" r="6" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" className="opacity-60" />
    <path d="M9 12L11 14L15 10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 12. IconExecution: High-energy execution vector
export const IconExecution: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// 13. IconIntelligence: Synaptic lattice core
export const IconIntelligence: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="12" cy="4" r="1.5" fill="currentColor" />
    <circle cx="20" cy="12" r="1.5" fill="currentColor" />
    <circle cx="12" cy="20" r="1.5" fill="currentColor" />
    <circle cx="4" cy="12" r="1.5" fill="currentColor" />
    <path d="M12 5.5V9M18.5 12H15M12 18.5V15M5.5 12H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

// 14. IconProfile: Candidate identity credential
export const IconProfile: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path d="M5 20C5 16.5 8 14.5 12 14.5C16 14.5 19 16.5 19 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 15. IconTimeline: Trajectory waypoints
export const IconTimeline: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M4 12H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="6" cy="12" r="2.5" fill="currentColor" />
    <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="18" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" className="opacity-50" />
  </svg>
);

// 16. IconTool: Calibrated compass/wrench
export const IconTool: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
);

// 17. IconEmail: Encrypted transmission capsule
export const IconEmail: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 18. IconResume: Data sheet schema
export const IconResume: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M8 13H16M8 17H13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 19. IconDeadline: Chrono beacon
export const IconDeadline: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8V12L14.5 14.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M9 2H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

// 20. IconSuccess: Verified waypoint circle
export const IconSuccess: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 12L11 15L16 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// 21. IconWarning: Attention beacon perimeter
export const IconWarning: React.FC<IconProps> = ({ className = 'w-5 h-5', size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
    <path d="M12 3L21 19H3L12 3Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M12 9V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <circle cx="12" cy="17" r="0.8" fill="currentColor" />
  </svg>
);
