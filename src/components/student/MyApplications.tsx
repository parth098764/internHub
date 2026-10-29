import React, { useState } from 'react';
import { Application, ApplicationStatus } from '../../types/index.ts';
import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Building2,
  Calendar,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

interface MyApplicationsProps {
  applications: Application[];
  onExplore: () => void;
}

const STATUS_STAGES: ApplicationStatus[] = ['Applied', 'Under Review', 'Shortlisted', 'Selected'];

export const MyApplications: React.FC<MyApplicationsProps> = ({ applications, onExplore }) => {
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);

  const getStatusBadge = (status: ApplicationStatus) => {
    switch (status) {
      case 'Selected':
        return {
          label: 'Selected & Offer',
          className: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      case 'Shortlisted':
        return {
          label: 'Shortlisted for Interview',
          className: 'text-indigo-700 bg-indigo-50 border-indigo-200',
        };
      case 'Under Review':
        return {
          label: 'Under Recruiter Review',
          className: 'text-amber-700 bg-amber-50 border-amber-200',
        };
      case 'Rejected':
        return {
          label: 'Not Selected',
          className: 'text-slate-600 bg-slate-100 border-slate-200',
        };
      case 'Applied':
      default:
        return {
          label: 'Application Received',
          className: 'text-blue-700 bg-blue-50 border-blue-200',
        };
    }
  };

  const getProgressStep = (status: ApplicationStatus) => {
    if (status === 'Applied') return 1;
    if (status === 'Under Review') return 2;
    if (status === 'Shortlisted') return 3;
    if (status === 'Selected') return 4;
    return 1; // Rejected shows separate tag
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            My Internship Applications
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time pipeline tracking and employer review milestones
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="font-bold">{applications.length}</span> Active Submissions
          </span>
          <button
            onClick={onExplore}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            Browse More Roles
          </button>
        </div>
      </div>

      {/* Applications List */}
      {applications.length > 0 ? (
        <div className="space-y-4">
          {applications.map((app) => {
            const badge = getStatusBadge(app.status);
            const isExpanded = expandedAppId === app.id;
            const currentStep = getProgressStep(app.status);
            const isRejected = app.status === 'Rejected';

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs transition-all"
              >
                {/* Main Card Summary */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span className="font-semibold text-slate-800">{app.companyName}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono tabular-nums">
                        Submitted {new Date(app.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{app.internshipTitle}</h3>

                    <div className="flex items-center gap-2 pt-1">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                      {app.statusNotes && (
                        <span className="text-xs text-slate-500 italic">
                          &ldquo;{app.statusNotes}&rdquo;
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions & Expansion toggle */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setExpandedAppId(isExpanded ? null : app.id)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'Hide Details' : 'View Submission'}</span>
                      {isExpanded ? (
                        <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Status Pipeline Visualizer */}
                <div className="px-5 pb-5 pt-1 border-t border-slate-100">
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                    Review Pipeline
                  </div>

                  {isRejected ? (
                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2 text-xs text-slate-600">
                      <XCircle className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>
                        Application reviewed. While you were not selected for this cohort, your
                        profile remains active for future opportunities.
                      </span>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-2">
                      {STATUS_STAGES.map((stage, idx) => {
                        const stepNum = idx + 1;
                        const isComplete = currentStep >= stepNum;
                        const isCurrent = currentStep === stepNum;

                        return (
                          <div
                            key={stage}
                            className={`p-2 rounded-lg border text-center transition-all ${
                              isCurrent
                                ? 'bg-indigo-50/80 border-indigo-300 text-indigo-900 font-bold'
                                : isComplete
                                ? 'bg-slate-50 border-slate-200 text-slate-800'
                                : 'bg-white border-dashed border-slate-200 text-slate-400'
                            }`}
                          >
                            <span className="block text-[10px] uppercase font-mono tracking-wider">
                              Step {stepNum}
                            </span>
                            <span className="text-xs truncate block">{stage}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Expanded Details Section */}
                {isExpanded && (
                  <div className="p-5 bg-slate-50/70 border-t border-slate-200 space-y-4 text-xs">
                    <div>
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
                        Cover Letter Submitted
                      </h4>
                      <p className="p-3 bg-white border border-slate-200 rounded-lg text-slate-700 whitespace-pre-line leading-relaxed">
                        {app.coverLetter}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-600">Resume Link:</span>
                        <a
                          href={app.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="font-mono text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1 underline underline-offset-2"
                        >
                          <span className="truncate max-w-xs">{app.resumeUrl}</span>
                          <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                        </a>
                      </div>

                      <div className="text-slate-400 font-mono text-[11px]">
                        Application ID: {app.id}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No applications on file</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            You haven&apos;t submitted any internship applications yet. Browse the open directory to
            find positions matching your skills.
          </p>
          <button
            onClick={onExplore}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Explore Internships Now
          </button>
        </div>
      )}
    </div>
  );
};
