from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.db.session import get_db
from app.models.entities import Task, AgentAction, ApprovalRequest, AgentRun
from app.schemas.schemas import TaskCreate, TaskResponse, AgentActionResponse, ApprovalRequestResponse, ApprovalDecision
from app.agents.orchestrator import OrchestratorAgent

router = APIRouter(prefix="/agent", tags=["Agent"])

@router.post("/tasks", response_model=TaskResponse)
async def create_agent_task(payload: TaskCreate, db: Session = Depends(get_db)):
    """
    Submits a high-level user goal. Initiates the multi-step agent workflow:
    Understand -> Plan -> Search -> Analyze -> Recommend -> Prepare -> Ask Approval -> Execute -> Verify.
    """
    task = Task(
        user_goal=payload.goal,
        user_id=1,
        status="RUNNING"
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    orchestrator = OrchestratorAgent(db)
    # Execute workflow
    task = await orchestrator.run_workflow(task.id)
    return task

@router.get("/tasks/{task_id}", response_model=TaskResponse)
def get_task_status(task_id: str, db: Session = Depends(get_db)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.get("/tasks/{task_id}/events", response_model=List[AgentActionResponse])
def get_task_actions(task_id: str, db: Session = Depends(get_db)):
    actions = db.query(AgentAction).filter(AgentAction.task_id == task_id).order_by(AgentAction.step_number.asc()).all()
    return actions

@router.get("/approvals", response_model=List[ApprovalRequestResponse])
def list_pending_approvals(db: Session = Depends(get_db)):
    approvals = db.query(ApprovalRequest).filter(ApprovalRequest.status == "PENDING").order_by(ApprovalRequest.created_at.desc()).all()
    return approvals

@router.post("/approvals/{approval_id}/approve")
async def approve_action(approval_id: str, decision: ApprovalDecision, db: Session = Depends(get_db)):
    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    orchestrator = OrchestratorAgent(db)
    res = await orchestrator.handle_approval(approval_id, decision="APPROVE", feedback=decision.feedback)
    return res

@router.post("/approvals/{approval_id}/reject")
async def reject_action(approval_id: str, decision: ApprovalDecision, db: Session = Depends(get_db)):
    approval = db.query(ApprovalRequest).filter(ApprovalRequest.id == approval_id).first()
    if not approval:
        raise HTTPException(status_code=404, detail="Approval request not found")
    
    orchestrator = OrchestratorAgent(db)
    res = await orchestrator.handle_approval(approval_id, decision="REJECT", feedback=decision.feedback)
    return res
