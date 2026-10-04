import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const approval = serverStore.approvals.find((a) => a.id === params.id);
  if (!approval) {
    return NextResponse.json({ detail: 'Approval request not found' }, { status: 404 });
  }

  const body = await req.json();
  approval.status = 'APPROVED';
  approval.resolved_at = new Date().toISOString();
  approval.feedback = body.feedback || 'Approved by user via Human Approval Gate';

  const payload = body.edited_payload || approval.payload;
  const appId = payload?.application_id;

  // Update application
  const app = serverStore.applications.find((a) => a.id === appId);
  if (app) {
    app.status = 'UNDER_REVIEW';
    app.notes = (app.notes || '') + `\n[${new Date().toISOString().split('T')[0]}] Follow-up message sent: ${payload.subject}`;
    app.events.unshift({
      id: Date.now(),
      application_id: app.id,
      event_type: 'FOLLOW_UP_SENT',
      description: `Personalized follow-up dispatched to ${app.company} recruiting`,
      metadata_json: {
        subject: payload.subject,
        body: payload.body,
        verified: true,
      },
      created_at: new Date().toISOString(),
    });
  }

  // Update task if all approvals resolved
  const remaining = serverStore.approvals.filter((a) => a.status === 'PENDING').length;
  if (remaining === 0 && serverStore.tasks.length > 0) {
    const task = serverStore.tasks[0];
    task.status = 'COMPLETED';
    task.current_step = 8;
    task.plan = task.plan.map((p) => ({ ...p, status: 'COMPLETED' }));
    task.final_summary =
      '✓ Workflow Complete: Opportunities analyzed and shortlisted. Follow-up action was approved by human operator, dispatched, and verified in the database.';
  }

  return NextResponse.json({
    success: true,
    decision: 'APPROVE',
    execution: { status: 'EXECUTED', application_id: appId, company: payload?.company },
    verification: { verified: true, target: `Application #${appId} (${payload?.company})`, status: 'UNDER_REVIEW' },
  });
}
