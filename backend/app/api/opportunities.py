from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.entities import Opportunity, Profile
from app.schemas.schemas import OpportunityResponse
from app.services.matching.engine import matching_engine

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

@router.get("", response_model=List[OpportunityResponse])
def list_opportunities(
    query: Optional[str] = Query(None),
    remote_type: Optional[str] = Query(None),
    opportunity_type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    profile = db.query(Profile).filter(Profile.user_id == 1).first()
    profile_dict = {
        "skills": profile.skills if profile else ["Python", "PyTorch"],
        "graduation_year": profile.graduation_year if profile else 2026,
        "gpa": profile.gpa if profile else 3.88,
        "preferred_roles": profile.preferred_roles if profile else ["AI/ML Intern"],
        "preferred_locations": profile.preferred_locations if profile else ["San Francisco, CA"],
        "remote_preference": profile.remote_preference if profile else "Any"
    }

    q = db.query(Opportunity).filter(Opportunity.status == "ACTIVE")
    if query:
        q = q.filter(
            Opportunity.title.ilike(f"%{query}%") |
            Opportunity.company.ilike(f"%{query}%") |
            Opportunity.description.ilike(f"%{query}%")
        )
    if remote_type and remote_type != "All":
        q = q.filter(Opportunity.remote_type == remote_type)
    if opportunity_type and opportunity_type != "All":
        q = q.filter(Opportunity.opportunity_type == opportunity_type)

    opps = q.all()
    results = []
    for opp in opps:
        opp_data = {
            "title": opp.title,
            "company": opp.company,
            "description": opp.description,
            "location": opp.location,
            "remote_type": opp.remote_type,
            "skills_required": opp.skills_required or [],
            "eligibility": opp.eligibility,
            "deadline": opp.deadline,
        }
        match_res = matching_engine.evaluate(profile_dict, opp_data)
        
        opp_resp = OpportunityResponse(
            id=opp.id,
            title=opp.title,
            company=opp.company,
            description=opp.description,
            location=opp.location,
            remote_type=opp.remote_type,
            skills_required=opp.skills_required or [],
            eligibility=opp.eligibility,
            deadline=opp.deadline,
            stipend=opp.stipend,
            application_url=opp.application_url,
            source=opp.source,
            opportunity_type=opp.opportunity_type,
            status=opp.status,
            discovered_at=opp.discovered_at,
            match_score=match_res["match_score"],
            eligibility_status=match_res["eligibility_status"],
            why_match=match_res["why_match"],
            potential_gaps=match_res["potential_gaps"]
        )
        results.append(opp_resp)

    # Sort descending by match score
    results.sort(key=lambda x: x.match_score or 0.0, reverse=True)
    return results

@router.get("/{opportunity_id}", response_model=OpportunityResponse)
def get_opportunity(opportunity_id: int, db: Session = Depends(get_db)):
    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found")

    profile = db.query(Profile).filter(Profile.user_id == 1).first()
    profile_dict = {
        "skills": profile.skills if profile else ["Python", "PyTorch"],
        "graduation_year": profile.graduation_year if profile else 2026,
        "gpa": profile.gpa if profile else 3.88,
        "preferred_roles": profile.preferred_roles if profile else ["AI/ML Intern"],
        "preferred_locations": profile.preferred_locations if profile else ["San Francisco, CA"],
        "remote_preference": profile.remote_preference if profile else "Any"
    }

    opp_data = {
        "title": opp.title,
        "company": opp.company,
        "description": opp.description,
        "location": opp.location,
        "remote_type": opp.remote_type,
        "skills_required": opp.skills_required or [],
        "eligibility": opp.eligibility,
        "deadline": opp.deadline,
    }
    match_res = matching_engine.evaluate(profile_dict, opp_data)

    return OpportunityResponse(
        id=opp.id,
        title=opp.title,
        company=opp.company,
        description=opp.description,
        location=opp.location,
        remote_type=opp.remote_type,
        skills_required=opp.skills_required or [],
        eligibility=opp.eligibility,
        deadline=opp.deadline,
        stipend=opp.stipend,
        application_url=opp.application_url,
        source=opp.source,
        opportunity_type=opp.opportunity_type,
        status=opp.status,
        discovered_at=opp.discovered_at,
        match_score=match_res["match_score"],
        eligibility_status=match_res["eligibility_status"],
        why_match=match_res["why_match"],
        potential_gaps=match_res["potential_gaps"]
    )
