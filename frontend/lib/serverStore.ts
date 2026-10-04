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
      title: 'Machine Learning Engineer Intern - Foundation Models',
      company: 'Meta',
      description: 'Join FAIR / GenAI org to build and evaluate distributed training pipelines for Llama models. GPU kernel optimization and fine-tuning.',
      location: 'Menlo Park, CA',
      remote_type: 'Hybrid',
      skills_required: ['Python', 'PyTorch', 'CUDA', 'Distributed Training', 'Transformers'],
      eligibility: 'Enrolled in University degree in Computer Science graduating 2026.',
      deadline: daysAhead(21),
      stipend: '$58 - $68 / hour + housing stipend',
      application_url: 'https://metacareers.com/jobs/mle-intern-foundation-models',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 3,
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
    {
      id: 4,
      title: 'Applied AI Research Intern',
      company: 'Microsoft',
      description: 'Develop novel agentic frameworks, multi-agent reasoning graphs, and specialized copilots with Microsoft Research.',
      location: 'Redmond, WA',
      remote_type: 'Hybrid',
      skills_required: ['Python', 'LangChain', 'PyTorch', 'FastAPI', 'Azure'],
      eligibility: 'B.S., M.S., or Ph.D. students in Computer Science. Minimum 3.0 GPA.',
      deadline: daysAhead(35),
      stipend: '$52 - $60 / hour + housing stipend',
      application_url: 'https://careers.microsoft.com/us/en/job/applied-ai-intern',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 5,
      title: 'Machine Learning Platform Intern',
      company: 'Databricks',
      description: 'Work on Mosaic AI and MLflow infrastructure. Optimize model serving, vector indexing, and automated model evaluations.',
      location: 'San Francisco, CA',
      remote_type: 'Hybrid',
      skills_required: ['Python', 'SQL', 'Docker', 'Kubernetes', 'PyTorch'],
      eligibility: 'Enrolled in Bachelor or Master program in CS graduating 2026.',
      deadline: daysAhead(19),
      stipend: '$55 - $62 / hour',
      application_url: 'https://databricks.com/company/careers/ml-platform-intern',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 6,
      title: 'Open Source AI Fellow / Intern',
      company: 'Hugging Face',
      description: 'Contribute to transformers, diffusers, and trl open-source repositories. Benchmark models and build community demos.',
      location: 'Remote (Global)',
      remote_type: 'Remote',
      skills_required: ['Python', 'PyTorch', 'Transformers', 'Git', 'Open Source'],
      eligibility: 'Open to college students worldwide with proven GitHub contributions.',
      deadline: daysAhead(25),
      stipend: '$4,500 - $6,000 / month',
      application_url: 'https://huggingface.co/jobs/open-source-intern',
      source: 'Verified Opportunity Index',
      opportunity_type: 'internship',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 7,
      title: 'CalHacks 12.0 — World Largest AI Hackathon',
      company: 'CalHacks',
      description: '36-hour hackathon bringing together 2,500+ builders to create autonomous agent workflows and developer tools.',
      location: 'San Francisco, CA',
      remote_type: 'On-site',
      skills_required: ['Rapid Prototyping', 'Python', 'Next.js', 'Pitching'],
      eligibility: 'Enrolled college and university students globally.',
      deadline: daysAhead(10),
      stipend: '$100,000+ Prize Pool + Travel Grants',
      application_url: 'https://calhacks.io/apply',
      source: 'Verified Opportunity Index',
      opportunity_type: 'hackathon',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
    {
      id: 8,
      title: 'Undergraduate AI Research Fellowship',
      company: 'MIT CBMM',
      description: 'Full-time funded summer research fellowship investigating cognitive architectures and compositional learning.',
      location: 'Cambridge, MA',
      remote_type: 'On-site',
      skills_required: ['Python', 'PyTorch', 'Cognitive Science'],
      eligibility: 'Undergraduate students graduating 2026 or later. Minimum 3.5 GPA.',
      deadline: daysAhead(40),
      stipend: '$7,500 stipend + housing',
      application_url: 'https://cbmm.mit.edu/fellowship-undergrad',
      source: 'Verified Opportunity Index',
      opportunity_type: 'research',
      status: 'ACTIVE',
      discovered_at: daysAgo(3),
    },
  ];

  const applications: ServerApplication[] = [
    {
      id: 1,
      user_id: 1,
      company: 'Google',
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
      applied_date: daysAgo(16), // 16 days ago -> OVERDUE (>14d threshold)
      deadline: daysAhead(25),
      application_url: 'https://careers.microsoft.com/us/en/job/applied-ai-intern',
      notes: 'Resume submitted with project portfolio.',
      created_at: daysAgo(16),
      updated_at: daysAgo(16),
      events: [
        { id: 2, application_id: 2, event_type: 'STATUS_CHANGE', description: 'Resume under review by engineering team', metadata_json: {}, created_at: daysAgo(16) }
      ],
    },
    {
      id: 3,
      user_id: 1,
      company: 'Meta',
      role: 'Machine Learning Engineer Intern - Foundation Models',
      status: 'INTERVIEW',
      match_score: 88.5,
      match_reason: 'Matched distributed training and PyTorch foundations',
      applied_date: daysAgo(9),
      deadline: daysAhead(21),
      application_url: 'https://metacareers.com/jobs/mle-intern-foundation-models',
      notes: 'Technical screen scheduled for next Tuesday.',
      created_at: daysAgo(9),
      updated_at: daysAgo(9),
      events: [
        { id: 3, application_id: 3, event_type: 'STATUS_CHANGE', description: 'Invited to technical screening', metadata_json: {}, created_at: daysAgo(3) }
      ],
    },
    {
      id: 4,
      user_id: 1,
      company: 'Databricks',
      role: 'Machine Learning Platform Intern',
      status: 'PREPARING',
      match_score: 85.0,
      match_reason: 'Matches Docker, SQL, and FastAPI skillset',
      applied_date: undefined,
      deadline: daysAhead(19),
      application_url: 'https://databricks.com/company/careers/ml-platform-intern',
      notes: 'Tailoring resume bullet points to highlight MLflow project.',
      created_at: daysAgo(5),
      updated_at: daysAgo(5),
      events: [],
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
