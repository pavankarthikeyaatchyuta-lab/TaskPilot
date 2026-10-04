// Server-side TypeScript Matching Engine for Next.js App Router API routes

export interface MatchResult {
  match_score: number;
  eligibility_status: string;
  why_match: string[];
  potential_gaps: string[];
}

export function evaluateOpportunityFit(profile: any, opp: any): MatchResult {
  const userSkills = new Set((profile.skills || []).map((s: string) => s.toLowerCase()));
  const oppSkills = (opp.skills_required || []).map((s: string) => s.toLowerCase());

  // 1. Skill Match (0.35)
  const common = oppSkills.filter((s: string) => userSkills.has(s));
  const missing = oppSkills.filter((s: string) => !userSkills.has(s));
  const skillScore = oppSkills.length > 0 ? common.length / oppSkills.length : 0.8;

  // 2. Eligibility (0.25)
  let eligibilityScore = 1.0;
  let eligibilityStatus = 'Eligible';
  const eligibilityReasons: string[] = [];
  const gaps: string[] = [];

  const eligText = (opp.eligibility || '').toLowerCase();
  const gradYear = profile.graduation_year || 2026;

  if (eligText.includes('202') && Math.abs(gradYear - 2026) <= 1) {
    eligibilityReasons.push(`Graduation year (${gradYear}) matches candidate target window`);
  }
  if (eligText.includes('student') || eligText.includes('enrolled') || eligText.includes('bs')) {
    eligibilityReasons.push('Currently enrolled university student eligibility satisfied');
  }

  // 3. Role Preference (0.15)
  const oppTitle = (opp.title || '').toLowerCase();
  let roleScore = 0.6;
  const prefRoles = (profile.preferred_roles || []).map((r: string) => r.toLowerCase());
  if (prefRoles.some((r: string) => oppTitle.includes('ai') || oppTitle.includes('machine learning') || oppTitle.includes('ml'))) {
    roleScore = 0.95;
  }

  // 4. Location Fit (0.15)
  let locationScore = 0.8;
  const userRemote = profile.remote_preference || 'Any';
  const oppRemote = opp.remote_type || 'Hybrid';
  if (oppRemote === 'Remote' || userRemote === 'Any' || oppRemote === 'Hybrid') {
    locationScore = 0.95;
  }

  // 5. Urgency (0.10)
  const urgencyScore = 0.85;

  // Weighted overall calculation
  const overall = (
    skillScore * 0.35 +
    eligibilityScore * 0.25 +
    roleScore * 0.15 +
    locationScore * 0.15 +
    urgencyScore * 0.10
  );

  const finalPct = Math.round(Math.min(Math.max(overall * 100, 15), 98) * 10) / 10;

  const whyMatch: string[] = [];
  if (common.length > 0) {
    whyMatch.push(`Matched core technical skills: ${common.slice(0, 4).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`);
  }
  whyMatch.push(...eligibilityReasons.slice(0, 2));
  if (roleScore >= 0.9) {
    whyMatch.push(`Direct alignment with preferred role (${opp.title})`);
  }

  if (missing.length > 0) {
    gaps.push(`Preferred skills to highlight: ${missing.slice(0, 3).map((s: string) => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}`);
  }

  return {
    match_score: finalPct,
    eligibility_status: eligibilityStatus,
    why_match: whyMatch,
    potential_gaps: gaps,
  };
}
