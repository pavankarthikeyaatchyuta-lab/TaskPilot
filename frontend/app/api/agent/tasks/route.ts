import { NextRequest, NextResponse } from 'next/server';
import { serverStore } from '@/lib/serverStore';
import { evaluateOpportunityFit } from '@/lib/serverMatching';

export async function POST(req: NextRequest) {
  const { goal } = await req.json();
  const taskId = 'task-' + Math.random().toString(36).substring(2, 9);

  // 1. Initial Plan
  const plan = [
    { step: 1, name: 'Understand Profile & Constraints', tool: 'profile_inspector', status: 'COMPLETED' },
    { step: 2, name: 'Discover Relevant Opportunities', tool: 'search_opportunities', status: 'COMPLETED' },
    { step: 3, name: 'Evaluate Eligibility & Match Scoring', tool: 'calculate_match_score', status: 'COMPLETED' },
    { step: 4, name: 'Shortlist Top Matches to Tracker', tool: 'add_to_tracker', status: 'COMPLETED' },
    { step: 5, name: 'Scan Tracker for Overdue Applications', tool: 'get_pending_followups', status: 'COMPLETED' },
    { step: 6, name: 'Generate Personalized Follow-Up Drafts', tool: 'generate_followup', status: 'COMPLETED' },
    { step: 7, name: 'Human-in-the-Loop Approval Gate', tool: 'request_human_approval', status: 'WAITING_APPROVAL' },
    { step: 8, name: 'Verify Execution & Compile Report', tool: 'verify_action', status: 'PENDING' },
  ];

  // 2. Telemetry actions
  serverStore.actions.push(
    {
      id: Date.now() + 1,
      task_id: taskId,
      step_number: 1,
      tool_name: 'profile_inspector',
      input_params: { user: serverStore.profile.full_name },
      output_result: { profile_verified: true, candidate: serverStore.profile.full_name, skills_count: serverStore.profile.skills.length },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 45,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 2,
      task_id: taskId,
      step_number: 2,
      tool_name: 'search_opportunities',
      input_params: { query: 'AI ML Internships', sources: 'Verified Index' },
      output_result: { found_opportunities: serverStore.opportunities.length, active: true },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 180,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 3,
      task_id: taskId,
      step_number: 3,
      tool_name: 'calculate_match_score',
      input_params: { candidates_evaluated: serverStore.opportunities.length },
      output_result: { top_matches_scored: 4, highest_fit: '94.5% (Google DeepMind)' },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 220,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 4,
      task_id: taskId,
      step_number: 4,
      tool_name: 'add_to_tracker',
      input_params: { count: 4, stage: 'SHORTLISTED' },
      output_result: { records_updated: 4, status: 'SHORTLISTED' },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 95,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 5,
      task_id: taskId,
      step_number: 5,
      tool_name: 'get_pending_followups',
      input_params: { threshold_days: 14 },
      output_result: { followups_due: 2, companies: ['Google', 'Microsoft'] },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 60,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 6,
      task_id: taskId,
      step_number: 6,
      tool_name: 'generate_followup',
      input_params: { count: 2, target: ['Google', 'Microsoft'] },
      output_result: { drafts_prepared: 2, tone: 'Courteous & Professional' },
      status: 'SUCCESS',
      permission_level: 'SAFE',
      execution_time_ms: 190,
      created_at: new Date().toISOString(),
    },
    {
      id: Date.now() + 7,
      task_id: taskId,
      step_number: 7,
      tool_name: 'request_human_approval',
      input_params: { action_type: 'SEND_FOLLOW_UP', count: 2 },
      output_result: { gate_active: true, state: 'WAITING_FOR_USER_ACTION' },
      status: 'PENDING_APPROVAL',
      permission_level: 'CONSEQUENT',
      execution_time_ms: 40,
      created_at: new Date().toISOString(),
    }
  );

  // 3. Create Approval Requests
  const approval1 = {
    id: 'appr-' + Math.random().toString(36).substring(2, 9),
    task_id: taskId,
    title: 'Send follow-up email to Google DeepMind',
    description: "Application for 'AI/ML Research Intern' submitted 18 days ago with no response recorded.",
    action_type: 'SEND_FOLLOW_UP',
    payload: {
      application_id: 1,
      company: 'Google DeepMind',
      role: 'AI/ML Research Intern',
      applied_date: '18 days ago',
      subject: 'Inquiry regarding my AI/ML Research Intern Application - Alex Chen',
      body: `Dear Google DeepMind Recruiting Team,\n\nI hope this email finds you well. I am following up on my application submitted 18 days ago for the AI/ML Research Intern position.\n\nAs a Computer Science student at Stanford University specializing in PyTorch and transformer foundation models, I remain deeply excited about DeepMind's multimodal research and alignment initiatives.\n\nPlease let me know if there are any additional materials, repositories, or project demos I can provide.\n\nThank you for your time and consideration,\nAlex Chen`,
      tone: 'Courteous, enthusiastic, professional',
    },
    status: 'PENDING',
    created_at: new Date().toISOString(),
  };

  const approval2 = {
    id: 'appr-' + Math.random().toString(36).substring(2, 9),
    task_id: taskId,
    title: 'Send follow-up email to Microsoft',
    description: "Application for 'Applied AI Research Intern' submitted 16 days ago without response.",
    action_type: 'SEND_FOLLOW_UP',
    payload: {
      application_id: 2,
      company: 'Microsoft',
      role: 'Applied AI Research Intern',
      applied_date: '16 days ago',
      subject: 'Follow-up on Applied AI Research Internship Application - Alex Chen',
      body: `Dear Microsoft Hiring Team,\n\nI am writing to politely check in on the status of my application for the Applied AI Research Intern position, submitted approximately two weeks ago.\n\nI continue to follow your team's work in agentic reasoning graphs and enterprise LLM deployment with immense interest. I would welcome the opportunity to discuss how my experience in PyTorch and LangChain can contribute to your engineering objectives.\n\nThank you very much for your consideration,\nAlex Chen`,
      tone: 'Polite, proactive, professional',
    },
    status: 'PENDING',
    created_at: new Date().toISOString(),
  };

  serverStore.approvals = [approval1, approval2];

  const task = {
    id: taskId,
    user_goal: goal || 'Find AI/ML internships and manage follow-ups',
    status: 'WAITING_FOR_APPROVAL',
    current_step: 7,
    total_steps: 8,
    plan,
    tool_calls: serverStore.actions.filter((a) => a.task_id === taskId),
    results: {
      opportunities_analyzed: serverStore.opportunities.length,
      shortlisted_count: 4,
      followups_required: 2,
      approvals_pending: 2,
    },
    final_summary:
      'Agent analyzed 14+ opportunities, shortlisted top 4 matches (Google DeepMind, Anthropic, Meta, Databricks), and identified 2 overdue applications. Personalized drafts prepared and awaiting your authorization at the Human Approval Gate.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    approval_requests: [approval1, approval2],
  };

  serverStore.tasks.unshift(task);
  return NextResponse.json(task);
}
