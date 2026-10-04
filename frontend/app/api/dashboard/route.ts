import { NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

export async function GET() {
  const activeApps = serverStore.applications.filter((a) => !['REJECTED', 'CLOSED'].includes(a.status));
  const shortlisted = activeApps.filter((a) => a.status === 'SHORTLISTED');
  const interviews = activeApps.filter((a) => a.status === 'INTERVIEW');
  const offers = activeApps.filter((a) => a.status === 'OFFER');

  const now = new Date();
  const followupsDue = activeApps.filter((a) => {
    if (!['APPLIED', 'UNDER_REVIEW', 'FOLLOW_UP_REQUIRED'].includes(a.status)) return false;
    if (a.status === 'FOLLOW_UP_REQUIRED') return true;
    if (a.applied_date) {
      const days = Math.floor((now.getTime() - new Date(a.applied_date).getTime()) / (1000 * 3600 * 24));
      return days >= 14;
    }
    return false;
  });

  const pendingApprovals = serverStore.approvals.filter((a) => a.status === 'PENDING');

  return NextResponse.json({
    active_applications_count: activeApps.length,
    shortlisted_count: shortlisted.length,
    followups_due_count: followupsDue.length,
    interviews_count: interviews.length,
    offers_count: offers.length,
    total_opportunities_count: serverStore.opportunities.length,
    pending_approvals_count: pendingApprovals.length,
    recent_applications: serverStore.applications.slice(0, 5),
    recent_actions: serverStore.actions.slice(-10).reverse(),
    pending_approvals: pendingApprovals,
  });
}
