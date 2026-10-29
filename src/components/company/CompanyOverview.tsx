import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Internship, Application } from '../../types/index.ts';
import {
  Briefcase,
  Users,
  Clock,
  Award,
  CheckCircle,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

interface CompanyOverviewProps {
  myInternships: Internship[];
  companyApplications: Application[];
  onNavigateTab: (tab: string) => void;
  onOpenPostModal: () => void;
}

export const CompanyOverview: React.FC<CompanyOverviewProps> = ({
  myInternships,
  companyApplications,
  onNavigateTab,
  onOpenPostModal,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  const totalListings = myInternships.length;
  const totalApplicants = companyApplications.length;
  const underReview = companyApplications.filter((a) => a.status === 'Under Review').length;
  const shortlisted = companyApplications.filter((a) => a.status === 'Shortlisted').length;
  const offersAccepted = companyApplications.filter((a) => a.status === 'Selected').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider block">
            Employer Recruiting Hub
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            {user.companyName || user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {user.industry || 'Technology'} · Connected with top universities
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenPostModal}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Post New Internship</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Talent Pipeline Overview
          </h2>
          <span className="text-xs text-slate-400">Calculated from company applications</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Active Roles</span>
              <Briefcase className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalListings}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Live published listings</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Total Applicants</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-blue-600">
              {totalApplicants}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Candidate profiles</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>In Screening</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {underReview}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Awaiting evaluation</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Shortlisted</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {shortlisted}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">In interview rounds</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Offers Extended</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {offersAccepted}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Selected interns</span>
          </div>
        </div>
      </div>

      {/* Recent Candidate Applications */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Candidate Submissions
          </h2>
          <button
            onClick={() => onNavigateTab('candidate-applications')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
          >
            Review all applicants ({totalApplicants})
          </button>
        </div>

        {companyApplications.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Candidate</th>
                    <th className="px-5 py-3 font-semibold">Role Applied</th>
                    <th className="px-5 py-3 font-semibold">University & Major</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {companyApplications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5">
                        <span className="font-bold text-slate-900 block">{app.studentName}</span>
                        <span className="text-[11px] text-slate-500">{app.studentEmail}</span>
                      </td>
                      <td className="px-5 py-3.5 font-medium text-slate-800">
                        {app.internshipTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600">
                        {app.studentCollege || 'University Student'}
                        <span className="block text-[11px] text-slate-400">{app.studentCourse}</span>
                      </td>
                      <td className="px-5 py-3.5">
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
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onNavigateTab('candidate-applications')}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          Review Portfolio
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 p-8 text-center">
            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs text-slate-500">
              No student candidates have submitted applications for your listings yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
