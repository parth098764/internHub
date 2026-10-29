import React, { useState } from 'react';
import { Application, ApplicationStatus, Internship } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Users,
  FileText,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  AlertCircle,
  X,
  Filter,
  Check,
  Loader2,
} from 'lucide-react';

interface CompanyApplicationsProps {
  applications: Application[];
  internships: Internship[];
  onStatusUpdated: (updatedApp: Application) => void;
  selectedFilterInternshipId?: string | null;
}

const ALL_STATUSES: ApplicationStatus[] = [
  'Applied',
  'Under Review',
  'Shortlisted',
  'Selected',
  'Rejected',
];

export const CompanyApplications: React.FC<CompanyApplicationsProps> = ({
  applications,
  internships,
  onStatusUpdated,
  selectedFilterInternshipId,
}) => {
  const [filterRole, setFilterRole] = useState<string>(selectedFilterInternshipId || 'All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [activeCandidate, setActiveCandidate] = useState<Application | null>(null);

  // Status updating states
  const [targetStatus, setTargetStatus] = useState<ApplicationStatus>('Applied');
  const [statusNotes, setStatusNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const openCandidateReview = (app: Application) => {
    setActiveCandidate(app);
    setTargetStatus(app.status);
    setStatusNotes(app.statusNotes || '');
    setStatusMsg(null);
    setError(null);
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCandidate) return;

    setUpdating(true);
    setError(null);
    setStatusMsg(null);

    try {
      const res = await api.applications.updateStatus(activeCandidate.id, targetStatus, statusNotes);
      onStatusUpdated(res.application);
      setActiveCandidate(res.application);
      setStatusMsg(`Status updated to "${targetStatus}" successfully!`);
    } catch (err: any) {
      setError(err.message || 'Failed to update application status');
    } finally {
      setUpdating(false);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (filterRole !== 'All' && app.internshipId !== filterRole) {
      return false;
    }
    if (filterStatus !== 'All' && app.status !== filterStatus) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header & Filter Controls */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Candidate Applications
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review applicant qualifications, evaluate portfolios, and manage recruitment decisions
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
              <span className="font-bold">{filteredApplications.length}</span> Applicants
            </span>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Position:</span>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Internships ({internships.length})</option>
              {internships.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="All">All Statuses</option>
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApplications.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Applied Position</th>
                  <th className="px-5 py-3 font-semibold">University & Major</th>
                  <th className="px-5 py-3 font-semibold">Submission Date</th>
                  <th className="px-5 py-3 font-semibold">Current Status</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-4">
                      <span className="font-bold text-slate-900 block">{app.studentName}</span>
                      <span className="text-[11px] text-slate-500">{app.studentEmail}</span>
                    </td>

                    <td className="px-5 py-4 font-semibold text-slate-800">
                      {app.internshipTitle}
                    </td>

                    <td className="px-5 py-4 text-slate-600">
                      <span>{app.studentCollege || 'University Student'}</span>
                      <span className="block text-[11px] text-slate-400">{app.studentCourse}</span>
                    </td>

                    <td className="px-5 py-4 font-mono tabular-nums text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${
                          app.status === 'Selected'
                            ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                            : app.status === 'Shortlisted'
                            ? 'text-indigo-700 bg-indigo-50 border-indigo-200'
                            : app.status === 'Under Review'
                            ? 'text-amber-700 bg-amber-50 border-amber-200'
                            : app.status === 'Rejected'
                            ? 'text-slate-600 bg-slate-100 border-slate-200'
                            : 'text-blue-700 bg-blue-50 border-blue-200'
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => openCandidateReview(app)}
                        className="px-3 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Review & Decide
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No matching applications</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No candidates matched the current position or status filter.
          </p>
        </div>
      )}

      {/* Candidate Review & Decision Modal */}
      {activeCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-start justify-between">
              <div>
                <span className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider block">
                  Candidate Dossier
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                  {activeCandidate.studentName}
                </h2>
                <p className="text-xs text-slate-500">
                  Applied for <span className="font-semibold text-slate-700">{activeCandidate.internshipTitle}</span> on{' '}
                  {new Date(activeCandidate.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setActiveCandidate(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-5 overflow-y-auto flex-1 text-xs sm:text-sm">
              {/* Applicant Profile Grid */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Academic Background</span>
                  <span className="font-bold text-slate-900">{activeCandidate.studentCollege}</span>
                  <span className="text-slate-500 block text-[11px]">{activeCandidate.studentCourse}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Candidate Contact</span>
                  <span className="font-mono text-slate-700">{activeCandidate.studentEmail}</span>
                  <div className="mt-1">
                    <a
                      href={activeCandidate.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Open Verified Resume / Portfolio
                    </a>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {activeCandidate.studentSkills && activeCandidate.studentSkills.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Demonstrated Skills
                  </h4>
                  <div className="flex flex-wrap gap-1 text-xs">
                    {activeCandidate.studentSkills.map((s) => (
                      <span
                        key={s}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                  Applicant Cover Statement
                </h4>
                <div className="p-4 bg-white border border-slate-200 rounded-lg text-slate-700 text-xs whitespace-pre-line leading-relaxed">
                  {activeCandidate.coverLetter}
                </div>
              </div>

              {/* Status Update Form */}
              <form onSubmit={handleUpdateStatus} className="pt-3 border-t border-slate-200 space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Update Candidate Decision Status
                </h4>

                {statusMsg && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{statusMsg}</span>
                  </div>
                )}

                {error && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center gap-2 text-xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Select Status</label>
                    <select
                      value={targetStatus}
                      onChange={(e) => setTargetStatus(e.target.value as ApplicationStatus)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    >
                      {ALL_STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">
                      Internal Notes / Feedback (optional)
                    </label>
                    <input
                      type="text"
                      value={statusNotes}
                      onChange={(e) => setStatusNotes(e.target.value)}
                      placeholder="e.g. Scheduled for technical round on Friday"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={updating}
                    className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
                  >
                    {updating ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Updating Database...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Save Status Decision</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
