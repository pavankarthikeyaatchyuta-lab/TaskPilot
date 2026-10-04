'use client';

import React, { useState } from 'react';
import {
  User,
  GraduationCap,
  Briefcase,
  MapPin,
  Code,
  DollarSign,
  Save,
  CheckCircle2,
  FileText,
  Sparkles,
  Loader2,
  X,
  Plus,
  Copy,
  Check,
  Cpu,
} from 'lucide-react';
import { StudentProfile, api } from '@/lib/api';

interface ProfileViewProps {
  profile: StudentProfile | null;
  onSaveProfile: (updated: Partial<StudentProfile>) => Promise<void>;
  onShowToast?: (title: string, desc?: string, type?: any) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  onSaveProfile,
  onShowToast,
}) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);
  const [newSkillInput, setNewSkillInput] = useState('');
  const [copiedProfile, setCopiedProfile] = useState(false);

  React.useEffect(() => {
    if (profile) setFormData(profile);
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await onSaveProfile(formData);
      setSaveSuccess(true);
      if (onShowToast) {
        onShowToast('Profile Saved', 'Opportunity match weights recalibrated against your updated skills.', 'success');
      }
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleLoadSampleResume = () => {
    setResumeText(
      `Alex Chen\nStanford University, B.S. in Computer Science (AI & Systems), Expected Graduation: 2026. GPA: 3.88.\n\nTechnical Skills: Python, PyTorch, Transformers, LangChain, CUDA, FastAPI, Docker, SQL, TypeScript.\n\nExperience: Undergraduate AI Researcher at Stanford AI Lab focusing on efficient transformer fine-tuning, agentic workflows, and distributed inference.\n\nProjects:\n- AgentFlow: Multi-agent coordination framework with human-in-the-loop approval gates.\n- DistillVision: Compact edge vision-language model fine-tuned using LoRA.`
    );
  };

  const handleParseResume = async () => {
    if (!resumeText.trim()) return;
    setIsParsingResume(true);
    try {
      const res = await api.parseResume(resumeText, true);
      if (res.parsed_profile) {
        setFormData((prev) => ({
          ...prev,
          ...res.parsed_profile,
        }));
        await onSaveProfile(res.parsed_profile);
        setIsResumeModalOpen(false);
        setSaveSuccess(true);
        if (onShowToast) {
          onShowToast(
            'Resume Extracted via Groq',
            `Parsed ${res.parsed_profile.skills?.length || 0} technical skills & updated candidate profile.`,
            'success'
          );
        }
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleAddSkill = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ('key' in e && e.key !== 'Enter') return;
    e.preventDefault();
    const clean = newSkillInput.trim();
    if (!clean) return;

    const currentSkills = formData.skills || [];
    if (!currentSkills.some((s) => s.toLowerCase() === clean.toLowerCase())) {
      setFormData({
        ...formData,
        skills: [...currentSkills, clean],
      });
    }
    setNewSkillInput('');
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData({
      ...formData,
      skills: (formData.skills || []).filter((s) => s !== skillToRemove),
    });
  };

  const handleCopySummary = () => {
    const summary = `${formData.full_name || 'Alex Chen'} | ${formData.university || 'Stanford University'}
${formData.degree} in ${formData.major} (Class of ${formData.graduation_year})
Skills: ${(formData.skills || []).join(', ')}`;
    navigator.clipboard.writeText(summary);
    setCopiedProfile(true);
    setTimeout(() => setCopiedProfile(false), 2000);
  };

  if (!profile) {
    return <div className="p-8 text-center text-slate-500 text-xs font-mono">Loading profile telemetry...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 rounded-3xl p-5 shadow-xl backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold">
              VERIFIED CANDIDATE
            </span>
            <span className="text-xs text-slate-400 font-mono">Profile ID: #STANFORD-2026</span>
          </div>
          <h2 className="text-lg font-black text-white tracking-tight mt-1">
            {formData.full_name || 'Alex Chen'}
          </h2>
          <p className="text-xs text-slate-400">
            TaskPilot benchmarks this profile against every incoming opportunity across skills, eligibility, role, and location.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleCopySummary}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono text-slate-300 hover:text-white bg-slate-950 border border-slate-800 rounded-xl transition-all"
            title="Copy formatted profile summary"
          >
            {copiedProfile ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
            <span>{copiedProfile ? 'Copied' : 'Copy'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90 rounded-xl shadow-md shadow-cyan-500/20 transition-all active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Resume Parser</span>
          </button>
        </div>
      </div>

      {/* Resume Parsing Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center">
                  <FileText className="w-4 h-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    AI Resume & Skills Extractor
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-emerald-400">
                    <Cpu className="w-3 h-3" />
                    <span>Powered by Groq LPU (openai/gpt-oss-120b)</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Paste your raw resume text or LinkedIn bio below. Groq extracts your skills, GPA, degree, and projects in milliseconds to calibrate your matching engine.
            </p>

            <div className="relative">
              <textarea
                rows={8}
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste resume text here or click 'Load Sample AI Resume' below..."
                className="w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-2xl p-3.5 text-xs text-white outline-none font-sans leading-relaxed transition-colors"
              />
              <button
                type="button"
                onClick={handleLoadSampleResume}
                className="absolute right-3 bottom-3 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/30 px-2.5 py-1 rounded-lg transition-all"
              >
                + Load Sample AI Resume
              </button>
            </div>

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] font-mono text-slate-500">
                {resumeText.length > 0 ? `${resumeText.length} characters` : 'Ready for input'}
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsResumeModalOpen(false)}
                  className="px-3.5 py-2 text-xs text-slate-400 hover:text-white bg-slate-800 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleParseResume}
                  disabled={isParsingResume || !resumeText.trim()}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-300 hover:opacity-90 rounded-xl shadow-md transition-all disabled:opacity-50"
                >
                  {isParsingResume ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting with Groq...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Extract & Recalibrate</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Form */}
      <form
        onSubmit={handleSave}
        className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl space-y-6 backdrop-blur-xl"
      >
        {/* Education & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Full Name</label>
            <input
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">University</label>
            <input
              type="text"
              value={formData.university || ''}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Degree & Major</label>
            <input
              type="text"
              value={`${formData.degree || ''} in ${formData.major || ''}`}
              onChange={(e) => {
                const parts = e.target.value.split(' in ');
                setFormData({ ...formData, degree: parts[0] || '', major: parts[1] || '' });
              }}
              className="mt-1 w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Grad Year</label>
              <input
                type="number"
                value={formData.graduation_year || 2026}
                onChange={(e) =>
                  setFormData({ ...formData, graduation_year: parseInt(e.target.value) })
                }
                className="mt-1 w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-[11px] font-mono uppercase font-bold text-slate-400">GPA (Unweighted)</label>
              <input
                type="number"
                step="0.01"
                value={formData.gpa || 3.88}
                onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                className="mt-1 w-full bg-slate-950 border border-slate-800 focus:border-cyan-500 rounded-xl p-3 text-xs text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Interactive Skills Tag Cloud */}
        <div className="space-y-2.5 pt-2 border-t border-slate-800/80">
          <div className="flex items-center justify-between">
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              <span>Core Skills & Technologies ({formData.skills?.length || 0})</span>
            </label>
            <span className="text-[10px] text-slate-500 font-mono">
              Press Enter or click (+) to add
            </span>
          </div>

          <div className="flex flex-wrap gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800 min-h-[52px] items-center">
            {(formData.skills || []).map((skill) => (
              <span
                key={skill}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-950/40 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-medium shadow-sm"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSkill(skill)}
                  className="hover:text-rose-400 transition-colors p-0.5"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}

            <div className="flex items-center gap-1 pl-1">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={handleAddSkill}
                placeholder="Add skill (e.g. Next.js)..."
                className="bg-transparent border-none text-xs text-white placeholder-slate-600 outline-none w-36 font-mono"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white"
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Remote Preference</label>
            <select
              value={formData.remote_preference || 'Any'}
              onChange={(e) => setFormData({ ...formData, remote_preference: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none"
            >
              <option value="Any">Any (Hybrid or Remote)</option>
              <option value="Remote Only">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Min Monthly Stipend</label>
            <input
              type="number"
              value={formData.min_stipend || 0}
              onChange={(e) => setFormData({ ...formData, min_stipend: parseInt(e.target.value) })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Availability</label>
            <input
              type="text"
              value={formData.availability || 'Summer 2026'}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Experience & Projects */}
        <div className="space-y-4 pt-2 border-t border-slate-800/80">
          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Experience Summary</label>
            <textarea
              rows={2}
              value={formData.experience_summary || ''}
              onChange={(e) => setFormData({ ...formData, experience_summary: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-[11px] font-mono uppercase font-bold text-slate-400">Projects Summary</label>
            <textarea
              rows={2}
              value={formData.projects_summary || ''}
              onChange={(e) => setFormData({ ...formData, projects_summary: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-3">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:opacity-90 rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Recalibrating Engine...' : 'Save & Calibrate Fit'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
