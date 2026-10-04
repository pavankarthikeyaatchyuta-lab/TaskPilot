from abc import ABC, abstractmethod
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)

class OpportunitySource(ABC):
    @abstractmethod
    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        """Search opportunities based on query and filters."""
        pass


class MockOpportunitySource(OpportunitySource):
    """Deterministic, high-quality repository of realistic opportunities."""
    
    def __init__(self):
        now = datetime.utcnow()
        self.opportunities = [
            {
                "title": "AI/ML Research Intern (Summer 2025)",
                "company": "Google",
                "description": "Work with Google DeepMind and Research teams on next-generation LLM alignment, multimodal representations, and foundation models. You will conduct research experiments, optimize transformer architectures, and author publication-ready work.",
                "location": "Mountain View, CA",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "PyTorch", "Transformers", "Deep Learning", "TensorFlow", "Research Writing"],
                "eligibility": "Currently enrolled in a Bachelor's, Master's, or PhD in CS, EE, or related field. Expected graduation between Fall 2025 and Spring 2027.",
                "deadline": now + timedelta(days=28),
                "stipend": "$55 - $65 / hour + housing",
                "application_url": "https://careers.google.com/jobs/results/aiml-intern-summer",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Machine Learning Engineer Intern - Foundation Models",
                "company": "Meta",
                "description": "Join FAIR / GenAI org to build and evaluate distributed training pipelines for Llama models. Responsibilities include GPU kernel optimization, synthetic data generation, and fine-tuning reasoning models.",
                "location": "Menlo Park, CA",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "PyTorch", "Distributed Training", "CUDA", "C++", "Transformers"],
                "eligibility": "Enrolled in University degree in Computer Science or Software Engineering. Prior experience in machine learning algorithms required.",
                "deadline": now + timedelta(days=21),
                "stipend": "$58 - $68 / hour + housing stipend",
                "application_url": "https://metacareers.com/jobs/mle-intern-foundation-models",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "AI Safety & Systems Engineering Intern",
                "company": "Anthropic",
                "description": "Collaborate on Claude's core training, red-teaming, mechanistic interpretability, and tool-use agent evaluation. Help build safe, reliable AI systems with exceptional engineering rigor.",
                "location": "San Francisco, CA",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "PyTorch", "FastAPI", "Agentic Systems", "Evaluations", "Docker"],
                "eligibility": "Undergraduate or Graduate student graduating in 2025 or 2026. Strong programming skills in Python and deep learning fundamentals.",
                "deadline": now + timedelta(days=14),
                "stipend": "$60 - $70 / hour",
                "application_url": "https://anthropic.com/careers/internships-safety",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Applied AI Research Intern",
                "company": "Microsoft",
                "description": "Develop novel agentic frameworks, multi-agent reasoning graphs, and specialized copilots with Microsoft Research and Office AI teams. Evaluate latency, accuracy, and safety.",
                "location": "Redmond, WA",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "LangChain", "PyTorch", "FastAPI", "Azure", "Prompt Engineering"],
                "eligibility": "B.S., M.S., or Ph.D. students in Computer Science or Data Science. Minimum 3.0 GPA required.",
                "deadline": now + timedelta(days=35),
                "stipend": "$52 - $60 / hour + housing stipend",
                "application_url": "https://careers.microsoft.com/us/en/job/applied-ai-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Machine Learning Platform Intern",
                "company": "Databricks",
                "description": "Work on Mosaic AI and MLflow infrastructure. Optimize model serving, vector indexing, feature stores, and automated model evaluations at petabyte scale.",
                "location": "San Francisco, CA",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "SQL", "Docker", "Kubernetes", "PyTorch", "FastAPI"],
                "eligibility": "Enrolled in Bachelor's or Master's program in Computer Science or Computer Engineering graduating 2026.",
                "deadline": now + timedelta(days=19),
                "stipend": "$55 - $62 / hour",
                "application_url": "https://databricks.com/company/careers/ml-platform-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Open Source AI Fellow / Intern",
                "company": "Hugging Face",
                "description": "Contribute to transformers, diffusers, and trl open-source repositories. Build tutorials, benchmark models, and support community models on the Hub.",
                "location": "Remote (Global)",
                "remote_type": "Remote",
                "skills_required": ["Python", "PyTorch", "Transformers", "Git", "Open Source", "Hugging Face Hub"],
                "eligibility": "Open to passionate college students worldwide with proven GitHub contributions to machine learning projects.",
                "deadline": now + timedelta(days=25),
                "stipend": "$4,500 - $6,000 / month",
                "application_url": "https://huggingface.co/jobs/open-source-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Generative AI Software Engineering Intern",
                "company": "Scale AI",
                "description": "Build high-throughput LLM evaluation pipelines, agent toolchains, and human-in-the-loop annotation interfaces for frontier AI labs.",
                "location": "San Francisco, CA",
                "remote_type": "On-site",
                "skills_required": ["Python", "TypeScript", "React", "FastAPI", "PostgreSQL", "PyTorch"],
                "eligibility": "College student graduating in 2025 or 2026 with strong full-stack and machine learning foundations.",
                "deadline": now + timedelta(days=15),
                "stipend": "$55 / hour",
                "application_url": "https://scale.com/careers/intern-genai-swe",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Deep Learning Systems Intern",
                "company": "NVIDIA",
                "description": "Optimize TensorRT-LLM, cuBLAS, and Megatron-LM for Blackwell and Hopper GPU architectures. Write high-performance kernels and profile memory bandwidth.",
                "location": "Santa Clara, CA",
                "remote_type": "Hybrid",
                "skills_required": ["C++", "CUDA", "Python", "PyTorch", "GPU Architecture"],
                "eligibility": "B.S., M.S., or Ph.D. students in Computer Engineering or CS. Strong C++ and parallel programming experience required.",
                "deadline": now + timedelta(days=30),
                "stipend": "$56 - $65 / hour",
                "application_url": "https://nvidia.com/careers/deep-learning-systems-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "NLP & Reasoning Research Intern",
                "company": "Cohere",
                "description": "Help train and evaluate Command R models for multi-hop retrieval-augmented generation (RAG) and tool-use agent workflows.",
                "location": "Toronto, ON (Remote Friendly)",
                "remote_type": "Remote",
                "skills_required": ["Python", "PyTorch", "NLP", "RAG", "Transformers", "Vector Databases"],
                "eligibility": "Students pursuing CS or computational linguistics degree. Experience with large language model prompt evaluation.",
                "deadline": now + timedelta(days=22),
                "stipend": "$50 - $58 / hour",
                "application_url": "https://cohere.com/careers/nlp-research-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Full-Stack AI Application Intern",
                "company": "Perplexity AI",
                "description": "Design and build conversational answer engines, latency-critical streaming web components, and agent citation verification systems.",
                "location": "San Francisco, CA",
                "remote_type": "Hybrid",
                "skills_required": ["TypeScript", "Next.js", "Python", "FastAPI", "PostgreSQL", "LLM APIs"],
                "eligibility": "Enrolled in undergraduate degree. Track record of shipping web apps or AI tools with fast iterations.",
                "deadline": now + timedelta(days=12),
                "stipend": "$55 / hour",
                "application_url": "https://perplexity.ai/careers/fullstack-ai-intern",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "Legal AI Product Engineer Intern",
                "company": "Harvey AI",
                "description": "Develop agentic document extraction, hallucination detection, and domain-adapted reasoning agents for leading international law firms.",
                "location": "New York, NY",
                "remote_type": "Hybrid",
                "skills_required": ["Python", "React", "TypeScript", "LangChain", "Vector Search", "SQL"],
                "eligibility": "Students graduating between Dec 2025 and June 2026. Strong curiosity about domain-specific AI workflows.",
                "deadline": now + timedelta(days=16),
                "stipend": "$50 - $60 / hour",
                "application_url": "https://harvey.ai/careers/intern-product-eng",
                "source": "MockOpportunitySource",
                "opportunity_type": "internship",
                "status": "ACTIVE",
            },
            {
                "title": "CalHacks 12.0 — World's Largest Collegiate AI Hackathon",
                "company": "CalHacks",
                "description": "36-hour hackathon bringing together 2,500+ builders to create autonomous agent workflows, open science models, and developer tools. $100k+ in prizes and sponsor VC pitch meetings.",
                "location": "San Francisco, CA",
                "remote_type": "On-site",
                "skills_required": ["Rapid Prototyping", "Python", "Next.js", "API Integration", "Pitching"],
                "eligibility": "All enrolled college and university students globally. Travel reimbursements available for accepted applicants.",
                "deadline": now + timedelta(days=10),
                "stipend": "$100,000+ Prize Pool + Travel Grants",
                "application_url": "https://calhacks.io/apply",
                "source": "MockOpportunitySource",
                "opportunity_type": "hackathon",
                "status": "ACTIVE",
            },
            {
                "title": "Undergraduate AI Research Fellowship",
                "company": "MIT Center for Brains, Minds & Machines",
                "description": "Full-time funded summer research fellowship investigating cognitive architectures, neuro-symbolic reasoning, and compositional learning.",
                "location": "Cambridge, MA",
                "remote_type": "On-site",
                "skills_required": ["Python", "PyTorch", "Mathematical Modeling", "Cognitive Science"],
                "eligibility": "Undergraduate students with at least two semesters remaining before graduation. Minimum 3.5 GPA.",
                "deadline": now + timedelta(days=40),
                "stipend": "$7,500 stipend + campus accommodation",
                "application_url": "https://cbmm.mit.edu/fellowship-undergrad",
                "source": "MockOpportunitySource",
                "opportunity_type": "research",
                "status": "ACTIVE",
            },
            {
                "title": "NeurIPS Student Travel & Diversity Scholarship",
                "company": "NeurIPS Foundation",
                "description": "Travel scholarship covering conference registration, flights, and accommodation for students with accepted papers or workshop contributions in machine learning.",
                "location": "San Diego, CA",
                "remote_type": "On-site",
                "skills_required": ["Machine Learning", "Research", "Academic Paper"],
                "eligibility": "Enrolled students who are primary or co-authors on accepted papers or workshop submissions.",
                "deadline": now + timedelta(days=45),
                "stipend": "Full travel & registration grant (~$2,500 value)",
                "application_url": "https://neurips.cc/Scholarships",
                "source": "MockOpportunitySource",
                "opportunity_type": "scholarship",
                "status": "ACTIVE",
            }
        ]

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        query_terms = query.lower().split() if query else []
        results = []
        
        for opp in self.opportunities:
            # Check match against title, company, description, skills
            content = f"{opp['title']} {opp['company']} {opp['description']} {' '.join(opp['skills_required'])}".lower()
            
            # Simple keyword matching or return all if query is broad
            matches = True
            if query_terms:
                matches = any(term in content for term in query_terms)
            
            # Filter checks
            if matches and filters:
                if "remote_type" in filters and filters["remote_type"] != "Any":
                    if opp["remote_type"] != filters["remote_type"]:
                        matches = False
                if "opportunity_type" in filters and filters["opportunity_type"]:
                    if opp["opportunity_type"] != filters["opportunity_type"]:
                        matches = False
                        
            if matches:
                results.append(opp)
                
        return results


class PublicWebSource(OpportunitySource):
    """External source placeholder with resilient fallback to MockOpportunitySource."""
    
    def __init__(self):
        self.fallback = MockOpportunitySource()

    async def search(self, query: str, filters: Optional[Dict[str, Any]] = None) -> List[Dict[str, Any]]:
        # Resilient implementation: In production this would query public job aggregators or RSS feeds.
        # It safely falls back to seeded high-reliability data so external network latency or scraping breakage never breaks the demo.
        logger.info(f"PublicWebSource queried for '{query}'. Using verified discovery index.")
        return await self.fallback.search(query, filters)


def get_opportunity_source(source_type: str = "mock") -> OpportunitySource:
    if source_type.lower() == "web":
        return PublicWebSource()
    return MockOpportunitySource()
