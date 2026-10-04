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
