from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.entities import Application, Opportunity, ApprovalRequest, AgentAction
from app.schemas.schemas import DashboardOverview

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("", response_model=DashboardOverview)
def get_dashboard_summary(db: Session = Depends(get_db)):
    active_apps = db.query(Application).filter(Application.user_id == 1, ~Application.status.in_(["REJECTED", "CLOSED"])).all()
    shortlisted = [a for a in active_apps if a.status == "SHORTLISTED"]
    interviews = [a for a in active_apps if a.status == "INTERVIEW"]
    offers = [a for a in active_apps if a.status == "OFFER"]
    
    # Follow-ups due (> 14 days applied with no response or follow_up_date reached)
    now = datetime.utcnow()
    cutoff = now - timedelta(days=14)
    followups_due = [
        a for a in active_apps 
        if (a.status in ["APPLIED", "UNDER_REVIEW", "FOLLOW_UP_REQUIRED"]) and 
           ((a.applied_date and a.applied_date <= cutoff) or (a.follow_up_date and a.follow_up_date <= now) or a.status == "FOLLOW_UP_REQUIRED")
    ]

    total_opps = db.query(Opportunity).filter(Opportunity.status == "ACTIVE").count()
    pending_approvals = db.query(ApprovalRequest).filter(ApprovalRequest.status == "PENDING").all()
    
    recent_actions = db.query(AgentAction).order_by(AgentAction.created_at.desc()).limit(10).all()
    recent_apps = db.query(Application).filter(Application.user_id == 1).order_by(Application.updated_at.desc()).limit(5).all()

    return DashboardOverview(
        active_applications_count=len(active_apps),
        shortlisted_count=len(shortlisted),
        followups_due_count=len(followups_due),
        interviews_count=len(interviews),
        offers_count=len(offers),
        total_opportunities_count=total_opps,
        pending_approvals_count=len(pending_approvals),
        recent_applications=recent_apps,
        recent_actions=recent_actions,
        pending_approvals=pending_approvals
    )
