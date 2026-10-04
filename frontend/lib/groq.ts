/**
 * Groq LLM Client for Vercel Serverless & Next.js API Routes
 * Direct native integration with Groq's high-speed inference engine (Llama-3.3-70b-versatile)
 */

interface GroqMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export async function callGroqChat(
  messages: GroqMessage[],
  temperature: number = 0.2,
  jsonMode: boolean = false
): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return null;
  }

  const model = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';

  try {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
      }),
    });

    if (!res.ok) {
      console.warn(`[Groq] API error ${res.status}:`, await res.text());
      return null;
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content || null;
  } catch (err) {
    console.warn('[Groq] Failed to call Groq API:', err);
    return null;
  }
}

/**
 * AI Resume Parser using Groq
 */
export async function groqParseResume(resumeText: string): Promise<any | null> {
  const systemPrompt = `You are an expert technical recruiter and resume parsing AI.
Extract structured profile information from the candidate resume text.
You MUST output ONLY valid JSON matching this schema:
{
  "full_name": string,
  "university": string,
  "degree": string,
  "major": string,
  "graduation_year": number,
  "gpa": number or null,
  "skills": string[],
  "preferred_roles": string[],
  "experience_summary": string,
  "projects_summary": string
}`;

  const userPrompt = `Resume text to analyze:\n\n${resumeText.slice(0, 4000)}`;

  const content = await callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    0.1,
    true
  );

  if (!content) return null;

  try {
    let clean = content.trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    return JSON.parse(clean.trim());
  } catch (e) {
    console.warn('[Groq] Failed to parse JSON from resume parsing response:', e);
    return null;
  }
}

/**
 * AI Follow-Up Generator using Groq
 */
export async function groqGenerateFollowup(
  company: string,
  role: string,
  appliedDate: string,
  candidateName: string,
  skills: string[]
): Promise<{ subject: string; body: string; tone: string } | null> {
  const systemPrompt = `You are an executive career advisor specializing in technical internship applications.
Draft a concise, professional follow-up email from an applicant to the hiring team for an internship.
The email must express continued enthusiasm, reference 1-2 relevant skills/projects, and ask politely about status without being pushy.
Output ONLY valid JSON:
{
  "subject": string,
  "body": string,
  "tone": string
}`;

  const userPrompt = `Company: ${company}
Role: ${role}
Application Date: ${appliedDate}
Candidate Name: ${candidateName}
Key Skills: ${skills.slice(0, 5).join(', ')}
Draft the follow-up email.`;

  const content = await callGroqChat(
    [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    0.3,
    true
  );

  if (!content) return null;

  try {
    let clean = content.trim();
    if (clean.startsWith('```json')) clean = clean.slice(7);
    if (clean.startsWith('```')) clean = clean.slice(3);
    if (clean.endsWith('```')) clean = clean.slice(0, -3);
    return JSON.parse(clean.trim());
  } catch (e) {
    return null;
  }
}
