import { NextResponse } from 'next/server';
import { createInitialState, serverStore } from '@/lib/serverStore';

export async function POST() {
  const fresh = createInitialState();
  serverStore.profile = fresh.profile;
  serverStore.opportunities = fresh.opportunities;
  serverStore.applications = fresh.applications;
  serverStore.tasks = fresh.tasks;
  serverStore.actions = fresh.actions;
  serverStore.approvals = fresh.approvals;

  return NextResponse.json({
    status: 'success',
    message: 'TaskPilot database cleanly reset to initial benchmark state for judging.',
  });
}
