import os
import json
import logging
from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import httpx
from app.core.config import settings

logger = logging.getLogger(__name__)

class LLMProvider(ABC):
    @abstractmethod
    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        """Generate raw text response from LLM."""
        pass

    @abstractmethod
    async def generate_structured(self, system_prompt: str, user_prompt: str, schema_desc: str) -> Dict[str, Any]:
        """Generate structured JSON response."""
        pass


class MockLLMProvider(LLMProvider):
    """Deterministic, robust mock provider for demonstrations, tests, and offline runs."""
    
    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        return f"Mock response for prompt: {user_prompt[:60]}..."

    async def generate_structured(self, system_prompt: str, user_prompt: str, schema_desc: str) -> Dict[str, Any]:
        prompt_lower = user_prompt.lower()
        
        # Follow-up email draft generation
        if "follow-up" in prompt_lower or "followup" in prompt_lower or "email" in prompt_lower:
            return {
                "subject": "Inquiry regarding my AI/ML Intern Application",
                "body": (
                    "Dear Hiring Team,\n\n"
                    "I hope this message finds you well. I am following up on my application submitted "
                    "for the AI/ML Internship role. I remain deeply enthusiastic about your team's mission "
                    "and work in generative models and scalable deep learning.\n\n"
                    "Since applying, I have continued developing my projects in PyTorch and transformer architectures. "
                    "Please let me know if there are any additional materials, code repositories, or details I can provide.\n\n"
                    "Thank you very much for your time and consideration.\n\n"
                    "Best regards,\nAlex Chen"
                ),
                "tone": "Professional, courteous, proactive",
                "recommended_timing": "Send today during business hours"
            }
        
        # Planning generation
        if "plan" in prompt_lower or "orchestrat" in prompt_lower or "goal" in prompt_lower:
            return {
                "plan": [
                    {"step": 1, "name": "Understand User Profile", "tool": "get_user_profile"},
                    {"step": 2, "name": "Search Relevant Opportunities", "tool": "search_opportunities"},
                    {"step": 3, "name": "Evaluate Eligibility & Match", "tool": "evaluate_eligibility"},
                    {"step": 4, "name": "Rank Best Matches", "tool": "calculate_match_score"},
                    {"step": 5, "name": "Add Top Opportunities to Tracker", "tool": "add_to_tracker"},
                    {"step": 6, "name": "Inspect Applications Requiring Follow-Up", "tool": "get_pending_followups"},
                    {"step": 7, "name": "Draft Personalized Follow-Up Messages", "tool": "generate_followup"},
                    {"step": 8, "name": "Request Human Approval Gate", "tool": "request_human_approval"},
                ]
            }

        return {"status": "ok", "message": "Processed successfully"}


class OpenAIProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "gpt-4o-mini"):
        self.api_key = api_key
        self.model = model
        self.endpoint = "https://api.openai.com/v1/chat/completions"

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(self.endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def generate_structured(self, system_prompt: str, user_prompt: str, schema_desc: str) -> Dict[str, Any]:
        prompt = f"{user_prompt}\n\nYou MUST return valid JSON conforming to this schema:\n{schema_desc}"
        raw_text = await self.generate_response(
            system_prompt=system_prompt + "\nReturn ONLY valid raw JSON with no markdown wrapping.",
            user_prompt=prompt
        )
        clean = raw_text.strip()
        if clean.startswith("```json"):
            clean = clean[7:]
        if clean.startswith("```"):
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        return json.loads(clean.strip())


class GroqProvider(LLMProvider):
    def __init__(self, api_key: str, model: str = "llama3-70b-8192"):
        self.api_key = api_key
        self.model = model
        self.endpoint = "https://api.groq.com/openai/v1/chat/completions"

    async def generate_response(self, system_prompt: str, user_prompt: str) -> str:
        headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }
        payload = {
            "model": self.model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0.2,
        }
        async with httpx.AsyncClient(timeout=30.0) as client:
            resp = await client.post(self.endpoint, headers=headers, json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["choices"][0]["message"]["content"]

    async def generate_structured(self, system_prompt: str, user_prompt: str, schema_desc: str) -> Dict[str, Any]:
        prompt = f"{user_prompt}\n\nYou MUST return valid JSON conforming to this schema:\n{schema_desc}"
        raw_text = await self.generate_response(
            system_prompt=system_prompt + "\nReturn ONLY valid raw JSON with no markdown backticks.",
            user_prompt=prompt
        )
        clean = raw_text.strip()
        if clean.startswith("```json"):
            clean = clean[7:]
        if clean.startswith("```"):
            clean = clean[3:]
        if clean.endswith("```"):
            clean = clean[:-3]
        return json.loads(clean.strip())


def get_llm_provider() -> LLMProvider:
    provider_name = settings.LLM_PROVIDER.lower()
    if provider_name == "openai" and settings.OPENAI_API_KEY:
        return OpenAIProvider(api_key=settings.OPENAI_API_KEY, model=settings.OPENAI_MODEL)
    elif provider_name == "groq" and settings.GROQ_API_KEY:
        return GroqProvider(api_key=settings.GROQ_API_KEY, model=settings.GROQ_MODEL)
    return MockLLMProvider()
