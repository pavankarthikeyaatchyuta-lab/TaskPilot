import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { evaluateOpportunityFit } from '@/lib/serverMatching';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query')?.toLowerCase();
  const remoteType = searchParams.get('remote_type');
  const oppType = searchParams.get('opportunity_type');

  let opps = serverStore.opportunities;

  if (query) {
    opps = opps.filter(
      (o) =>
        o.title.toLowerCase().includes(query) ||
        o.company.toLowerCase().includes(query) ||
        o.description.toLowerCase().includes(query) ||
        o.skills_required.some((s) => s.toLowerCase().includes(query))
    );
  }

  if (remoteType && remoteType !== 'All') {
    opps = opps.filter((o) => o.remote_type === remoteType);
  }

  if (oppType && oppType !== 'All') {
    opps = opps.filter((o) => o.opportunity_type === oppType);
  }

  const enriched = opps.map((o) => {
    const fit = evaluateOpportunityFit(serverStore.profile, o);
    return {
      ...o,
      match_score: fit.match_score,
      eligibility_status: fit.eligibility_status,
      why_match: fit.why_match,
      potential_gaps: fit.potential_gaps,
    };
  });

  enriched.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

  return NextResponse.json(enriched);
}
