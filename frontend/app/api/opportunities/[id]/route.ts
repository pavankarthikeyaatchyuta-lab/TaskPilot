import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { evaluateOpportunityFit } from '@/lib/serverMatching';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const opp = serverStore.opportunities.find((o) => o.id === id);
  if (!opp) {
    return NextResponse.json({ detail: 'Opportunity not found' }, { status: 404 });
  }

  const fit = evaluateOpportunityFit(serverStore.profile, opp);
  return NextResponse.json({
    ...opp,
    match_score: fit.match_score,
    eligibility_status: fit.eligibility_status,
    why_match: fit.why_match,
    potential_gaps: fit.potential_gaps,
  });
}
