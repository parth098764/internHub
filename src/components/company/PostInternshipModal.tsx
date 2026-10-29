import React, { useState } from 'react';
import { Internship, InternshipCategory, WorkMode } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { X, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';

interface PostInternshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (internship: Internship) => void;
  internshipToEdit?: Internship | null;
}

const CATEGORIES: InternshipCategory[] = [
  'Software Engineering',
  'Data Science & AI',
  'Product & UX Design',
  'Marketing & Growth',
  'Finance & Operations',
  'Hardware & Robotics',
];

export const PostInternshipModal: React.FC<PostInternshipModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  internshipToEdit,
}) => {
  const [title, setTitle] = useState(internshipToEdit?.title || '');
  const [category, setCategory] = useState<InternshipCategory>(
    internshipToEdit?.category || 'Software Engineering'
  );
  const [location, setLocation] = useState(internshipToEdit?.location || 'San Francisco, CA');
  const [workMode, setWorkMode] = useState<WorkMode>(internshipToEdit?.workMode || 'Hybrid');
  const [paid, setPaid] = useState<boolean>(internshipToEdit?.paid ?? true);
  const [stipend, setStipend] = useState(internshipToEdit?.stipend || '$45/hr (~$7,200/mo)');
  const [duration, setDuration] = useState(internshipToEdit?.duration || '12 Weeks');
  const [openings, setOpenings] = useState<number>(internshipToEdit?.openings || 2);
  const [deadline, setDeadline] = useState(internshipToEdit?.deadline || '2026-12-15');
  const [skills, setSkills] = useState(internshipToEdit?.skills.join(', ') || 'React, TypeScript, CSS');
  const [description, setDescription] = useState(
    internshipToEdit?.description ||
      'Join our engineering team to develop high-impact product features. You will participate in architecture reviews, build accessible UI components, and collaborate directly with senior mentors.'
  );
  const [responsibilities, setResponsibilities] = useState(
    internshipToEdit?.responsibilities?.join('\n') ||
      'Implement modular, responsive UI components\nWrite unit and integration tests\nParticipate in sprint planning and code reviews'
  );
  const [requirements, setRequirements] = useState(
    internshipToEdit?.requirements?.join('\n') ||
      'Currently enrolled in Computer Science or related degree\nProficiency in modern JavaScript/TypeScript and web standards\nEager to learn and collaborate'
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    if (!description.trim() || description.length < 30) {
      setError('Description must be at least 30 characters');
      return;
    }
    if (!deadline) {
      setError('Application deadline is required');
      return;
    }

    setLoading(true);
    try {
      const skillsArray = skills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const respArray = responsibilities
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);
      const reqArray = requirements
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        title: title.trim(),
        category,
        location: location.trim(),
        workMode,
        paid,
        stipend: paid ? stipend.trim() : 'Unpaid / College Credit',
        duration: duration.trim(),
        openings: Number(openings) || 1,
        deadline,
        skills: skillsArray,
        description: description.trim(),
        responsibilities: respArray,
        requirements: reqArray,
      };

      if (internshipToEdit) {
        const res = await api.internships.update(internshipToEdit.id, payload);
        onSuccess(res.internship);
      } else {
        const res = await api.internships.create(payload);
        onSuccess(res.internship);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save internship listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {internshipToEdit ? 'Edit Internship Listing' : 'Post a New Internship'}
            </h2>
            <p className="text-xs text-slate-500">
              Publish verified opportunities to qualified student applicants
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="m-5 mb-0 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Internship Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Software Engineering Intern"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as InternshipCategory)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Work Mode <span className="text-red-500">*</span>
              </label>
              <select
                value={workMode}
                onChange={(e) => setWorkMode(e.target.value as WorkMode)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 bg-white"
              >
                <option value="Hybrid">Hybrid</option>
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. San Francisco, CA or Remote"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Duration <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 12 Weeks"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Openings Count <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min={1}
                required
                value={openings}
                onChange={(e) => setOpenings(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div>
              <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 mb-1.5">
                <input
                  type="checkbox"
                  checked={paid}
                  onChange={(e) => setPaid(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                />
                <span>Paid Position</span>
              </label>
              <input
                type="text"
                disabled={!paid}
                value={stipend}
                onChange={(e) => setStipend(e.target.value)}
                placeholder="e.g. $45/hr or $6,000/mo"
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 disabled:bg-slate-100"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Application Deadline <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="w-full px-3 py-1.5 border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Required Skills (comma separated) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g. React, TypeScript, GraphQL, CSS"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Role Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Overview of the internship, team, and learning objectives..."
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Key Responsibilities (one per line)
              </label>
              <textarea
                rows={3}
                value={responsibilities}
                onChange={(e) => setResponsibilities(e.target.value)}
                placeholder="Bullet points of what the intern will build or own..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Candidate Requirements (one per line)
              </label>
              <textarea
                rows={3}
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                placeholder="Degree program, coursework, or technical background..."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono text-[11px]"
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving Listing...</span>
                </>
              ) : (
                <span>{internshipToEdit ? 'Save Changes' : 'Publish Internship'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
