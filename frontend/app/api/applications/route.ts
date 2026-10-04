import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status');

  let apps = serverStore.applications;
  if (status && status !== 'ALL') {
    apps = apps.filter((a) => a.status === status);
  }

  return NextResponse.json(apps);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const newId = serverStore.applications.length > 0 ? Math.max(...serverStore.applications.map((a) => a.id)) + 1 : 1;

  const newApp = {
    id: newId,
    user_id: 1,
    opportunity_id: body.opportunity_id,
    company: body.company,
    role: body.role,
    status: body.status || 'SHORTLISTED',
    match_score: body.match_score || 85,
    match_reason: body.match_reason || 'Added via Opportunity Radar',
    applied_date: body.applied_date,
    deadline: body.deadline,
    follow_up_date: body.follow_up_date,
    application_url: body.application_url,
    notes: body.notes || 'Added to tracker.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    events: [
      {
        id: Date.now(),
        application_id: newId,
        event_type: 'STATUS_CHANGE',
        description: `Created application in stage ${body.status || 'SHORTLISTED'}`,
        metadata_json: {},
        created_at: new Date().toISOString(),
      },
    ],
  };

  serverStore.applications.unshift(newApp);
  return NextResponse.json(newApp);
}
