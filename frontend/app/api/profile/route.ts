import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  return NextResponse.json(serverStore.profile);
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  serverStore.profile = {
    ...serverStore.profile,
    ...body,
    updated_at: new Date().toISOString(),
  };
  return NextResponse.json(serverStore.profile);
}
