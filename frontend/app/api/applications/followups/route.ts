import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const threshold = parseInt(searchParams.get('threshold_days') || '14');

  const now = new Date();
  const followups = serverStore.applications
    .filter((a) => ['APPLIED', 'UNDER_REVIEW', 'FOLLOW_UP_REQUIRED'].includes(a.status))
    .map((a) => {
      const days = a.applied_date
        ? Math.floor((now.getTime() - new Date(a.applied_date).getTime()) / (1000 * 3600 * 24))
        : 0;
      return {
        application_id: a.id,
        company: a.company,
        role: a.role,
        applied_date: a.applied_date ? new Date(a.applied_date).toISOString().split('T')[0] : 'Unknown',
        days_since_applied: days,
        status: a.status,
        reason: days >= threshold ? `Exceeded ${threshold}-day silence threshold without response` : 'Flagged for follow-up',
      };
    })
    .filter((f) => f.days_since_applied >= threshold || f.status === 'FOLLOW_UP_REQUIRED');

  return NextResponse.json(followups);
}
