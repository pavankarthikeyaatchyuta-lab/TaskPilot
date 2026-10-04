from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timedelta
from app.db.session import get_db
from app.models.entities import Application, ApplicationEvent
from app.schemas.schemas import ApplicationResponse, ApplicationCreate, ApplicationUpdate
from app.tools.registry import tool_registry

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def list_applications(
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    q = db.query(Application).filter(Application.user_id == 1)
    if status and status != "ALL":
        q = q.filter(Application.status == status)
    apps = q.order_by(Application.updated_at.desc()).all()
    return apps

from fastapi.responses import Response
import csv
import io

@router.get("/export")
def export_applications_csv(db: Session = Depends(get_db)):
    apps = db.query(Application).filter(Application.user_id == 1).order_by(Application.updated_at.desc()).all()
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["ID", "Company", "Role", "Status", "Match Score", "Applied Date", "Deadline", "Follow-up Date", "Application URL", "Notes"])
    
    for a in apps:
        writer.writerow([
            a.id,
            a.company,
            a.role,
            a.status,
            a.match_score,
            a.applied_date.strftime('%Y-%m-%d') if a.applied_date else "",
            a.deadline.strftime('%Y-%m-%d') if a.deadline else "",
            a.follow_up_date.strftime('%Y-%m-%d') if a.follow_up_date else "",
            a.application_url or "",
            (a.notes or "").replace("\n", " ")
        ])
    
    csv_content = output.getvalue()
    return Response(
        content=csv_content,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=taskpilot_applications.csv"}
    )

@router.get("/followups")
async def list_pending_followups(
    threshold_days: int = 14,
    db: Session = Depends(get_db)
):
    tool = tool_registry.get("get_pending_followups")
    res = await tool.run(user_id=1, threshold_days=threshold_days, db=db)
    return res.data or []

@router.post("", response_model=ApplicationResponse)
def create_application(payload: ApplicationCreate, db: Session = Depends(get_db)):
    app = Application(
        user_id=1,
        opportunity_id=payload.opportunity_id,
        company=payload.company,
        role=payload.role,
        status=payload.status,
        match_score=payload.match_score,
        match_reason=payload.match_reason,
        applied_date=payload.applied_date,
        deadline=payload.deadline,
        follow_up_date=payload.follow_up_date,
        application_url=payload.application_url,
        notes=payload.notes,
    )
    db.add(app)
    db.commit()
    db.refresh(app)

    event = ApplicationEvent(
        application_id=app.id,
        event_type="STATUS_CHANGE",
        description=f"Created application with status {app.status}",
        metadata_json={}
    )
    db.add(event)
    db.commit()
    return app

@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(application_id: int, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")
    return app

@router.patch("/{application_id}", response_model=ApplicationResponse)
def update_application(application_id: int, payload: ApplicationUpdate, db: Session = Depends(get_db)):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    old_status = app.status
    if payload.status:
        app.status = payload.status
    if payload.notes is not None:
        app.notes = payload.notes
    if payload.applied_date is not None:
        app.applied_date = payload.applied_date
    if payload.follow_up_date is not None:
        app.follow_up_date = payload.follow_up_date

    app.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(app)

    if payload.status and payload.status != old_status:
        evt = ApplicationEvent(
            application_id=app.id,
            event_type="STATUS_CHANGE",
            description=f"Application status changed to {payload.status}",
            metadata_json={"previous_status": old_status, "new_status": payload.status}
        )
        db.add(evt)
        db.commit()

    return app
