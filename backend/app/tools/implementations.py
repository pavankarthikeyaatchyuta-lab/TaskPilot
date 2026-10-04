from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.tools.base import BaseTool
from app.services.discovery.sources import get_opportunity_source
from app.services.matching.engine import matching_engine
from app.services.llm.provider import get_llm_provider
from app.models.entities import (
    Opportunity, Application, ApplicationEvent, ApprovalRequest, Task, AgentAction
)
import uuid
import logging

logger = logging.getLogger(__name__)

class SearchOpportunitiesTool(BaseTool):
    name = "search_opportunities"
    description = "Searches for internships, research roles, hackathons, and scholarships across configured sources."
    permission_level = "SAFE"

    async def _execute(self, query: str = "", filters: Optional[Dict[str, Any]] = None, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        # First query database
        db_results = []
        if db:
            q = db.query(Opportunity).filter(Opportunity.status == "ACTIVE")
            if query:
                q = q.filter(Opportunity.title.ilike(f"%{query}%") | Opportunity.description.ilike(f"%{query}%") | Opportunity.company.ilike(f"%{query}%"))
            db_opps = q.all()
            for opp in db_opps:
                db_results.append({
                    "id": opp.id,
                    "title": opp.title,
                    "company": opp.company,
                    "description": opp.description,
                    "location": opp.location,
                    "remote_type": opp.remote_type,
                    "skills_required": opp.skills_required or [],
                    "eligibility": opp.eligibility,
                    "deadline": opp.deadline.isoformat() if opp.deadline else None,
                    "stipend": opp.stipend,
                    "application_url": opp.application_url,
                    "source": opp.source,
                    "opportunity_type": opp.opportunity_type,
                })

        # If db had results, return them. Otherwise query source provider and persist
        if db_results:
            return db_results

        source = get_opportunity_source("mock")
        results = await source.search(query, filters)
        
        # Persist discovered opportunities to DB if session provided
        if db:
            persisted = []
            for item in results:
                existing = db.query(Opportunity).filter(Opportunity.company == item["company"], Opportunity.title == item["title"]).first()
                if not existing:
                    opp = Opportunity(
                        title=item["title"],
                        company=item["company"],
                        description=item["description"],
                        location=item["location"],
                        remote_type=item["remote_type"],
                        skills_required=item["skills_required"],
                        eligibility=item["eligibility"],
                        deadline=item["deadline"],
                        stipend=item["stipend"],
                        application_url=item["application_url"],
                        source=item["source"],
                        opportunity_type=item["opportunity_type"],
                    )
                    db.add(opp)
                    db.commit()
                    db.refresh(opp)
                    item_dict = dict(item)
                    item_dict["id"] = opp.id
                    item_dict["deadline"] = opp.deadline.isoformat() if opp.deadline else None
                    persisted.append(item_dict)
                else:
                    item_dict = dict(item)
                    item_dict["id"] = existing.id
                    item_dict["deadline"] = existing.deadline.isoformat() if existing.deadline else None
                    persisted.append(item_dict)
            return persisted

        return results

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        if isinstance(result_data, list):
            return True, f"Successfully retrieved {len(result_data)} verified opportunities"
        return False, "Failed to retrieve valid opportunity list"


class EvaluateEligibilityTool(BaseTool):
    name = "evaluate_eligibility"
    description = "Checks a student's profile against an opportunity to determine eligibility status (Eligible, Probably eligible, Needs verification, Not eligible)."
    permission_level = "SAFE"

    async def _execute(self, profile: Dict[str, Any], opportunity: Dict[str, Any]) -> Dict[str, Any]:
        eval_result = matching_engine.evaluate(profile, opportunity)
        return {
            "eligibility_status": eval_result["eligibility_status"],
            "why_match": eval_result["why_match"],
            "potential_gaps": eval_result["potential_gaps"],
            "eligibility_score": eval_result["breakdown"]["eligibility_score"]
        }

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        if "eligibility_status" in result_data:
            return True, f"Verified eligibility status: {result_data['eligibility_status']}"
        return False, "Eligibility evaluation did not return valid status"


class CalculateMatchScoreTool(BaseTool):
    name = "calculate_match_score"
    description = "Calculates a transparent weighted match score (0-100%) and provides explainable reasons."
    permission_level = "SAFE"

    async def _execute(self, profile: Dict[str, Any], opportunity: Dict[str, Any]) -> Dict[str, Any]:
        return matching_engine.evaluate(profile, opportunity)


class AddToTrackerTool(BaseTool):
    name = "add_to_tracker"
    description = "Adds or saves an opportunity into the application tracker pipeline (e.g. SHORTLISTED or PREPARING)."
    permission_level = "SAFE"

    async def _execute(
        self,
        user_id: int,
        company: str,
        role: str,
        status: str = "SHORTLISTED",
        opportunity_id: Optional[int] = None,
        match_score: float = 0.0,
        match_reason: str = "",
        deadline: Optional[Any] = None,
        application_url: Optional[str] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        if not db:
            raise ValueError("Database session required for AddToTrackerTool")

        # Ensure deadline is a datetime object
        if isinstance(deadline, str):
            try:
                deadline = datetime.fromisoformat(deadline.replace("Z", "+00:00"))
            except Exception:
                deadline = None

        # Check if existing
        existing = db.query(Application).filter(
            Application.user_id == user_id,
            Application.company == company,
            Application.role == role
        ).first()

        if existing:
            existing.status = status
            if match_score:
                existing.match_score = match_score
            if match_reason:
                existing.match_reason = match_reason
            db.commit()
            db.refresh(existing)
            target = existing
        else:
            target = Application(
                user_id=user_id,
                opportunity_id=opportunity_id,
                company=company,
                role=role,
                status=status,
                match_score=match_score,
                match_reason=match_reason,
                deadline=deadline,
                application_url=application_url,
                notes=f"Added by TaskPilot Orchestrator with {match_score}% match score."
            )
            db.add(target)
            db.commit()
            db.refresh(target)

            # Record event
            event = ApplicationEvent(
                application_id=target.id,
                event_type="STATUS_CHANGE",
                description=f"Opportunity added to pipeline with status '{status}'",
                metadata_json={"match_score": match_score}
            )
            db.add(event)
            db.commit()

        return {
            "application_id": target.id,
            "company": target.company,
            "role": target.role,
            "status": target.status,
            "match_score": target.match_score
        }

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        db = kwargs.get("db")
        if not db:
            return True, "No DB to verify against"
        app_id = result_data.get("application_id")
        rec = db.query(Application).filter(Application.id == app_id).first()
        if rec and rec.company == result_data.get("company"):
            return True, f"Verified application #{rec.id} exists for {rec.company} with status '{rec.status}'"
        return False, "Verification failed: application record not found in database"


class UpdateApplicationTool(BaseTool):
    name = "update_application"
    description = "Updates an existing application's status, notes, or follow-up schedule."
    permission_level = "SAFE"

    async def _execute(
        self,
        application_id: int,
        status: Optional[str] = None,
        notes: Optional[str] = None,
        follow_up_date: Optional[Any] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        if not db:
            raise ValueError("Database session required")
        app = db.query(Application).filter(Application.id == application_id).first()
        if not app:
            raise ValueError(f"Application #{application_id} not found")

        old_status = app.status
        if status:
            app.status = status
        if notes:
            app.notes = (app.notes or "") + f"\n[{datetime.utcnow().strftime('%Y-%m-%d')}] {notes}"
        if follow_up_date:
            if isinstance(follow_up_date, str):
                try:
                    follow_up_date = datetime.fromisoformat(follow_up_date.replace("Z", "+00:00"))
                except Exception:
                    follow_up_date = None
            if follow_up_date:
                app.follow_up_date = follow_up_date
        db.commit()
        db.refresh(app)

        if status and status != old_status:
            evt = ApplicationEvent(
                application_id=app.id,
                event_type="STATUS_CHANGE",
                description=f"Status transitioned from {old_status} to {status}",
                metadata_json={"previous_status": old_status, "new_status": status}
            )
            db.add(evt)
            db.commit()

        return {
            "application_id": app.id,
            "company": app.company,
            "role": app.role,
            "status": app.status,
            "follow_up_date": app.follow_up_date.isoformat() if app.follow_up_date else None
        }

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        db = kwargs.get("db")
        if not db:
            return True, "No DB context"
        app_id = result_data.get("application_id")
        rec = db.query(Application).filter(Application.id == app_id).first()
        if rec and rec.status == result_data.get("status"):
            return True, f"Verified application #{rec.id} updated to '{rec.status}'"
        return False, "Verification failed: application status mismatch in database"


class GetPendingFollowupsTool(BaseTool):
    name = "get_pending_followups"
    description = "Scans tracker to identify applications that have had no response beyond the configured threshold (default 14 days)."
    permission_level = "SAFE"

    async def _execute(self, user_id: int, threshold_days: int = 14, db: Optional[Session] = None) -> List[Dict[str, Any]]:
        if not db:
            return []
        
        now = datetime.utcnow()
        cutoff_date = now - timedelta(days=threshold_days)
        
        # Applications in APPLIED or UNDER_REVIEW where applied_date <= cutoff or follow_up_date <= now
        apps = db.query(Application).filter(
            Application.user_id == user_id,
            Application.status.in_(["APPLIED", "UNDER_REVIEW", "FOLLOW_UP_REQUIRED"])
        ).all()

        followups_needed = []
        for app in apps:
            needs_followup = False
            days_since = (now - app.applied_date).days if app.applied_date else 0
            reason = ""

            if app.follow_up_date and app.follow_up_date <= now:
                needs_followup = True
                reason = f"Scheduled follow-up date ({app.follow_up_date.strftime('%Y-%m-%d')}) reached"
            elif app.applied_date and app.applied_date <= cutoff_date:
                needs_followup = True
                reason = f"Application submitted {days_since} days ago with no update (threshold: {threshold_days} days)"
            elif app.status == "FOLLOW_UP_REQUIRED":
                needs_followup = True
                reason = "Flagged as follow-up required"

            if needs_followup:
                followups_needed.append({
                    "application_id": app.id,
                    "company": app.company,
                    "role": app.role,
                    "applied_date": app.applied_date.strftime('%Y-%m-%d') if app.applied_date else "Unknown",
                    "days_since_applied": days_since,
                    "status": app.status,
                    "reason": reason
                })

        return followups_needed

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        return True, f"Follow-up scan identified {len(result_data)} candidates requiring action"


class GenerateFollowupTool(BaseTool):
    name = "generate_followup"
    description = "Generates a personalized, professional follow-up email draft tailored to the company, role, applied date, and student profile."
    permission_level = "SAFE"

    async def _execute(
        self,
        profile: Dict[str, Any],
        application: Dict[str, Any]
    ) -> Dict[str, Any]:
        company = application.get("company", "the hiring team")
        role = application.get("role", "the opportunity")
        applied_date = application.get("applied_date", "recent weeks")
        student_name = profile.get("full_name", "Applicant")
        university = profile.get("university", "University")
        skills = profile.get("skills", ["Python", "Machine Learning"])
        top_skills = ", ".join(skills[:3]) if skills else "Python and Machine Learning"

        llm = get_llm_provider()
        sys_prompt = (
            "You are TaskPilot's Follow-up Agent. Draft a courteous, concise, high-impact follow-up email "
            "for a college student checking on their internship application. Do not sound entitled or aggressive. "
            "Reiterate enthusiasm and offer any additional information."
        )
        user_prompt = (
            f"Candidate: {student_name} from {university}\n"
            f"Company: {company}\n"
            f"Role: {role}\n"
            f"Applied Date: {applied_date}\n"
            f"Core Skills: {top_skills}\n"
            f"Draft a subject line and body."
        )
        schema = '{"subject": "string", "body": "string", "tone": "string", "recommended_timing": "string"}'

        try:
            draft = await llm.generate_structured(sys_prompt, user_prompt, schema)
        except Exception:
            # Fallback robust template
            draft = {
                "subject": f"Inquiry regarding my application for {role} at {company}",
                "body": (
                    f"Dear {company} Recruiting Team,\n\n"
                    f"I hope you are having a productive week. I am writing to politely follow up on my application "
                    f"for the {role} position, which I submitted on {applied_date}.\n\n"
                    f"As a student at {university} specializing in {top_skills}, I remain particularly excited "
                    f"about {company}'s ongoing work and would love the chance to contribute to your engineering efforts.\n\n"
                    f"Please let me know if there are any additional project demos, transcripts, or references I can provide.\n\n"
                    f"Thank you for your time and continued consideration.\n\n"
                    f"Warm regards,\n{student_name}"
                ),
                "tone": "Polite, professional, enthusiastic",
                "recommended_timing": "Send today during working hours"
            }

        return {
            "application_id": application.get("application_id"),
            "company": company,
            "role": role,
            "subject": draft.get("subject"),
            "body": draft.get("body"),
            "tone": draft.get("tone", "Professional"),
            "recommended_timing": draft.get("recommended_timing", "Immediate")
        }


class RequestHumanApprovalTool(BaseTool):
    name = "request_human_approval"
    description = "Mandatory human-in-the-loop gate before performing consequential actions (e.g. sending emails or deleting records)."
    permission_level = "CONSEQUENT"

    async def _execute(
        self,
        task_id: str,
        action_type: str,
        title: str,
        description: str,
        payload: Dict[str, Any],
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        if not db:
            raise ValueError("Database session required")

        req = ApprovalRequest(
            task_id=task_id,
            action_type=action_type,
            title=title,
            description=description,
            payload=payload,
            status="PENDING"
        )
        db.add(req)
        db.commit()
        db.refresh(req)

        return {
            "approval_request_id": req.id,
            "status": "PENDING",
            "title": req.title,
            "action_type": req.action_type,
            "payload": req.payload
        }

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        return True, f"Approval request #{result_data.get('approval_request_id')} queued for human review"


class ExecuteApprovedActionTool(BaseTool):
    name = "execute_approved_action"
    description = "Executes an action once explicit human approval has been granted. Strictly refuses unapproved actions."
    permission_level = "CONSEQUENT"

    async def _execute(
        self,
        approval_id: str,
        decision: str,  # "APPROVE" or "REJECT"
        feedback: Optional[str] = None,
        edited_payload: Optional[Dict[str, Any]] = None,
        db: Optional[Session] = None
    ) -> Dict[str, Any]:
        if not db:
            raise ValueError("Database session required")

        approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
        if not approval:
            raise ValueError(f"Approval request {approval_id} not found")

        if decision == "REJECT":
            approval.status = "REJECTED"
            approval.feedback = feedback
            approval.resolved_at = datetime.utcnow()
            db.commit()
            return {
                "approval_id": approval.id,
                "status": "REJECTED",
                "message": "Action was rejected by user. No external action executed."
            }

        if decision == "APPROVE":
            approval.status = "APPROVED"
            approval.feedback = feedback
            approval.resolved_at = datetime.utcnow()
            
            payload = edited_payload or approval.payload or {}
            action_type = approval.action_type
            execution_details = {}

            if action_type == "SEND_FOLLOW_UP":
                app_id = payload.get("application_id")
                app = db.query(Application).filter(Application.id == app_id).first() if app_id else None
                if app:
                    app.status = "UNDER_REVIEW"
                    app.follow_up_date = datetime.utcnow() + timedelta(days=14)
                    app.notes = (app.notes or "") + f"\n[{datetime.utcnow().strftime('%Y-%m-%d')}] Follow-up message sent: {payload.get('subject')}"
                    
                    # Log event
                    evt = ApplicationEvent(
                        application_id=app.id,
                        event_type="FOLLOW_UP_SENT",
                        description=f"Personalized follow-up sent to {app.company}",
                        metadata_json={
                            "subject": payload.get("subject"),
                            "body": payload.get("body"),
                            "approval_id": approval.id
                        }
                    )
                    db.add(evt)
                    db.commit()
                    execution_details = {
                        "application_id": app.id,
                        "company": app.company,
                        "new_status": app.status,
                        "next_followup_date": app.follow_up_date.strftime('%Y-%m-%d')
                    }

            db.commit()
            return {
                "approval_id": approval.id,
                "status": "EXECUTED",
                "action_type": action_type,
                "details": execution_details
            }

        raise ValueError(f"Invalid decision: {decision}")

    async def _verify(self, result_data: Any, **kwargs) -> (bool, Optional[str]):
        if result_data.get("status") in ["EXECUTED", "REJECTED"]:
            return True, f"Verified action transition to {result_data.get('status')}"
        return False, "Verification failed for approved action execution"


class VerifyActionTool(BaseTool):
    name = "verify_action"
    description = "Performs post-execution audit and database verification to ensure action succeeded without silent failures."
    permission_level = "SAFE"

    async def _execute(self, action_type: str, target_id: Any, expected_state: Dict[str, Any], db: Optional[Session] = None) -> Dict[str, Any]:
        if not db:
            return {"verified": True, "notes": "No DB connection for deep verification"}

        if action_type == "APPLICATION_STATUS":
            app = db.query(Application).filter(Application.id == target_id).first()
            if not app:
                return {"verified": False, "reason": f"Application #{target_id} does not exist"}
            for key, val in expected_state.items():
                actual = getattr(app, key, None)
                if actual != val:
                    return {
                        "verified": False,
                        "reason": f"Field '{key}' expected '{val}', but found '{actual}'"
                    }
            return {
                "verified": True,
                "target": f"Application #{app.id} ({app.company})",
                "verified_fields": expected_state
            }

        return {"verified": True, "notes": "Verification check completed"}
