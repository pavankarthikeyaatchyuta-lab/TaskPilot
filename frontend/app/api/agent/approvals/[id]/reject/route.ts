import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const approval = serverStore.approvals.find((a) => a.id === params.id);
  if (!approval) {
    return NextResponse.json({ detail: 'Approval request not found' }, { status: 404 });
  }

  const body = await req.json();
  approval.status = 'REJECTED';
  approval.resolved_at = new Date().toISOString();
  approval.feedback = body.feedback || 'Action rejected by human operator';

  return NextResponse.json({
    success: true,
    decision: 'REJECT',
    message: 'Action rejected by user. No external action executed.',
  });
}
