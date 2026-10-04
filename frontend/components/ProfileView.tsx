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
} from 'lucide-react';
import { StudentProfile } from '@/lib/api';

interface ProfileViewProps {
  profile: StudentProfile | null;
  onSaveProfile: (updated: Partial<StudentProfile>) => Promise<void>;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ profile, onSaveProfile }) => {
  const [formData, setFormData] = useState<Partial<StudentProfile>>(profile || {});
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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

        {saveSuccess && (
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <span>Profile Saved!</span>
          </div>
        )}
      </div>

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
