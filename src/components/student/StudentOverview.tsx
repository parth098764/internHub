import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Application, Internship } from '../../types/index.ts';
import {
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Award,
  ArrowRight,
  Bookmark,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface StudentOverviewProps {
  applications: Application[];
  internships: Internship[];
  savedInternshipIds: string[];
  onNavigateTab: (tab: string) => void;
  onOpenInternshipDetail: (internship: Internship) => void;
}

export const StudentOverview: React.FC<StudentOverviewProps> = ({
  applications,
  internships,
  savedInternshipIds,
  onNavigateTab,
  onOpenInternshipDetail,
}) => {
  const { user } = useAuth();
  if (!user) return null;

  // Real calculations directly from application data
  const totalApps = applications.length;
  const underReview = applications.filter((a) => a.status === 'Under Review').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;
  const selected = applications.filter((a) => a.status === 'Selected').length;
  const rejected = applications.filter((a) => a.status === 'Rejected').length;

  // Recommended opportunities based on student's skills
  const studentSkills = (user.skills || []).map((s) => s.toLowerCase());
  const appliedInternshipIds = new Set(applications.map((a) => a.internshipId));

  const recommendedInternships = internships
    .filter((i) => !appliedInternshipIds.has(i.id))
    .filter((i) => {
      if (studentSkills.length === 0) return true;
      return i.skills.some((s) => studentSkills.includes(s.toLowerCase()));
    })
    .slice(0, 3);

  // Status badge styling helper
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Selected':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'Shortlisted':
        return 'text-indigo-700 bg-indigo-50 border-indigo-200';
      case 'Under Review':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Rejected':
        return 'text-slate-600 bg-slate-100 border-slate-200';
      default:
        return 'text-blue-700 bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Welcome Card */}
      <div className="bg-white rounded-xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">
            Student Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Welcome back, {user.name}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {user.course || 'Degree Candidate'} · {user.college || 'University'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onNavigateTab('explore')}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>Explore Opportunities</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Real Metrics Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Application Pipeline Metrics
          </h2>
          <span className="text-xs text-slate-400">Live verified data</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Total Applications</span>
              <FileText className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalApps}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Submitted to date</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Under Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-amber-600">
              {underReview}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Recruiter reviewing</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Shortlisted</span>
              <Award className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {shortlisted}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Interview stage</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Offers Extended</span>
              <CheckCircle className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {selected}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Accepted / Offers</span>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span>Saved Roles</span>
              <Bookmark className="w-4 h-4 text-slate-400" />
            </div>
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-700">
              {savedInternshipIds.length}
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">Bookmarked for later</span>
          </div>
        </div>
      </div>

      {/* 3. Recommended Internships Matched to Skills */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Recommended for Your Skillset
            </h2>
          </div>
          <button
            onClick={() => onNavigateTab('explore')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
          >
            View all ({internships.length})
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recommendedInternships.length > 0 ? (
            recommendedInternships.map((internship) => (
              <div
                key={internship.id}
                onClick={() => onOpenInternshipDetail(internship)}
                className="bg-white rounded-xl border border-slate-200 p-5 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-700">{internship.companyName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{internship.workMode}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {internship.title}
                  </h3>

                  <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {internship.description}
                  </p>

                  <div className="mt-3 flex flex-wrap gap-1 text-[11px] text-slate-600">
                    {internship.skills.slice(0, 3).map((s) => (
                      <span key={s} className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono font-semibold text-slate-900">{internship.stipend}</span>
                  <span className="text-indigo-600 font-medium inline-flex items-center gap-1">
                    Apply <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 bg-white p-8 rounded-xl border border-slate-200 text-center">
              <p className="text-xs text-slate-500">
                You have applied to all recommended listings or no matches were found.
              </p>
              <button
                onClick={() => onNavigateTab('explore')}
                className="mt-3 px-4 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 cursor-pointer"
              >
                Explore Full Directory
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 4. Recent Application Activity */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Recent Application Activity
          </h2>
          {applications.length > 0 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 cursor-pointer"
            >
              View complete application history
            </button>
          )}
        </div>

        {applications.length > 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Internship Opportunity</th>
                    <th className="px-5 py-3 font-semibold">Company</th>
                    <th className="px-5 py-3 font-semibold">Applied Date</th>
                    <th className="px-5 py-3 font-semibold">Current Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {applications.slice(0, 5).map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="px-5 py-3.5 font-bold text-slate-900">
                        {app.internshipTitle}
                      </td>
                      <td className="px-5 py-3.5 text-slate-600 font-medium">{app.companyName}</td>
                      <td className="px-5 py-3.5 text-slate-500 font-mono tabular-nums">
                        {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold border ${getStatusStyle(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <button
                          onClick={() => onNavigateTab('applications')}
                          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer"
                        >
                          View Details
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
            <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-slate-900">No applications submitted yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              Find positions that match your career goals and submit your first application.
            </p>
            <button
              onClick={() => onNavigateTab('explore')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
            >
              Start Browsing Internships
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
