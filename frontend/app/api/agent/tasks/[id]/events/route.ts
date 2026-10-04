import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const actions = serverStore.actions.filter((a) => a.task_id === params.id);
  return NextResponse.json(actions.length > 0 ? actions : serverStore.actions.slice(-8));
}
