import pytest
import os
import sys
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# Ensure app is importable
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.main import app
from app.db.session import Base, get_db
from app.db.seed import seed_database
from app.services.matching.engine import matching_engine
from app.tools.registry import tool_registry

# Test database
TEST_DATABASE_URL = "sqlite:///./test_taskpilot.db"
test_engine = create_engine(TEST_DATABASE_URL, connect_args={"check_same_thread": False})
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

@pytest.fixture(scope="session", autouse=True)
def setup_test_db():
    Base.metadata.create_all(bind=test_engine)
    db = TestingSessionLocal()
    seed_database(db)
    db.close()
    yield
    Base.metadata.drop_all(bind=test_engine)
    if os.path.exists("./test_taskpilot.db"):
        try:
            os.remove("./test_taskpilot.db")
        except Exception:
            pass

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "healthy"

def test_matching_engine_eligibility():
    profile = {
        "full_name": "Test Student",
        "graduation_year": 2026,
        "gpa": 3.8,
        "skills": ["python", "pytorch", "transformers"],
        "preferred_roles": ["AI/ML Intern"],
        "preferred_locations": ["San Francisco, CA"],
        "remote_preference": "Any"
    }
    opportunity = {
        "title": "AI/ML Research Intern",
        "company": "Google",
        "skills_required": ["Python", "PyTorch", "Transformers", "CUDA"],
        "eligibility": "Currently enrolled student graduating 2026. 3.0 GPA minimum.",
        "remote_type": "Hybrid",
        "location": "San Francisco, CA",
    }
    result = matching_engine.evaluate(profile, opportunity)
    assert result["match_score"] > 80.0
    assert result["eligibility_status"] == "Eligible"
    assert len(result["why_match"]) > 0

def test_tool_registry():
    tools = tool_registry.list_tools()
    assert "search_opportunities" in tools
    assert "calculate_match_score" in tools
    assert "add_to_tracker" in tools
    assert "request_human_approval" in tools
    assert tools["request_human_approval"]["permission_level"] == "CONSEQUENT"
    assert tools["search_opportunities"]["permission_level"] == "SAFE"

def test_list_opportunities_api():
    res = client.get("/api/opportunities")
    assert res.status_code == 200
    opps = res.json()
    assert len(opps) > 0
    first = opps[0]
    assert "company" in first
    assert "match_score" in first
    assert "why_match" in first

def test_list_applications_and_followups_api():
    res = client.get("/api/applications")
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) >= 4

    # Check followups
    res_f = client.get("/api/applications/followups")
    assert res_f.status_code == 200
    followups = res_f.json()
    assert len(followups) >= 2
    overdue_companies = [f["company"] for f in followups]
    assert "Google" in overdue_companies or "Microsoft" in overdue_companies

def test_dashboard_api():
    res = client.get("/api/dashboard")
    assert res.status_code == 200
    data = res.json()
    assert data["active_applications_count"] >= 3
    assert data["followups_due_count"] >= 2
    assert data["total_opportunities_count"] >= 10

def test_agent_workflow_and_approval_gate():
    # 1. Start agent task
    res = client.post("/api/agent/tasks", json={
        "goal": "Find the best AI/ML internships for me and check which applications need follow-up."
    })
    assert res.status_code == 200
    task_data = res.json()
    task_id = task_data["id"]
    assert task_data["status"] == "WAITING_FOR_APPROVAL"
    assert len(task_data["plan"]) == 8

    # 2. Check pending approvals
    res_appr = client.get("/api/agent/approvals")
    assert res_appr.status_code == 200
    approvals = res_appr.json()
    assert len(approvals) >= 1
    approval = approvals[0]
    assert approval["action_type"] == "SEND_FOLLOW_UP"

    # 3. Approve action through Human-in-the-Loop gate
    appr_id = approval["id"]
    res_decision = client.post(f"/api/agent/approvals/{appr_id}/approve", json={
        "decision": "APPROVE",
        "feedback": "Approved to send follow-up."
    })
    assert res_decision.status_code == 200
    dec_data = res_decision.json()
    assert dec_data["success"] is True
    assert dec_data["execution"]["status"] == "EXECUTED"
    assert dec_data["verification"]["verified"] is True
