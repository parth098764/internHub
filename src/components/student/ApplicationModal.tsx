import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Internship } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  X,
  FileText,
  Link as LinkIcon,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Building2,
  Sparkles,
} from 'lucide-react';

interface ApplicationModalProps {
  internship: Internship | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ApplicationModal: React.FC<ApplicationModalProps> = ({
  internship,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeUrl, setResumeUrl] = useState('https://internhub.edu/resumes/my-verified-cv.pdf');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !internship) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (coverLetter.trim().length < 20) {
      setError('Cover letter must be at least 20 characters to communicate your qualifications.');
      return;
    }

    if (!resumeUrl.trim()) {
      setError('Please provide a valid resume URL or portfolio link.');
      return;
    }

    setLoading(true);
    try {
      await api.applications.submit({
        internshipId: internship.id,
        coverLetter: coverLetter.trim(),
        resumeUrl: resumeUrl.trim(),
      });
      setSubmitted(true);
      setTimeout(() => {
        onSuccess();
        onClose();
        setSubmitted(false);
        setCoverLetter('');
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrefillSample = () => {
    setCoverLetter(
      `Dear ${internship.companyName} Hiring Team,\n\nI am thrilled to apply for the ${internship.title} position. As a student at ${user?.college || 'university'} studying ${user?.course || 'computer science'}, I have developed practical hands-on proficiency in ${(user?.skills || ['modern software engineering']).join(', ')}.\n\nI admire ${internship.companyName}'s impact in the ${internship.industry} industry and would love the opportunity to contribute directly to your team during this ${internship.duration} cohort.`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
              <span className="font-semibold text-slate-800">{internship.companyName}</span>
              <span aria-hidden="true">·</span>
              <span>{internship.location}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Apply for {internship.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-600">
              Your application has been delivered to {internship.companyName}. You can track review
              status updates under &ldquo;My Applications&rdquo;.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2.5 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                <span>{error}</span>
              </div>
            )}

            {/* Applicant Summary */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                Applicant Details
              </span>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-900">{user?.name}</span>
                  <p className="text-slate-500 text-[11px]">
                    {user?.course} · {user?.college}
                  </p>
                </div>
                <span className="text-slate-400 font-mono text-[11px]">{user?.email}</span>
              </div>
            </div>

            {/* Resume Link */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Resume / Portfolio Link <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  required
                  value={resumeUrl}
                  onChange={(e) => setResumeUrl(e.target.value)}
                  placeholder="https://drive.google.com/your-resume.pdf"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Direct link to your verified CV, GitHub, or online portfolio
              </p>
            </div>

            {/* Cover Letter */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Targeted Cover Letter <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={handlePrefillSample}
                  className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  Prefill tailored draft
                </button>
              </div>

              <textarea
                rows={5}
                required
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Explain why you are interested in this specific role and highlight relevant projects or skills..."
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-1">
                <span>Minimum 20 characters</span>
                <span className="font-mono tabular-nums">{coverLetter.length} chars</span>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <span>Submit Application</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
