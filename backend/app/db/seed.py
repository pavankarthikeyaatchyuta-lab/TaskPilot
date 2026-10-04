from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.db.session import engine, SessionLocal, Base
from app.models.entities import (
    User, Profile, Opportunity, Application, ApplicationEvent, Task, AgentRun, AgentAction, ApprovalRequest, Notification
)
from app.services.discovery.sources import MockOpportunitySource
import logging

logger = logging.getLogger(__name__)

def seed_database(db: Session):
    # Ensure tables exist
    Base.metadata.create_all(bind=engine)

    # Check if already seeded
    existing_user = db.query(User).filter(User.email == "alex.chen@stanford.edu").first()
    if existing_user:
        logger.info("Database already seeded with default user.")
        return existing_user

    now = datetime.utcnow()

    # 1. Create Default User
    user = User(
        email="alex.chen@stanford.edu",
        name="Alex Chen",
        created_at=now - timedelta(days=60)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    # 2. Create User Profile
    profile = Profile(
        user_id=user.id,
        full_name="Alex Chen",
        university="Stanford University",
        degree="B.S. in Computer Science",
        major="Artificial Intelligence & Systems",
        graduation_year=2026,
        gpa=3.88,
        skills=["Python", "PyTorch", "Transformers", "LangChain", "FastAPI", "Docker", "SQL", "Git", "C++"],
        technologies=["Linux", "CUDA", "PostgreSQL", "Next.js", "Tailwind CSS"],
        preferred_roles=["AI/ML Intern", "Machine Learning Engineer Intern", "AI Research Intern", "Software Engineering Intern - AI"],
        preferred_locations=["San Francisco, CA", "Mountain View, CA", "Seattle, WA", "Remote"],
        remote_preference="Hybrid",
        min_stipend=3500,
        availability="Summer 2025 (June - Sept)",
        experience_summary="Undergraduate AI Researcher at Stanford AI Lab focusing on efficient transformer fine-tuning. Previously Software Engineering Fellow at HackAI.",
        projects_summary="AgentFlow: Autonomous multi-agent coordination benchmark in PyTorch; DistillVision: Compressed multimodal transformer for edge devices."
    )
    db.add(profile)
    db.commit()

    # 3. Seed Opportunities from MockOpportunitySource
    source = MockOpportunitySource()
    for opp_data in source.opportunities:
        existing_opp = db.query(Opportunity).filter(
            Opportunity.company == opp_data["company"],
            Opportunity.title == opp_data["title"]
        ).first()
        if not existing_opp:
            opp = Opportunity(
                title=opp_data["title"],
                company=opp_data["company"],
                description=opp_data["description"],
                location=opp_data["location"],
                remote_type=opp_data["remote_type"],
                skills_required=opp_data["skills_required"],
                eligibility=opp_data["eligibility"],
                deadline=opp_data["deadline"],
                stipend=opp_data["stipend"],
                application_url=opp_data["application_url"],
                source=opp_data["source"],
                opportunity_type=opp_data["opportunity_type"],
                status=opp_data["status"],
                discovered_at=now - timedelta(days=3)
            )
            db.add(opp)
    db.commit()

    # 4. Seed Applications in various states (including 2 that require follow-up > 14 days)
    app1 = Application(
        user_id=user.id,
        company="Google",
        role="AI/ML Research Intern",
        status="APPLIED",
        match_score=94.5,
        match_reason="Strong alignment with PyTorch, Transformers, and Research experience",
        applied_date=now - timedelta(days=18),  # 18 days ago -> OVERDUE (>14d threshold)
        deadline=now + timedelta(days=20),
        application_url="https://careers.google.com/jobs/results/aiml-intern-summer",
        notes="Applied via student portal. First round screening awaited."
    )
    db.add(app1)

    app2 = Application(
        user_id=user.id,
        company="Microsoft",
        role="Applied AI Research Intern",
        status="UNDER_REVIEW",
        match_score=91.0,
        match_reason="Matches LangChain, Python, and Agentic system skills",
        applied_date=now - timedelta(days=16),  # 16 days ago -> OVERDUE (>14d threshold)
        deadline=now + timedelta(days=25),
        application_url="https://careers.microsoft.com/us/en/job/applied-ai-intern",
        notes="Resume submitted with project portfolio."
    )
    db.add(app2)

    app3 = Application(
        user_id=user.id,
        company="Meta",
        role="Machine Learning Engineer Intern - Foundation Models",
        status="INTERVIEW",
        match_score=88.5,
        match_reason="Matched distributed training and PyTorch foundations",
        applied_date=now - timedelta(days=9),
        deadline=now + timedelta(days=21),
        application_url="https://metacareers.com/jobs/mle-intern-foundation-models",
        notes="Technical screen scheduled for next Tuesday."
    )
    db.add(app3)

    app4 = Application(
        user_id=user.id,
        company="Databricks",
        role="Machine Learning Platform Intern",
        status="PREPARING",
        match_score=85.0,
        match_reason="Matches Docker, SQL, and FastAPI skillset",
        applied_date=None,
        deadline=now + timedelta(days=19),
        application_url="https://databricks.com/company/careers/ml-platform-intern",
        notes="Tailoring resume bullet points to highlight MLflow project."
    )
    db.add(app4)
    db.commit()

    # Add initial history events for app1 and app2
    for app, days in [(app1, 18), (app2, 16), (app3, 9)]:
        evt = ApplicationEvent(
            application_id=app.id,
            event_type="STATUS_CHANGE",
            description=f"Application submitted {days} days ago",
            metadata_json={"applied_days_ago": days},
            created_at=now - timedelta(days=days)
        )
        db.add(evt)
    db.commit()

    logger.info("Successfully seeded TaskPilot demo data.")
    return user

def reset_demo_data(db: Session):
    """Cleanly resets demo applications and tasks to initial benchmark state for the judge."""
    db.query(AgentAction).delete()
    db.query(AgentRun).delete()
    db.query(ApprovalRequest).delete()
    db.query(ApplicationEvent).delete()
    db.query(Application).delete()
    db.query(Task).delete()
    db.query(Profile).delete()
    db.query(Opportunity).delete()
    db.query(User).delete()
    db.commit()
    return seed_database(db)

if __name__ == "__main__":
    db = SessionLocal()
    seed_database(db)
    db.close()
    print("Database seeding completed.")
