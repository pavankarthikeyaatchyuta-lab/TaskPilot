import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const task = serverStore.tasks.find((t) => t.id === params.id) || serverStore.tasks[0];
  if (!task) {
    return NextResponse.json({ detail: 'Task not found' }, { status: 404 });
  }

  const apprs = serverStore.approvals.filter((a) => a.task_id === task.id || a.status === 'PENDING');
  return NextResponse.json({
    ...task,
    approval_requests: apprs,
  });
}
