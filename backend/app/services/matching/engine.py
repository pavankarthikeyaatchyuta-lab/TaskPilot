from typing import Dict, Any, List, Tuple
from datetime import datetime
import re

class MatchingEngine:
    def __init__(
        self,
        weight_skills: float = 0.35,
        weight_eligibility: float = 0.25,
        weight_role: float = 0.15,
        weight_location: float = 0.15,
        weight_urgency: float = 0.10
    ):
        self.w_skills = weight_skills
        self.w_eligibility = weight_eligibility
        self.w_role = weight_role
        self.w_location = weight_location
        self.w_urgency = weight_urgency

    def evaluate(self, profile: Dict[str, Any], opportunity: Dict[str, Any]) -> Dict[str, Any]:
        """
        Evaluate eligibility and compute explainable match score between a user profile and an opportunity.
        """
        user_skills = set(s.lower() for s in profile.get("skills", []))
        opp_skills = set(s.lower() for s in opportunity.get("skills_required", []))
        
        # 1. Skill Match
        common_skills = user_skills.intersection(opp_skills)
        missing_skills = opp_skills - user_skills
        skill_score = (len(common_skills) / max(len(opp_skills), 1)) if opp_skills else 0.8
        skill_score = min(max(skill_score, 0.0), 1.0)
        
        # 2. Eligibility Assessment
        eligibility_text = (opportunity.get("eligibility") or "").lower()
        grad_year = profile.get("graduation_year", 2026)
        degree = (profile.get("degree") or "").lower()
        gpa = profile.get("gpa", 3.5)
        
        eligibility_score = 1.0
        eligibility_status = "Eligible"
        eligibility_reasons = []
        gaps = []

        # Check graduation year compatibility
        year_match = re.search(r"202[4-9]", eligibility_text)
        if year_match:
            allowed_year = int(year_match.group(0))
            if abs(grad_year - allowed_year) <= 1:
                eligibility_reasons.append(f"Graduation year ({grad_year}) matches opportunity window")
            else:
                eligibility_score -= 0.3
                gaps.append(f"Graduation year ({grad_year}) may differ from target ({allowed_year})")

        # Check student status
        if "student" in eligibility_text or "enrolled" in eligibility_text or "bachelor" in eligibility_text:
            eligibility_reasons.append("Currently enrolled university student eligibility satisfied")
        
        # Check GPA if stated
        gpa_match = re.search(r"(\d\.\d)\s*gpa", eligibility_text)
        if gpa_match:
            required_gpa = float(gpa_match.group(1))
            if gpa and gpa >= required_gpa:
                eligibility_reasons.append(f"GPA ({gpa}) satisfies required minimum ({required_gpa})")
            elif gpa and gpa < required_gpa:
                eligibility_score -= 0.4
                gaps.append(f"GPA ({gpa}) below listed preference ({required_gpa})")

        if eligibility_score >= 0.9:
            eligibility_status = "Eligible"
        elif eligibility_score >= 0.7:
            eligibility_status = "Probably eligible"
        elif eligibility_score >= 0.5:
            eligibility_status = "Needs verification"
        else:
            eligibility_status = "Not eligible"

        # 3. Role Preference Match
        pref_roles = [r.lower() for r in profile.get("preferred_roles", [])]
        opp_title = (opportunity.get("title") or "").lower()
        role_score = 0.5
        for pref in pref_roles:
            pref_words = set(pref.split())
            title_words = set(opp_title.split())
            if pref_words.intersection(title_words):
                role_score = 1.0
                break
            elif "ai" in opp_title or "ml" in opp_title or "machine learning" in opp_title:
                role_score = 0.9
                break

        # 4. Location / Remote Preference
        user_remote = profile.get("remote_preference", "Any")
        opp_remote = opportunity.get("remote_type", "Hybrid")
        user_locs = [loc.lower() for loc in profile.get("preferred_locations", [])]
        opp_loc = (opportunity.get("location") or "").lower()

        location_score = 0.7
        if user_remote == "Remote Only":
            if opp_remote == "Remote":
                location_score = 1.0
            else:
                location_score = 0.3
                gaps.append(f"Opportunity is {opp_remote}, but user prefers Remote Only")
        elif opp_remote == "Remote" or any(l in opp_loc for l in user_locs):
            location_score = 1.0
        elif opp_remote == "Hybrid":
            location_score = 0.85
        else:
            location_score = 0.6

        # 5. Deadline Urgency
        now = datetime.utcnow()
        opp_deadline = opportunity.get("deadline")
        urgency_score = 0.8
        if opp_deadline:
            if isinstance(opp_deadline, str):
                try:
                    opp_deadline = datetime.fromisoformat(opp_deadline.replace("Z", "+00:00"))
                except Exception:
                    opp_deadline = None

            if opp_deadline:
                days_left = (opp_deadline - now).days
                if 7 <= days_left <= 30:
                    urgency_score = 1.0  # Optimal application window
                elif days_left < 7:
                    urgency_score = 0.9  # Urgent deadline
                else:
                    urgency_score = 0.7  # Long runway

        # Compute overall weighted score
        overall_score = (
            (skill_score * self.w_skills) +
            (eligibility_score * self.w_eligibility) +
            (role_score * self.w_role) +
            (location_score * self.w_location) +
            (urgency_score * self.w_urgency)
        )
        overall_pct = round(min(max(overall_score * 100, 10.0), 99.0), 1)

        # Build Explainable Reasoning
        why_match = []
        if common_skills:
            common_sample = [s.title() for s in list(common_skills)[:4]]
            why_match.append(f"Matched core skills: {', '.join(common_sample)}")
        
        why_match.extend(eligibility_reasons[:2])
        
        if role_score >= 0.8:
            why_match.append(f"Direct match for preferred role ({opportunity.get('title')})")
        if location_score >= 0.8:
            why_match.append(f"Location fit ({opportunity.get('location')} - {opp_remote})")

        # Potential Gaps
        if missing_skills:
            missing_sample = [s.title() for s in list(missing_skills)[:3]]
            gaps.append(f"Preferred skills to highlight or study: {', '.join(missing_sample)}")

        return {
            "match_score": overall_pct,
            "eligibility_status": eligibility_status,
            "why_match": why_match,
            "potential_gaps": gaps,
            "breakdown": {
                "skill_score": round(skill_score * 100, 1),
                "eligibility_score": round(eligibility_score * 100, 1),
                "role_score": round(role_score * 100, 1),
                "location_score": round(location_score * 100, 1),
                "urgency_score": round(urgency_score * 100, 1),
            }
        }

matching_engine = MatchingEngine()
