import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const app = serverStore.applications.find((a) => a.id === id);
  if (!app) {
    return NextResponse.json({ detail: 'Application not found' }, { status: 404 });
  }
  return NextResponse.json(app);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id);
  const app = serverStore.applications.find((a) => a.id === id);
  if (!app) {
    return NextResponse.json({ detail: 'Application not found' }, { status: 404 });
  }

  const body = await req.json();
  const oldStatus = app.status;

  if (body.status) app.status = body.status;
  if (body.notes !== undefined) app.notes = body.notes;
  if (body.applied_date !== undefined) app.applied_date = body.applied_date;
  if (body.follow_up_date !== undefined) app.follow_up_date = body.follow_up_date;

  app.updated_at = new Date().toISOString();

  if (body.status && body.status !== oldStatus) {
    app.events.unshift({
      id: Date.now(),
      application_id: app.id,
      event_type: 'STATUS_CHANGE',
      description: `Transitioned stage from ${oldStatus} to ${body.status}`,
      metadata_json: { oldStatus, newStatus: body.status },
      created_at: new Date().toISOString(),
    });
  }

  return NextResponse.json(app);
}
