import { NextResponse, NextRequest } from 'next/server';
import { POST as createTask } from '../../agent/tasks/route';

export async function POST(request: NextRequest) {
  // If internal backend service binding is present, forward to backend
  if (process.env.BACKEND_URL) {
    try {
      const targetUrl = new URL('/api/demo/run', process.env.BACKEND_URL);
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    } catch (err) {
      console.warn('[DemoRun] Failed to call internal backend service, using local handler:', err);
    }
  }

  const base = request?.nextUrl?.origin || 'http://localhost:3000';
  const req = new NextRequest(`${base}/api/agent/tasks`, {
    method: 'POST',
    body: JSON.stringify({
      goal: 'Find the best AI/ML internships for me and check which of my applications need follow-up.',
    }),
  });
  return createTask(req);
}
