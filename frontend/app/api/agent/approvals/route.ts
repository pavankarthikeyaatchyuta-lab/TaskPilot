import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  const pending = serverStore.approvals.filter((a) => a.status === 'PENDING');
  return NextResponse.json(pending);
}
