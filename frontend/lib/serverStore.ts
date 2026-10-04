// In-memory persistent server store for Next.js App Router (ensures 1-click Vercel deployment with zero config)

export interface ServerOpportunity {
  id: number;
  title: string;
  company: string;
  description: string;
  location: string;
  remote_type: string;
  skills_required: string[];
  eligibility: string;
  deadline?: string;
  stipend?: string;
  application_url: string;
  source: string;
  opportunity_type: string;
  status: string;
  discovered_at: string;
}

export interface ServerApplication {
  id: number;
  user_id: number;
  opportunity_id?: number;
  company: string;
  role: string;
  status: string;
  match_score: number;
  match_reason?: string;
  applied_date?: string;
  deadline?: string;
  follow_up_date?: string;
  application_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  events: any[];
}

export interface ServerTask {
  id: string;
  user_goal: string;
  status: string;
  current_step: number;
  total_steps: number;
  plan: any[];
  tool_calls: any[];
  results: any;
  final_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface ServerApproval {
  id: string;
  task_id: string;
  title: string;
  description: string;
  action_type: string;
  payload: any;
  status: string;
  feedback?: string;
  created_at: string;
  resolved_at?: string;
}

const now = new Date();
const daysAgo = (d: number) => new Date(now.getTime() - d * 24 * 3600 * 1000).toISOString();
const daysAhead = (d: number) => new Date(now.getTime() + d * 24 * 3600 * 1000).toISOString();

export function createInitialState() {
  const profile = {
    id: 1,
    user_id: 1,
    full_name: 'Alex Chen',
    university: 'Stanford University',
    degree: 'B.S.',
    major: 'Computer Science (AI & Systems)',
    graduation_year: 2026,
    gpa: 3.88,
    skills: ['Python', 'PyTorch', 'Transformers', 'LangChain', 'FastAPI', 'Docker', 'SQL', 'Git', 'CUDA'],
    technologies: ['Linux', 'CUDA', 'PostgreSQL', 'Next.js', 'Tailwind CSS'],
    preferred_roles: ['AI/ML Intern', 'Machine Learning Engineer Intern', 'AI Research Intern'],
    preferred_locations: ['San Francisco, CA', 'Mountain View, CA', 'Remote'],
    remote_preference: 'Hybrid',
    min_stipend: 3500,
    availability: 'Summer 2025 (June - Sept)',
    experience_summary: 'Undergraduate AI Researcher at Stanford AI Lab focusing on efficient transformer fine-tuning. Previously SWE Fellow at HackAI.',
    projects_summary: 'AgentFlow: Autonomous multi-agent coordination benchmark in PyTorch; DistillVision: Compressed multimodal model for edge deployment.',
    updated_at: now.toISOString(),
  };

  const opportunities: ServerOpportunity[] = [
    {
      id: 1,
      title: 'AI/ML Research Intern (Summer 2025)',
      company: 'Google DeepMind',
      description: 'Work with Google DeepMind and Research teams on next-generation LLM alignment, multimodal representations, and foundation models.',
      location: 'Mountain View, CA',
      remote_type: 'Hybrid',
      skills_required: ['Python', 'PyTorch', 'Transformers', 'Deep Learning', 'Research Writing'],
      eligibility: 'Currently enrolled in BS, MS, or PhD in CS. Expected graduation 2025-2027.',
      deadline: daysAhead(28),
      stipend: '$58 - $65 / hour + housing',
      application_url: 'https://careers.google.com/jobs/results/aiml-intern-summer',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 2,
      title: 'AI Safety & Systems Engineering Intern',
      company: 'Anthropic',
      description: "Collaborate on Claude's core training, red-teaming, mechanistic interpretability, and tool-use agent evaluation.",
      location: 'San Francisco, CA',
      remote_type: 'Hybrid',
      skills_required: ['Python', 'PyTorch', 'FastAPI', 'Agentic Systems', 'Docker'],
      eligibility: 'Undergraduate or Graduate student graduating in 2025 or 2026.',
      deadline: daysAhead(14),
      stipend: '$60 - $70 / hour',
      application_url: 'https://anthropic.com/careers/internships-safety',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
  ];

  const applications: ServerApplication[] = [
    {
      id: 1,
      user_id: 1,
      company: 'Google DeepMind',
      role: 'AI/ML Research Intern',
      status: 'APPLIED',
      match_score: 94.5,
      match_reason: 'Strong alignment with PyTorch, Transformers, and Research experience',
      applied_date: daysAgo(18), // 18 days ago -> OVERDUE (>14d threshold)
      deadline: daysAhead(20),
      application_url: 'https://careers.google.com/jobs/results/aiml-intern-summer',
      notes: 'Applied via student portal. First round screening awaited.',
      created_at: daysAgo(18),
      updated_at: daysAgo(18),
      events: [
        { id: 1, application_id: 1, event_type: 'STATUS_CHANGE', description: 'Application submitted 18 days ago', metadata_json: {}, created_at: daysAgo(18) }
      ],
    },
    {
      id: 2,
      user_id: 1,
      company: 'Microsoft',
      role: 'Applied AI Research Intern',
      status: 'UNDER_REVIEW',
      match_score: 91.0,
      match_reason: 'Matches LangChain, Python, and Agentic system skills',
      applied_date: daysAgo(6),
      deadline: daysAhead(25),
      application_url: 'https://careers.microsoft.com/us/en/job/applied-ai-intern',
      notes: 'Resume submitted with project portfolio.',
      created_at: daysAgo(6),
      updated_at: daysAgo(6),
      events: [
        { id: 2, application_id: 2, event_type: 'STATUS_CHANGE', description: 'Application under review', metadata_json: {}, created_at: daysAgo(6) }
      ],
    },
  ];

  return {
    profile,
    opportunities,
    applications,
    tasks: [] as ServerTask[],
    actions: [] as any[],
    approvals: [] as ServerApproval[],
  };
}

// Global server memory cache (persists across API route calls in Node runtime)
const globalStore = global as unknown as { __taskpilotStore?: ReturnType<typeof createInitialState> };
if (!globalStore.__taskpilotStore) {
  globalStore.__taskpilotStore = createInitialState();
}

export const serverStore = globalStore.__taskpilotStore;
