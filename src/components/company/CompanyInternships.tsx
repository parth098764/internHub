import React, { useState } from 'react';
import { Internship, Application } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  Briefcase,
  PlusCircle,
  Edit2,
  Trash2,
  Users,
  MapPin,
  Calendar,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface CompanyInternshipsProps {
  internships: Internship[];
  applications: Application[];
  onOpenPostModal: () => void;
  onEditInternship: (internship: Internship) => void;
  onViewApplicantsForRole: (internshipId: string) => void;
  onInternshipDeleted: (id: string) => void;
}

export const CompanyInternships: React.FC<CompanyInternshipsProps> = ({
  internships,
  applications,
  onOpenPostModal,
  onEditInternship,
  onViewApplicantsForRole,
  onInternshipDeleted,
}) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    setError(null);
    setDeleting(true);
    try {
      await api.internships.delete(id);
      onInternshipDeleted(id);
      setDeleteConfirmId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to delete internship');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Company Internship Listings
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your open roles, view candidate flow, and update listing criteria
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Post Internship</span>
        </button>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-xs text-red-700">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Listings Table / Cards */}
      {internships.length > 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Position Title</th>
                  <th className="px-5 py-3 font-semibold">Category & Mode</th>
                  <th className="px-5 py-3 font-semibold">Compensation</th>
                  <th className="px-5 py-3 font-semibold">Applicants</th>
                  <th className="px-5 py-3 font-semibold">Deadline</th>
                  <th className="px-5 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((item) => {
                  const applicantCount = applications.filter((a) => a.internshipId === item.id).length;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-900 block">{item.title}</span>
                        <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {item.location}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="text-slate-800 font-medium block">{item.category}</span>
                        <span className="text-[11px] text-slate-500">{item.workMode}</span>
                      </td>

                      <td className="px-5 py-4 font-mono font-medium text-slate-900">
                        {item.stipend || 'Unpaid'}
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => onViewApplicantsForRole(item.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs border border-indigo-100 transition-colors cursor-pointer"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span className="font-mono tabular-nums">{applicantCount}</span>
                          <span>Candidates</span>
                        </button>
                      </td>

                      <td className="px-5 py-4 font-mono text-slate-600">
                        {new Date(item.deadline).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => onEditInternship(item)}
                            title="Edit listing"
                            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            title="Delete listing"
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No active internship listings</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You haven&apos;t created any internship vacancies yet. Post your first opportunity to
            receive student applicants.
          </p>
          <button
            onClick={onOpenPostModal}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Post Your First Role
          </button>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-200 max-w-sm w-full p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Delete Internship Listing?</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Are you sure you want to remove this internship listing? Active candidates will no
              longer see this opportunity.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-70"
              >
                {deleting ? 'Removing...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
