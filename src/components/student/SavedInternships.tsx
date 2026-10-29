import React from 'react';
import { Internship } from '../../types/index.ts';
import { Bookmark, ArrowRight, MapPin, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface SavedInternshipsProps {
  savedInternships: Internship[];
  onOpenDetail: (internship: Internship) => void;
  onApply: (internship: Internship) => void;
  onToggleSave: (id: string) => void;
  appliedIds: Set<string>;
  onExplore: () => void;
}

export const SavedInternships: React.FC<SavedInternshipsProps> = ({
  savedInternships,
  onOpenDetail,
  onApply,
  onToggleSave,
  appliedIds,
  onExplore,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">Saved Internships</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Bookmarked positions you are tracking for current cohorts
          </p>
        </div>
        <span className="text-xs font-mono bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg border border-slate-200">
          {savedInternships.length} Saved
        </span>
      </div>

      {savedInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {savedInternships.map((item) => {
            const hasApplied = appliedIds.has(item.id);
            return (
              <div
                key={item.id}
                className="bg-white rounded-xl border border-slate-200 p-5 flex flex-col justify-between hover:shadow-xs transition-all"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <span className="font-semibold text-slate-800">{item.companyName}</span>
                    <button
                      onClick={() => onToggleSave(item.id)}
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Bookmark className="w-4 h-4" fill="currentColor" />
                    </button>
                  </div>

                  <h3
                    onClick={() => onOpenDetail(item)}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {item.title}
                  </h3>

                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{item.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.workMode}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {item.stipend || 'Unpaid'}
                    </span>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="font-mono text-slate-500 text-[11px]">
                    Deadline: {new Date(item.deadline).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-2">
                    {hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => onApply(item)}
                        className="px-3 py-1 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-2xs transition-colors cursor-pointer"
                      >
                        Apply Now
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
          <Bookmark className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No saved internships</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the bookmark icon on any opportunity card to save it for quick review later.
          </p>
          <button
            onClick={onExplore}
            className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
          >
            Explore Internships
          </button>
        </div>
      )}
    </div>
  );
};
