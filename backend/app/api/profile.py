from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.models.entities import Profile, User
from app.schemas.schemas import ProfileResponse, ProfileUpdate

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("", response_model=ProfileResponse)
def get_user_profile(db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == 1).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    return profile

@router.patch("", response_model=ProfileResponse)
def update_user_profile(payload: ProfileUpdate, db: Session = Depends(get_db)):
    profile = db.query(Profile).filter(Profile.user_id == 1).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")

    update_data = payload.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile

from pydantic import BaseModel

class ResumePayload(BaseModel):
    resume_text: str
    auto_save: bool = False

@router.post("/parse-resume")
async def parse_resume(payload: ResumePayload, db: Session = Depends(get_db)):
    from app.services.matching.resume_parser import resume_parser
    parsed = await resume_parser.parse(payload.resume_text)

    if payload.auto_save:
        profile = db.query(Profile).filter(Profile.user_id == 1).first()
        if profile:
            if parsed.get("full_name"): profile.full_name = parsed["full_name"]
            if parsed.get("university"): profile.university = parsed["university"]
            if parsed.get("degree"): profile.degree = parsed["degree"]
            if parsed.get("major"): profile.major = parsed["major"]
            if parsed.get("graduation_year"): profile.graduation_year = parsed["graduation_year"]
            if parsed.get("gpa"): profile.gpa = parsed["gpa"]
            if parsed.get("skills"): profile.skills = parsed["skills"]
            if parsed.get("preferred_roles"): profile.preferred_roles = parsed["preferred_roles"]
            if parsed.get("experience_summary"): profile.experience_summary = parsed["experience_summary"]
            if parsed.get("projects_summary"): profile.projects_summary = parsed["projects_summary"]
            db.commit()
            db.refresh(profile)

    return {
        "status": "success",
        "parsed_profile": parsed,
        "auto_saved": payload.auto_save
    }
