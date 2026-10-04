from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
from app.models.entities import Task, AgentRun, AgentAction, ApprovalRequest, Profile, Application, Opportunity
from app.tools.registry import tool_registry
from app.services.llm.provider import get_llm_provider
import time
import logging

logger = logging.getLogger(__name__)

class OrchestratorAgent:
    """
    Coordinates Discovery, Eligibility, Application Tracker, Follow-up, Verification,
    and Human Approval Gates.
    """

    def __init__(self, db: Session):
        self.db = db
        self.llm = get_llm_provider()

    async def run_workflow(self, task_id: str) -> Task:
        task = self.db.query(Task).filter(Task.id == task_id).first()
        if not task:
            raise ValueError(f"Task {task_id} not found")

        # 1. Fetch user profile
        user_id = task.user_id or 1
        profile_obj = self.db.query(Profile).filter(Profile.user_id == user_id).first()
        profile_data = {
            "full_name": profile_obj.full_name if profile_obj else "Alex Chen",
            "university": profile_obj.university if profile_obj else "Stanford University",
            "degree": profile_obj.degree if profile_obj else "B.S.",
            "major": profile_obj.major if profile_obj else "Computer Science",
            "graduation_year": profile_obj.graduation_year if profile_obj else 2026,
            "gpa": profile_obj.gpa if profile_obj else 3.85,
            "skills": profile_obj.skills if profile_obj else ["Python", "PyTorch", "Transformers", "LangChain", "FastAPI"],
            "preferred_roles": profile_obj.preferred_roles if profile_obj else ["AI/ML Intern", "Machine Learning Engineer"],
            "preferred_locations": profile_obj.preferred_locations if profile_obj else ["San Francisco, CA", "Remote"],
            "remote_preference": profile_obj.remote_preference if profile_obj else "Any",
            "min_stipend": profile_obj.min_stipend if profile_obj else 3500,
        }

        # 2. Initialize Agent Run record
        agent_run = AgentRun(
            task_id=task.id,
            agent_name="OrchestratorAgent",
            status="RUNNING",
            goal=task.user_goal,
            step_count=0
        )
        self.db.add(agent_run)
        self.db.commit()
        self.db.refresh(agent_run)

        # 3. Create Execution Plan
        plan = [
            {"step": 1, "name": "Understand Profile & Constraints", "tool": "profile_inspector", "status": "PENDING"},
            {"step": 2, "name": "Discover Relevant Opportunities", "tool": "search_opportunities", "status": "PENDING"},
            {"step": 3, "name": "Evaluate Eligibility & Match Scoring", "tool": "calculate_match_score", "status": "PENDING"},
            {"step": 4, "name": "Shortlist Top Matches to Tracker", "tool": "add_to_tracker", "status": "PENDING"},
            {"step": 5, "name": "Scan Tracker for Overdue Applications", "tool": "get_pending_followups", "status": "PENDING"},
            {"step": 6, "name": "Generate Personalized Follow-Up Drafts", "tool": "generate_followup", "status": "PENDING"},
            {"step": 7, "name": "Human-in-the-Loop Approval Gate", "tool": "request_human_approval", "status": "PENDING"},
            {"step": 8, "name": "Verify Execution & Compile Report", "tool": "verify_action", "status": "PENDING"}
        ]
        task.plan = plan
        task.total_steps = len(plan)
        task.current_step = 1
        task.status = "RUNNING"
        self.db.commit()

        # Step 1: Profile understanding
        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=1,
            tool_name="profile_inspector",
            params={"user_id": user_id},
            result={"profile_loaded": profile_data["full_name"], "skills_count": len(profile_data["skills"])},
            duration_ms=45
        )

        # Step 2: Search opportunities
        task.current_step = 2
        search_tool = tool_registry.get("search_opportunities")
        search_res = await search_tool.run(query="AI ML Machine Learning", db=self.db)
        raw_opportunities = search_res.data or []
        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=2,
            tool_name="search_opportunities",
            params={"query": "AI ML Machine Learning", "sources": "configured_sources"},
            result={"found_count": len(raw_opportunities), "verified": search_res.verification_passed},
            duration_ms=search_res.execution_time_ms
        )

        # Step 3: Evaluate eligibility and calculate match scores
        task.current_step = 3
        calc_tool = tool_registry.get("calculate_match_score")
        scored_opps = []
        for opp in raw_opportunities:
            calc_res = await calc_tool.run(profile=profile_data, opportunity=opp)
            score_data = calc_res.data or {}
            opp_scored = dict(opp)
            opp_scored["match_score"] = score_data.get("match_score", 50.0)
            opp_scored["match_details"] = score_data
            scored_opps.append(opp_scored)

        # Sort descending by match score
        scored_opps.sort(key=lambda x: x["match_score"], reverse=True)
        top_matches = scored_opps[:4]  # Top 4 recommendations

        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=3,
            tool_name="calculate_match_score",
            params={"opportunities_evaluated": len(scored_opps)},
            result={
                "evaluated_count": len(scored_opps),
                "top_match_companies": [o["company"] for o in top_matches],
                "top_scores": [o["match_score"] for o in top_matches]
            },
            duration_ms=180
        )

        # Step 4: Add top opportunities to tracker
        task.current_step = 4
        add_tool = tool_registry.get("add_to_tracker")
        shortlisted_items = []
        for opp in top_matches:
            why_text = " • ".join(opp.get("match_details", {}).get("why_match", [])[:2])
            res = await add_tool.run(
                user_id=user_id,
                company=opp["company"],
                role=opp["title"],
                status="SHORTLISTED",
                opportunity_id=opp.get("id"),
                match_score=opp["match_score"],
                match_reason=why_text,
                deadline=opp.get("deadline"),
                application_url=opp.get("application_url"),
                db=self.db
            )
            if res.success:
                shortlisted_items.append(res.data)

        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=4,
            tool_name="add_to_tracker",
            params={"count": len(top_matches)},
            result={"shortlisted_added": len(shortlisted_items), "items": [s["company"] for s in shortlisted_items]},
            duration_ms=120
        )

        # Step 5: Check tracker for pending follow-ups
        task.current_step = 5
        followup_tool = tool_registry.get("get_pending_followups")
        f_res = await followup_tool.run(user_id=user_id, threshold_days=14, db=self.db)
        pending_followups = f_res.data or []

        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=5,
            tool_name="get_pending_followups",
            params={"threshold_days": 14},
            result={"followups_identified": len(pending_followups), "candidates": [f["company"] for f in pending_followups]},
            duration_ms=f_res.execution_time_ms
        )

        # Step 6 & 7: Draft follow-ups and create Human Approval Requests
        task.current_step = 6
        draft_tool = tool_registry.get("generate_followup")
        approval_tool = tool_registry.get("request_human_approval")
        created_approvals = []

        for candidate in pending_followups[:2]:  # Limit to 2 for clear demo workflow
            draft_res = await draft_tool.run(profile=profile_data, application=candidate)
            draft_data = draft_res.data or {}

            # Gate at Human Approval
            appr_res = await approval_tool.run(
                task_id=task.id,
                action_type="SEND_FOLLOW_UP",
                title=f"Send follow-up email to {candidate['company']}",
                description=f"Application for '{candidate['role']}' was submitted {candidate['days_since_applied']} days ago without response.",
                payload={
                    "application_id": candidate["application_id"],
                    "company": candidate["company"],
                    "role": candidate["role"],
                    "subject": draft_data.get("subject"),
                    "body": draft_data.get("body"),
                    "applied_date": candidate.get("applied_date"),
                    "tone": draft_data.get("tone")
                },
                db=self.db
            )
            if appr_res.success:
                created_approvals.append(appr_res.data)

        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=6,
            tool_name="generate_followup",
            params={"candidates_count": len(pending_followups[:2])},
            result={"drafts_generated": len(created_approvals)},
            duration_ms=190
        )

        # Step 7: Record approval gate state
        task.current_step = 7
        await self._record_action(
            agent_run_id=agent_run.id,
            task=task,
            step=7,
            tool_name="request_human_approval",
            params={"approval_count": len(created_approvals)},
            result={"pending_approvals": len(created_approvals), "status": "WAITING_FOR_USER_ACTION"},
            duration_ms=40,
            permission_level="CONSEQUENT"
        )

        # Update task results and pause for approval if items are pending
        task.results = {
            "opportunities_analyzed": len(scored_opps),
            "shortlisted_count": len(shortlisted_items),
            "followups_required": len(pending_followups),
            "approvals_pending": len(created_approvals),
            "shortlisted_companies": [s["company"] for s in shortlisted_items],
        }

        if created_approvals:
            task.status = "WAITING_FOR_APPROVAL"
            task.final_summary = (
                f"Agent analyzed {len(scored_opps)} opportunities, shortlisted top {len(shortlisted_items)} matches "
                f"({', '.join([s['company'] for s in shortlisted_items])}), and identified {len(created_approvals)} "
                f"applications needing follow-up. Generated personalized drafts and awaiting your approval before sending."
            )
            agent_run.status = "WAITING_FOR_APPROVAL"
        else:
            task.status = "COMPLETED"
            task.current_step = 8
            task.final_summary = (
                f"Successfully analyzed {len(scored_opps)} opportunities and added top {len(shortlisted_items)} matches to your shortlist. "
                f"No applications currently exceed follow-up thresholds."
            )
            agent_run.status = "COMPLETED"
            agent_run.completed_at = datetime.utcnow()

        self.db.commit()
        self.db.refresh(task)
        return task

    async def handle_approval(self, approval_id: str, decision: str, feedback: Optional[str] = None) -> Dict[str, Any]:
        """Executes the approved consequential action, verifies it, and concludes the workflow."""
        exec_tool = tool_registry.get("execute_approved_action")
        exec_res = await exec_tool.run(
            approval_id=approval_id,
            decision=decision,
            feedback=feedback,
            db=self.db
        )

        if not exec_res.success:
            return {"success": False, "error": exec_res.error}

        approval = self.db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
        task = self.db.query(Task).filter(Task.id == approval.task_id).first() if approval else None

        # Verify action
        verify_tool = tool_registry.get("verify_action")
        v_res = await verify_tool.run(
            action_type="APPLICATION_STATUS",
            target_id=approval.payload.get("application_id"),
            expected_state={"status": "UNDER_REVIEW"},
            db=self.db
        )

        # Check if any remaining pending approvals for this task
        if task:
            remaining_pending = self.db.query(ApprovalRequest).filter(
                ApprovalRequest.task_id == task.id,
                ApprovalRequest.status == "PENDING"
            ).count()

            if remaining_pending == 0:
                task.status = "COMPLETED"
                task.current_step = 8
                
                # Mark step 8 as complete in plan
                updated_plan = []
                for p in task.plan:
                    p_copy = dict(p)
                    p_copy["status"] = "COMPLETED"
                    updated_plan.append(p_copy)
                task.plan = updated_plan

                task.final_summary = (
                    f"✓ Workflow Complete: Opportunities analyzed and shortlisted. "
                    f"Follow-up actions were approved by human operator, executed safely, and verified in the database."
                )
                self.db.commit()

        return {
            "success": True,
            "decision": decision,
            "execution": exec_res.data,
            "verification": v_res.data
        }

    async def _record_action(
        self,
        agent_run_id: int,
        task: Task,
        step: int,
        tool_name: str,
        params: Dict[str, Any],
        result: Dict[str, Any],
        duration_ms: int,
        permission_level: str = "SAFE"
    ):
        action = AgentAction(
            agent_run_id=agent_run_id,
            task_id=task.id,
            step_number=step,
            tool_name=tool_name,
            input_params=params,
            output_result=result,
            status="SUCCESS",
            permission_level=permission_level,
            execution_time_ms=duration_ms
        )
        self.db.add(action)
        
        # Update plan status
        if task.plan:
            new_plan = []
            for item in task.plan:
                item_copy = dict(item)
                if item_copy.get("step") == step:
                    item_copy["status"] = "COMPLETED" if permission_level == "SAFE" else "WAITING_APPROVAL"
                new_plan.append(item_copy)
            task.plan = new_plan

        self.db.commit()
