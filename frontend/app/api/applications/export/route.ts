import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  const rows = [
    ['ID', 'Company', 'Role', 'Status', 'Match Score', 'Applied Date', 'Deadline', 'Follow-up Date', 'Notes'],
  ];

  for (const a of serverStore.applications) {
    rows.push([
      String(a.id),
      `"${a.company}"`,
      `"${a.role}"`,
      a.status,
      String(a.match_score),
      a.applied_date ? a.applied_date.split('T')[0] : '',
      a.deadline ? a.deadline.split('T')[0] : '',
      a.follow_up_date ? a.follow_up_date.split('T')[0] : '',
      `"${(a.notes || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`,
    ]);
  }

  const csv = rows.map((r) => r.join(',')).join('\n');

  return new NextResponse(csv, {
    status: 200,
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename=taskpilot_applications.csv',
    },
  });
}
