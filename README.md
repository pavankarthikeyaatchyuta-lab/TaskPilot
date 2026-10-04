# TaskPilot — Agentic AI Opportunity & Internship Management Platform

> **WCC Launchpad 30 — Agentic AI Track**  
> An autonomous multi-step opportunity management system that converts high-level student goals into executable plans, conducts deep eligibility matching, manages application pipelines, flags overdue follow-ups, and operates with a strict **Human-in-the-Loop Approval Gate**.

[![Tests](https://img.shields.io/badge/tests-7%20passed-emerald)](file:///backend/tests/test_backend.py)
[![Frontend](https://img.shields.io/badge/frontend-Next.js%2014-indigo)](file:///frontend)
[![Backend](https://img.shields.io/badge/backend-FastAPI%20%2B%20SQLAlchemy-blue)](file:///backend)
[![License](https://img.shields.io/badge/license-MIT-slate)](LICENSE)

---

## 1. System Architecture

TaskPilot implements an autonomous agent orchestration pipeline:

**UNDERSTAND → PLAN → SEARCH → ANALYZE → RECOMMEND → PREPARE → ASK APPROVAL → EXECUTE → VERIFY**

```text
                    ┌─────────────────────────┐
                    │        USER GOAL        │
                    │  "Find AI/ML internships│
                    │   & manage follow-ups"  │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │   ORCHESTRATOR AGENT    │
                    │   (Plan & Workflow)     │
                    └────────────┬────────────┘
                                 ↓
          ┌──────────────────────┼──────────────────────┐
          ↓                      ↓                      ↓
   ┌─────────────┐        ┌─────────────┐        ┌─────────────┐
   │  Discovery  │        │ Eligibility │        │ Application │
   │    Agent    │        │    Agent    │        │    Agent    │
   └─────────────┘        └─────────────┘        └─────────────┘
          ↓                      ↓                      ↓
   Search Sources         Profile Match          Tracker / Docs
   (Mock/Public Web)      Explainable Scores     Overdue Detection
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │   VERIFICATION AGENT    │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │ HUMAN APPROVAL GATE 🛡️   │
                    │ (Consequent Actions)    │
                    └────────────┬────────────┘
                                 ↓
                    ┌─────────────────────────┐
                    │      ACTION TOOLS       │
                    │ (Send Email, Verify DB) │
                    └─────────────────────────┘
```

---

## 2. Core Highlights

1. **Autonomous Orchestration**: The Orchestrator converts a user goal into an 8-step plan, maintains workflow state across tools, and provides a visible execution audit log.
2. **Transparent Match Scoring**: Evaluates candidate profile against opportunities across Skill Match (35%), Eligibility (25%), Role Preference (15%), Location (15%), and Urgency (10%). Produces explainable reasoning:
   - `✓ AI/ML skills match`
   - `✓ Enrolled student eligibility satisfied`
   - `⚠ TensorFlow experience preferred`
3. **Automated Follow-up Agent**: Detects applications exceeding the configured follow-up threshold (14 days of silence), drafts personalized follow-up emails highlighting candidate skills and specific roles.
4. **Mandatory Human-in-the-Loop Gate**: Distinguishes between **SAFE** actions (search, scoring, ranking, internal tracking) and **CONSEQUENT** actions (sending emails, modifying records). Consequential actions pause execution until explicitly reviewed, edited, and approved by the user.
5. **Post-Action Verification**: Every executed action is checked against database state to guarantee integrity and eliminate hallucinations.
6. **Deterministic Offline Demo Mode**: Fully functional without external API keys or fragile web scrapers, while supporting plug-and-play OpenAI and Groq LLMs.

---

## 3. Quick Start (Run Locally)

### Prerequisites
- **Node.js**: v18+ (tested on v24)
- **Python**: 3.10+ (tested on 3.13)
- **Git**

### One-Command Launch (Windows PowerShell)
```powershell
.\scripts\run_all.ps1
```
*(Or double-click `scripts\run_all.bat`)*

---

### Manual Setup

#### Step 1: Clone Repository
```bash
git clone https://github.com/pavankarthikeyaatchyuta-lab/TaskPilot.git
cd TaskPilot
```

#### Step 2: Backend Setup
```bash
cd backend
python -m venv venv

# Windows
.\venv\Scripts\activate

# Mac/Linux
# source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
- API Base: `http://127.0.0.1:8000`
- Swagger Interactive Docs: `http://127.0.0.1:8000/docs`

#### Step 3: Frontend Setup
In a new terminal:
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:3000`

---

## 4. The 3-Minute Judge Demo Walkthrough

Click the **"Run 3-Min Judge Demo"** button on the top right navigation bar (or submit the prompt *"Find the best AI/ML internships for me and manage my pending applications"*):

1. **Scene 1 — Student Profile**: Profile loaded for candidate **Alex Chen** (CS student, PyTorch, Transformers, LangChain, 3.88 GPA).
2. **Scene 2 — Agent Planning**: Orchestrator builds the 8-step plan and begins multi-step tool execution.
3. **Scene 3 — Opportunity Radar**: 14+ opportunities evaluated; top matches (Google DeepMind, Anthropic, Meta, Databricks) scored at 88%–95% with explainable match reasons.
4. **Scene 4 — Shortlist Tracking**: Top opportunities automatically added to the pipeline tracker.
5. **Scene 5 — Follow-up Detection**: Agent inspects pipeline and detects 2 overdue applications (>14 days silence from Google and Microsoft).
6. **Scene 6 — Personalized Email Generation**: Follow-up Agent drafts tailored, professional messages.
7. **Scene 7 — Human Approval Gate**: Workflow pauses safely with status `WAITING_FOR_APPROVAL`. The **Human Approval Gate** modal opens automatically.
8. **Scene 8 — Review & Authorization**:
   - Inspect the drafted email body, recipient, and tone.
   - Click **[Edit Email Draft]** if desired.
   - Click **[Authorize & Send]**.
9. **Scene 9 — Verification & Report**:
   - Action is executed and verified in the database.
   - Application status updates to `UNDER_REVIEW`.
   - Agent reports completion summary.

---

## 5. Agent Tool Contracts

All tools inherit from `BaseTool` with strict typed input/output schemas and execution timing:

| Tool | Permission | Purpose | Verification |
|---|---|---|---|
| `search_opportunities` | SAFE | Searches opportunities across configured sources | Validates count & schema |
| `evaluate_eligibility` | SAFE | Evaluates student degree, GPA, and graduation year | Confirms eligibility status |
| `calculate_match_score` | SAFE | Weighted scoring (0-100%) with explainable breakdown | Checks score bounds |
| `add_to_tracker` | SAFE | Adds shortlisted opportunity to career pipeline | Verifies DB record persistence |
| `update_application` | SAFE | Transitions lifecycle stages (Interview, Offer, etc.) | Verifies DB status transition |
| `get_pending_followups`| SAFE | Identifies applications past 14-day silence threshold | Confirms threshold delta |
| `generate_followup` | SAFE | Crafts personalized, polite email draft | Validates subject & body |
| `request_human_approval`| CONSEQUENT | Queues consequential actions at the human gate | Checks pending gate queue |
| `execute_approved_action`| CONSEQUENT | Executes action only after human authorization | Confirms user decision token |
| `verify_action` | SAFE | Post-execution database consistency audit | Validates DB field state |

---

## 6. API Reference

### Agent Orchestration
- `POST /api/agent/tasks` — Submit user goal and trigger agent workflow
- `GET /api/agent/tasks/{id}` — Fetch plan, current step, and execution summary
- `GET /api/agent/tasks/{id}/events` — Stream transparent tool execution audit records
- `GET /api/agent/approvals` — List actions awaiting human approval
- `POST /api/agent/approvals/{id}/approve` — Authorize action execution
- `POST /api/agent/approvals/{id}/reject` — Deny action execution

### Opportunities & Pipeline
- `GET /api/opportunities` — List opportunities with on-the-fly match scores & filters
- `GET /api/opportunities/{id}` — Opportunity details and requirement breakdown
- `GET /api/applications` — Kanban pipeline applications
- `GET /api/applications/followups` — List overdue applications needing follow-up
- `POST /api/applications` — Add application to tracker
- `PATCH /api/applications/{id}` — Update application stage, dates, or notes

### Candidate Profile & Demo
- `GET /api/profile` — Fetch candidate profile and preferences
- `PATCH /api/profile` — Update candidate skills, roles, and criteria
- `GET /api/dashboard` — Metric counts, recent actions, and pending tasks
- `POST /api/demo/run` — Run canonical judge demonstration workflow
- `POST /api/demo/reset` — Reset database to initial benchmark state

---

## 7. Testing & Quality Assurance

Run the comprehensive automated test suite:
```bash
# In backend/
pytest tests/ -v
```
All 7 unit and integration tests verify:
- Health check & database initialization
- Explainable eligibility calculation
- Tool registry and permission level enforcement
- Dynamic opportunity match scoring
- Application pipeline & overdue follow-up detection
- Complete end-to-end agent workflow, pause at human approval gate, execution, and verification

---

## 8. License
MIT © 2026 TaskPilot Authors