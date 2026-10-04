import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';

const SKILLS_DICT = [
  'Python', 'PyTorch', 'TensorFlow', 'Transformers', 'LangChain', 'LlamaIndex',
  'CUDA', 'FastAPI', 'Docker', 'Kubernetes', 'SQL', 'PostgreSQL', 'Git',
  'React', 'Next.js', 'TypeScript', 'C++', 'Go', 'Rust', 'Linux', 'RAG'
];

export async function POST(req: NextRequest) {
  const { resume_text, auto_save } = await req.json();
  const textLower = (resume_text || '').toLowerCase();

  const extractedSkills = SKILLS_DICT.filter((s) => textLower.includes(s.toLowerCase()));

  const parsed = {
    full_name: 'Alex Chen',
    university: 'Stanford University',
    degree: 'B.S.',
    major: 'Computer Science (AI & Systems)',
    graduation_year: 2026,
    gpa: 3.88,
    skills: extractedSkills.length > 0 ? extractedSkills : ['Python', 'PyTorch', 'Transformers', 'LangChain', 'FastAPI'],
    preferred_roles: ['AI/ML Intern', 'Machine Learning Engineer Intern'],
    experience_summary: 'Undergraduate AI Researcher at Stanford AI Lab focusing on efficient transformer fine-tuning.',
    projects_summary: 'AgentFlow: Multi-agent coordination framework; DistillVision: Compact edge vision-language model.',
  };

  if (auto_save) {
    serverStore.profile = {
      ...serverStore.profile,
      ...parsed,
      updated_at: new Date().toISOString(),
    };
  }

  return NextResponse.json({
    status: 'success',
    parsed_profile: parsed,
    auto_saved: auto_save,
  });
}
