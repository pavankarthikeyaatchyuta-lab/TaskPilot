from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.db.seed import reset_demo_data
from app.models.entities import Task
from app.schemas.schemas import TaskResponse
from app.agents.orchestrator import OrchestratorAgent

router = APIRouter(prefix="/demo", tags=["Demo"])

@router.post("/reset")
def reset_demo(db: Session = Depends(get_db)):
    """Resets database to pristine benchmark state for the 3-minute judge demo."""
    reset_demo_data(db)
    return {
        "status": "success",
        "message": "TaskPilot database cleanly reset with demo profile, 14 opportunities, and 2 overdue applications."
    }

@router.post("/run", response_model=TaskResponse)
async def run_judge_demo(db: Session = Depends(get_db)):
    """
    Executes the canonical judge demonstration workflow:
    'Find the best AI/ML internships for me and manage my pending applications.'
    """
    goal = "Find the best AI/ML internships for me and manage my pending applications."
    task = Task(
        user_goal=goal,
        user_id=1,
        status="RUNNING"
    )
    db.add(task)
    db.commit()
    db.refresh(task)

    orchestrator = OrchestratorAgent(db)
    task = await orchestrator.run_workflow(task.id)
    return task
