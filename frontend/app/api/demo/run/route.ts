import { NextResponse } from 'next/server';
import { POST as createTask } from '../../agent/tasks/route';
import { NextRequest } from 'next/server';

export async function POST() {
  const req = new NextRequest('http://localhost:3000/api/agent/tasks', {
    method: 'POST',
    body: JSON.stringify({
      goal: 'Find the best AI/ML internships for me and check which of my applications need follow-up.',
    }),
  });
  return createTask(req);
}
