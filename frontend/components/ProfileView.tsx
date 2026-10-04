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
} from 'lucide-react';
import { StudentProfile, api } from '@/lib/api';

interface ProfileViewProps {
  profile: StudentProfile | null;
  onSaveProfile: (updated: Partial<StudentProfile>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [resumeText, setResumeText] = useState('');
  const [isParsingResume, setIsParsingResume] = useState(false);

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
      setTimeout(() => setSaveSuccess(false), 3000);
    } finally {
      setIsSaving(false);
    }
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
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error parsing resume:', err);
    } finally {
      setIsParsingResume(false);
    }
  };

  if (!profile) {
    return <div className="p-8 text-center text-slate-500 text-xs">Loading profile...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Student Candidate Profile
          </h2>
          <p className="text-xs text-slate-400">
            TaskPilot's Eligibility & Matching Engine cross-references this profile against every discovered opportunity.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setIsResumeModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 rounded-xl transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Paste Resume & Auto-Fill</span>
          </button>

          {saveSuccess && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
              <span>Profile Saved!</span>
            </div>
          )}
        </div>
      </div>

      {/* Resume Parsing Modal */}
      {isResumeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  AI Resume Parser & Skills Extraction
                </h3>
              </div>
              <button
                onClick={() => setIsResumeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              Paste your raw resume text or LinkedIn summary below. TaskPilot's Extraction Engine will parse your skills, degree, target roles, and automatically calibrate your opportunity match weights.
            </p>

            <textarea
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste resume text here (e.g. Alex Chen, Stanford University BS CS 2026, Skills: Python, PyTorch, Transformers, LangChain, CUDA...)"
              className="w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-xs text-white outline-none font-sans"
            />

            <div className="flex justify-end gap-2 pt-2">
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
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all disabled:opacity-50"
              >
                {isParsingResume ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Extracting Skills & Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Extract & Auto-Fill</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
        {/* Education & Bio */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Full Name</label>
            <input
              type="text"
              value={formData.full_name || ''}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">University</label>
            <input
              type="text"
              value={formData.university || ''}
              onChange={(e) => setFormData({ ...formData, university: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Degree & Major</label>
            <input
              type="text"
              value={`${formData.degree || ''} in ${formData.major || ''}`}
              onChange={(e) => {
                const parts = e.target.value.split(' in ');
                setFormData({ ...formData, degree: parts[0] || '', major: parts[1] || '' });
              }}
              className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">Grad Year</label>
              <input
                type="number"
                value={formData.graduation_year || 2026}
                onChange={(e) => setFormData({ ...formData, graduation_year: parseInt(e.target.value) })}
                className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none font-mono"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase">GPA</label>
              <input
                type="number"
                step="0.01"
                value={formData.gpa || 3.88}
                onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none font-mono"
              />
            </div>
          </div>
        </div>

        {/* Skills & Technologies */}
        <div>
          <label className="text-xs font-semibold text-slate-400 uppercase">
            Technical Skills (comma-separated)
          </label>
          <input
            type="text"
            value={formData.skills?.join(', ') || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
              })
            }
            className="mt-1 w-full bg-slate-950 border border-slate-750 focus:border-indigo-500 rounded-xl p-3 text-sm text-white outline-none"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {formData.skills?.map((s, i) => (
              <span key={i} className="text-xs px-2.5 py-0.5 bg-indigo-950/40 text-indigo-300 rounded-md border border-indigo-700/50">
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Preferences */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Remote Preference</label>
            <select
              value={formData.remote_preference || 'Any'}
              onChange={(e) => setFormData({ ...formData, remote_preference: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-sm text-white outline-none"
            >
              <option value="Any">Any (Hybrid or Remote)</option>
              <option value="Remote Only">Remote Only</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Min Monthly Stipend</label>
            <input
              type="number"
              value={formData.min_stipend || 0}
              onChange={(e) => setFormData({ ...formData, min_stipend: parseInt(e.target.value) })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-sm text-white outline-none font-mono"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Availability</label>
            <input
              type="text"
              value={formData.availability || 'Summer 2025'}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-sm text-white outline-none"
            />
          </div>
        </div>

        {/* Research & Experience Text */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Experience Summary</label>
            <textarea
              rows={2}
              value={formData.experience_summary || ''}
              onChange={(e) => setFormData({ ...formData, experience_summary: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase">Projects Summary</label>
            <textarea
              rows={2}
              value={formData.projects_summary || ''}
              onChange={(e) => setFormData({ ...formData, projects_summary: e.target.value })}
              className="mt-1 w-full bg-slate-950 border border-slate-750 rounded-xl p-3 text-xs text-white outline-none"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md transition-all disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving Profile...' : 'Save Candidate Profile'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
