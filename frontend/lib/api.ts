const API_BASE = process.env.NEXT_PUBLIC_API_URL || '/api';

export interface Opportunity {
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
  match_score?: number;
  eligibility_status?: string;
  why_match?: string[];
  potential_gaps?: string[];
}

export interface ApplicationEvent {
  id: number;
  application_id: number;
  event_type: string;
  description: string;
  metadata_json: Record<string, any>;
  created_at: string;
}

export interface Application {
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
  events?: ApplicationEvent[];
}

export interface ApprovalRequest {
  id: string;
  task_id: string;
  title: string;
  description: string;
  action_type: string;
  payload: {
    application_id?: number;
    company?: string;
    role?: string;
    subject?: string;
    body?: string;
    applied_date?: string;
    tone?: string;
  };
  status: string;
  feedback?: string;
  created_at: string;
  resolved_at?: string;
}

export interface AgentAction {
  id: number;
  task_id: string;
  step_number: number;
  tool_name: string;
  input_params: Record<string, any>;
  output_result: Record<string, any>;
  status: string;
  permission_level: string;
  execution_time_ms: number;
  created_at: string;
}

export interface TaskPlanStep {
  step: number;
  name: string;
  tool: string;
  status: string;
}

export interface Task {
  id: string;
  user_goal: string;
  status: 'PLANNING' | 'RUNNING' | 'WAITING_FOR_APPROVAL' | 'COMPLETED' | 'PARTIALLY_COMPLETED' | 'FAILED';
  current_step: number;
  total_steps: number;
  plan: TaskPlanStep[];
  tool_calls: Record<string, any>[];
  results: Record<string, any>;
  final_summary?: string;
  created_at: string;
  updated_at: string;
  approval_requests?: ApprovalRequest[];
}

export interface DashboardData {
  active_applications_count: number;
  shortlisted_count: number;
  followups_due_count: number;
  interviews_count: number;
  offers_count: number;
  total_opportunities_count: number;
  pending_approvals_count: number;
  recent_applications: Application[];
  recent_actions: AgentAction[];
  pending_approvals: ApprovalRequest[];
}

export interface StudentProfile {
  id: number;
  user_id: number;
  full_name: string;
  university: string;
  degree: string;
  major: string;
  graduation_year: number;
  gpa?: number;
  skills: string[];
  technologies: string[];
  preferred_roles: string[];
  preferred_locations: string[];
  remote_preference: string;
  min_stipend: number;
  availability: string;
  experience_summary?: string;
  projects_summary?: string;
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API error ${res.status}: ${errorText || res.statusText}`);
  }
  return res.json();
}

export const api = {
  // Dashboard
  getDashboard: () => request<DashboardData>('/dashboard'),

  // Opportunities
  getOpportunities: (params?: { query?: string; remote_type?: string; opportunity_type?: string }) => {
    const q = new URLSearchParams();
    if (params?.query) q.append('query', params.query);
    if (params?.remote_type) q.append('remote_type', params.remote_type);
    if (params?.opportunity_type) q.append('opportunity_type', params.opportunity_type);
    return request<Opportunity[]>(`/opportunities?${q.toString()}`);
  },
  getOpportunity: (id: number) => request<Opportunity>(`/opportunities/${id}`),

  // Applications
  getApplications: (status?: string) => {
    const q = status ? `?status=${encodeURIComponent(status)}` : '';
    return request<Application[]>(`/applications${q}`);
  },
  getPendingFollowups: (thresholdDays: number = 14) =>
    request<any[]>(`/applications/followups?threshold_days=${thresholdDays}`),
  createApplication: (data: Partial<Application>) =>
    request<Application>('/applications', { method: 'POST', body: JSON.stringify(data) }),
  updateApplication: (id: number, data: Partial<Application>) =>
    request<Application>(`/applications/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
  getExportCsvUrl: () => `${API_BASE}/applications/export`,

  // Profile
  getProfile: () => request<StudentProfile>('/profile'),
  updateProfile: (data: Partial<StudentProfile>) =>
    request<StudentProfile>('/profile', { method: 'PATCH', body: JSON.stringify(data) }),
  parseResume: (resumeText: string, autoSave: boolean = false) =>
    request<any>('/profile/parse-resume', {
      method: 'POST',
      body: JSON.stringify({ resume_text: resumeText, auto_save: autoSave }),
    }),

  // Agent & Tasks
  createTask: (goal: string) =>
    request<Task>('/agent/tasks', { method: 'POST', body: JSON.stringify({ goal }) }),
  getTask: (id: string) => request<Task>(`/agent/tasks/${id}`),
  getTaskEvents: (id: string) => request<AgentAction[]>(`/agent/tasks/${id}/events`),

  // Approvals
  getApprovals: () => request<ApprovalRequest[]>('/agent/approvals'),
  approveAction: (id: string, feedback?: string, editedPayload?: any) =>
    request<any>(`/agent/approvals/${id}/approve`, {
      method: 'POST',
      body: JSON.stringify({ decision: 'APPROVE', feedback, edited_payload: editedPayload }),
    }),
  rejectAction: (id: string, feedback?: string) =>
    request<any>(`/agent/approvals/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ decision: 'REJECT', feedback }),
    }),

  // Demo
  resetDemo: () => request<any>('/demo/reset', { method: 'POST' }),
  runJudgeDemo: () => request<Task>('/demo/run', { method: 'POST' }),
};
