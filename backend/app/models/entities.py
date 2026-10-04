from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.db.session import Base
import uuid

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("Profile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="user", cascade="all, delete-orphan")
    tasks = relationship("Task", back_populates="user", cascade="all, delete-orphan")


class Profile(Base):
    __tablename__ = "profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True)
    full_name = Column(String(255), nullable=False)
    university = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=False)
    major = Column(String(255), nullable=False)
    graduation_year = Column(Integer, nullable=False)
    gpa = Column(Float, nullable=True)
    
    # JSON Lists & preferences
    skills = Column(JSON, default=list)  # e.g. ["Python", "PyTorch", "Transformers", ...]
    technologies = Column(JSON, default=list)
    preferred_roles = Column(JSON, default=list)  # e.g. ["AI/ML Intern", "Software Engineering Intern"]
    preferred_locations = Column(JSON, default=list)  # e.g. ["San Francisco, CA", "Remote", "New York, NY"]
    remote_preference = Column(String(50), default="Any")  # "Remote Only", "Hybrid", "Any"
    min_stipend = Column(Integer, default=0)
    availability = Column(String(100), default="Summer 2025 / Immediate")
    experience_summary = Column(Text, nullable=True)
    projects_summary = Column(Text, nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="profile")


class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    company = Column(String(255), nullable=False, index=True)
    description = Column(Text, nullable=False)
    location = Column(String(255), nullable=False)
    remote_type = Column(String(50), default="Hybrid")  # "Remote", "Hybrid", "On-site"
    skills_required = Column(JSON, default=list)
    eligibility = Column(Text, nullable=False)
    deadline = Column(DateTime, nullable=True)
    stipend = Column(String(100), nullable=True)
    application_url = Column(String(500), nullable=False)
    source = Column(String(100), default="MockOpportunitySource")
    opportunity_type = Column(String(50), default="internship")  # "internship", "hackathon", "scholarship", "research", "job"
    status = Column(String(50), default="ACTIVE")
    discovered_at = Column(DateTime, default=datetime.utcnow)

    applications = relationship("Application", back_populates="opportunity")


class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id"), nullable=True)
    company = Column(String(255), nullable=False, index=True)
    role = Column(String(255), nullable=False)
    status = Column(String(50), default="SHORTLISTED", index=True) 
    # DISCOVERED, SHORTLISTED, PREPARING, APPLIED, UNDER_REVIEW, INTERVIEW, OFFER, REJECTED, FOLLOW_UP_REQUIRED, CLOSED
    match_score = Column(Float, default=0.0)
    match_reason = Column(Text, nullable=True)
    applied_date = Column(DateTime, nullable=True)
    deadline = Column(DateTime, nullable=True)
    follow_up_date = Column(DateTime, nullable=True)
    application_url = Column(String(500), nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="applications")
    opportunity = relationship("Opportunity", back_populates="applications")
    events = relationship("ApplicationEvent", back_populates="application", cascade="all, delete-orphan")


class ApplicationEvent(Base):
    __tablename__ = "application_events"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("applications.id"), nullable=False)
    event_type = Column(String(50), nullable=False)  # "STATUS_CHANGE", "FOLLOW_UP_SENT", "EMAIL_DRAFTED", "VERIFIED", "NOTE_ADDED"
    description = Column(Text, nullable=False)
    metadata_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

    application = relationship("Application", back_populates="events")


class Task(Base):
    __tablename__ = "tasks"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_goal = Column(Text, nullable=False)
    status = Column(String(50), default="RUNNING") 
    # PLANNING, RUNNING, WAITING_FOR_APPROVAL, COMPLETED, PARTIALLY_COMPLETED, FAILED
    current_step = Column(Integer, default=0)
    total_steps = Column(Integer, default=0)
    plan = Column(JSON, default=list)  # list of {step: int, name: str, status: str, tool: str}
    tool_calls = Column(JSON, default=list)
    results = Column(JSON, default=dict)
    final_summary = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    user = relationship("User", back_populates="tasks")
    agent_runs = relationship("AgentRun", back_populates="task", cascade="all, delete-orphan")
    approval_requests = relationship("ApprovalRequest", back_populates="task", cascade="all, delete-orphan")


class AgentRun(Base):
    __tablename__ = "agent_runs"

    id = Column(Integer, primary_key=True, index=True)
    task_id = Column(String(64), ForeignKey("tasks.id"), nullable=False)
    agent_name = Column(String(100), nullable=False)
    status = Column(String(50), default="RUNNING")  # RUNNING, COMPLETED, FAILED, WAITING_FOR_APPROVAL
    goal = Column(Text, nullable=False)
    step_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="agent_runs")
    actions = relationship("AgentAction", back_populates="agent_run", cascade="all, delete-orphan")


class AgentAction(Base):
    __tablename__ = "agent_actions"

    id = Column(Integer, primary_key=True, index=True)
    agent_run_id = Column(Integer, ForeignKey("agent_runs.id"), nullable=True)
    task_id = Column(String(64), nullable=False)
    step_number = Column(Integer, default=1)
    tool_name = Column(String(100), nullable=False)
    input_params = Column(JSON, default=dict)
    output_result = Column(JSON, default=dict)
    status = Column(String(50), default="SUCCESS")  # SUCCESS, FAILED, PENDING_APPROVAL
    permission_level = Column(String(50), default="SAFE")  # SAFE, CONSEQUENT
    execution_time_ms = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    agent_run = relationship("AgentRun", back_populates="actions")


class ApprovalRequest(Base):
    __tablename__ = "approval_requests"

    id = Column(String(64), primary_key=True, default=generate_uuid)
    task_id = Column(String(64), ForeignKey("tasks.id"), nullable=False)
    agent_action_id = Column(Integer, nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    action_type = Column(String(100), nullable=False)  # "SEND_FOLLOW_UP", "SUBMIT_APPLICATION", "UPDATE_PROFILE"
    payload = Column(JSON, default=dict)  # contains application_id, recipient, draft_subject, draft_body, company, role
    status = Column(String(50), default="PENDING")  # PENDING, APPROVED, REJECTED
    feedback = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    task = relationship("Task", back_populates="approval_requests")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    notification_type = Column(String(50), default="SYSTEM")
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
