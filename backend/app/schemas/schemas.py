from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

# --- User & Profile ---
class ProfileBase(BaseModel):
    full_name: str
    university: str
    degree: str
    major: str
    graduation_year: int
    gpa: Optional[float] = None
    skills: List[str] = []
    technologies: List[str] = []
    preferred_roles: List[str] = []
    preferred_locations: List[str] = []
    remote_preference: str = "Any"
    min_stipend: int = 0
    availability: str = "Summer 2025 / Immediate"
    experience_summary: Optional[str] = None
    projects_summary: Optional[str] = None

class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    university: Optional[str] = None
    degree: Optional[str] = None
    major: Optional[str] = None
    graduation_year: Optional[int] = None
    gpa: Optional[float] = None
    skills: Optional[List[str]] = None
    preferred_roles: Optional[List[str]] = None
    preferred_locations: Optional[List[str]] = None
    remote_preference: Optional[str] = None
    min_stipend: Optional[int] = None
    availability: Optional[str] = None

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# --- Opportunity ---
class OpportunityBase(BaseModel):
    title: str
    company: str
    description: str
    location: str
    remote_type: str = "Hybrid"
    skills_required: List[str] = []
    eligibility: str
    deadline: Optional[datetime] = None
    stipend: Optional[str] = None
    application_url: str
    source: str = "MockOpportunitySource"
    opportunity_type: str = "internship"
    status: str = "ACTIVE"

class OpportunityResponse(OpportunityBase):
    id: int
    discovered_at: datetime
    match_score: Optional[float] = None
    match_reason: Optional[str] = None
    eligibility_status: Optional[str] = None  # Eligible, Probably eligible, Needs verification, Not eligible
    why_match: Optional[List[str]] = None
    potential_gaps: Optional[List[str]] = None

    class Config:
        from_attributes = True

# --- Application Event ---
class ApplicationEventResponse(BaseModel):
    id: int
    application_id: int
    event_type: str
    description: str
    metadata_json: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        from_attributes = True

# --- Application ---
class ApplicationCreate(BaseModel):
    opportunity_id: Optional[int] = None
    company: str
    role: str
    status: str = "SHORTLISTED"
    match_score: float = 0.0
    match_reason: Optional[str] = None
    applied_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    application_url: Optional[str] = None
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None
    applied_date: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None

class ApplicationResponse(BaseModel):
    id: int
    user_id: int
    opportunity_id: Optional[int] = None
    company: str
    role: str
    status: str
    match_score: float
    match_reason: Optional[str] = None
    applied_date: Optional[datetime] = None
    deadline: Optional[datetime] = None
    follow_up_date: Optional[datetime] = None
    application_url: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    events: List[ApplicationEventResponse] = []

    class Config:
        from_attributes = True

# --- Approval Request ---
class ApprovalRequestResponse(BaseModel):
    id: str
    task_id: str
    title: str
    description: str
    action_type: str
    payload: Dict[str, Any]
    status: str
    feedback: Optional[str] = None
    created_at: datetime
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class ApprovalDecision(BaseModel):
    decision: str  # "APPROVE" or "REJECT"
    feedback: Optional[str] = None
    edited_payload: Optional[Dict[str, Any]] = None

# --- Agent Action & Run ---
class AgentActionResponse(BaseModel):
    id: int
    agent_run_id: Optional[int] = None
    task_id: str
    step_number: int
    tool_name: str
    input_params: Dict[str, Any]
    output_result: Dict[str, Any]
    status: str
    permission_level: str
    execution_time_ms: int
    created_at: datetime

    class Config:
        from_attributes = True

# --- Task ---
class TaskCreate(BaseModel):
    goal: str

class TaskResponse(BaseModel):
    id: str
    user_goal: str
    status: str
    current_step: int
    total_steps: int
    plan: List[Dict[str, Any]] = []
    tool_calls: List[Dict[str, Any]] = []
    results: Dict[str, Any] = {}
    final_summary: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    approval_requests: List[ApprovalRequestResponse] = []

    class Config:
        from_attributes = True

# --- Dashboard Overview ---
class DashboardOverview(BaseModel):
    active_applications_count: int
    shortlisted_count: int
    followups_due_count: int
    interviews_count: int
    offers_count: int
    total_opportunities_count: int
    pending_approvals_count: int
    recent_applications: List[ApplicationResponse] = []
    recent_actions: List[AgentActionResponse] = []
    pending_approvals: List[ApprovalRequestResponse] = []
