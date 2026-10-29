import React, { useState, useMemo } from 'react';
import { Internship, InternshipCategory, WorkMode, Application } from '../../types/index.ts';
import {
  Search,
  Filter,
  Bookmark,
  Briefcase,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  ArrowRight,
  CheckCircle,
  X,
  Building2,
  Users,
} from 'lucide-react';

interface InternshipExplorerProps {
  internships: Internship[];
  applications: Application[];
  savedInternshipIds: string[];
  onToggleSave: (internshipId: string) => void;
  onApply: (internship: Internship) => void;
  initialCategory?: string;
  initialSearch?: string;
}

const CATEGORIES: ('All' | InternshipCategory)[] = [
  'All',
  'Software Engineering',
  'Data Science & AI',
  'Product & UX Design',
  'Marketing & Growth',
  'Finance & Operations',
  'Hardware & Robotics',
];

export const InternshipExplorer: React.FC<InternshipExplorerProps> = ({
  internships,
  applications,
  savedInternshipIds,
  onToggleSave,
  onApply,
  initialCategory = 'All',
  initialSearch = '',
}) => {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedMode, setSelectedMode] = useState<'All' | WorkMode>('All');
  const [paidOnly, setPaidOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'newest' | 'deadline'>('newest');
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  const appliedIds = useMemo(() => {
    return new Set(applications.map((a) => a.internshipId));
  }, [applications]);

  // Client-side filtering & sorting
  const filteredInternships = useMemo(() => {
    return internships
      .filter((item) => {
        // Search query
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCompany = item.companyName.toLowerCase().includes(q);
          const matchLocation = item.location.toLowerCase().includes(q);
          const matchSkills = item.skills.some((s) => s.toLowerCase().includes(q));
          if (!matchTitle && !matchCompany && !matchLocation && !matchSkills) {
            return false;
          }
        }

        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) {
          return false;
        }

        // Work Mode
        if (selectedMode !== 'All' && item.workMode !== selectedMode) {
          return false;
        }

        // Paid
        if (paidOnly && !item.paid) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'deadline') {
          return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
        }
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [internships, search, selectedCategory, selectedMode, paidOnly, sortBy]);

  return (
    <div className="space-y-6">
      {/* 1. Explorer Header & Live Search Bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Explore Verified Internships
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Showing{' '}
              <span className="font-mono font-semibold text-slate-900">
                {filteredInternships.length}
              </span>{' '}
              of {internships.length} available opportunities
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search title, skills, company..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer text-xs"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filters Row */}
        <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          {/* Category Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Work Mode */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Mode:</span>
            <div className="flex bg-slate-100 p-0.5 rounded-md">
              {(['All', 'Remote', 'Hybrid', 'On-site'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setSelectedMode(mode)}
                  className={`px-2.5 py-1 rounded text-xs transition-colors cursor-pointer ${
                    selectedMode === mode
                      ? 'bg-white font-semibold text-slate-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Paid Toggle */}
          <label className="flex items-center gap-1.5 cursor-pointer select-none text-slate-700">
            <input
              type="checkbox"
              checked={paidOnly}
              onChange={(e) => setPaidOnly(e.target.checked)}
              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span>Paid Stipend Only</span>
          </label>

          {/* Sort By */}
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-slate-500 font-medium">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'deadline')}
              className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-md text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="newest">Newest Added</option>
              <option value="deadline">Approaching Deadline</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. Internship Grid */}
      {filteredInternships.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredInternships.map((internship) => {
            const hasApplied = appliedIds.has(internship.id);
            const isSaved = savedInternshipIds.includes(internship.id);

            return (
              <div
                key={internship.id}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-xs transition-all p-5 flex flex-col justify-between"
              >
                <div>
                  {/* Clean unboxed metadata with · */}
                  <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-semibold text-slate-800 truncate">
                        {internship.companyName}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{internship.location}</span>
                    </div>

                    <button
                      onClick={() => onToggleSave(internship.id)}
                      title={isSaved ? 'Remove from saved' : 'Save internship'}
                      className={`p-1.5 rounded-md transition-colors cursor-pointer shrink-0 ${
                        isSaved
                          ? 'text-indigo-600 bg-indigo-50'
                          : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Bookmark className="w-4 h-4" fill={isSaved ? 'currentColor' : 'none'} />
                    </button>
                  </div>

                  {/* Title */}
                  <h3
                    onClick={() => setSelectedInternship(internship)}
                    className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1"
                  >
                    {internship.title}
                  </h3>

                  {/* Sub-metadata */}
                  <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                    <span>{internship.workMode}</span>
                    <span aria-hidden="true">·</span>
                    <span>{internship.duration}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-slate-800 font-medium">
                      {internship.stipend || 'Unpaid'}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-2.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {internship.description}
                  </p>

                  {/* Skills: Clean inline labels */}
                  <div className="mt-4 flex flex-wrap items-center gap-1 text-[11px]">
                    {internship.skills.slice(0, 4).map((skill) => (
                      <span
                        key={skill}
                        className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                    {internship.skills.length > 4 && (
                      <span className="text-slate-400 font-medium text-[10px]">
                        +{internship.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Row */}
                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[11px] text-slate-400">
                    <span>Deadline: </span>
                    <span className="font-mono text-slate-700 font-medium">
                      {new Date(internship.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInternship(internship)}
                      className="text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                    >
                      Details
                    </button>

                    {hasApplied ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                        <CheckCircle className="w-3 h-3" />
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => onApply(internship)}
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
          <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No internships match your filters</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search query, switching categories, or clearing your filters to see more
            results.
          </p>
          <button
            onClick={() => {
              setSearch('');
              setSelectedCategory('All');
              setSelectedMode('All');
              setPaidOnly(false);
            }}
            className="mt-4 px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* 3. Detail View Modal */}
      {selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 max-h-[90vh] flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                  <span className="font-semibold text-slate-800">
                    {selectedInternship.companyName}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{selectedInternship.category}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900">{selectedInternship.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-600">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {selectedInternship.location} ({selectedInternship.workMode})
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    {selectedInternship.stipend || 'Unpaid / College Credit'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {selectedInternship.duration}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedInternship(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs sm:text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  About the Role
                </h4>
                <p>{selectedInternship.description}</p>
              </div>

              {selectedInternship.responsibilities &&
                selectedInternship.responsibilities.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                      Key Responsibilities
                    </h4>
                    <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                      {selectedInternship.responsibilities.map((r, i) => (
                        <li key={i}>{r}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {selectedInternship.requirements && selectedInternship.requirements.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Candidate Requirements
                  </h4>
                  <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
                    {selectedInternship.requirements.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Required Competencies & Skills
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedInternship.skills.map((s) => (
                    <span
                      key={s}
                      className="bg-indigo-50 text-indigo-700 border border-indigo-100 px-2.5 py-1 rounded text-xs font-medium"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Available Openings</span>
                  <span className="font-bold text-slate-900">
                    {selectedInternship.openings} positions
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Application Deadline</span>
                  <span className="font-bold font-mono text-slate-900">
                    {new Date(selectedInternship.deadline).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <button
                onClick={() => onToggleSave(selectedInternship.id)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <Bookmark
                  className="w-4 h-4"
                  fill={savedInternshipIds.includes(selectedInternship.id) ? 'currentColor' : 'none'}
                />
                <span>
                  {savedInternshipIds.includes(selectedInternship.id) ? 'Saved' : 'Save for Later'}
                </span>
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedInternship(null)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 cursor-pointer"
                >
                  Close
                </button>

                {appliedIds.has(selectedInternship.id) ? (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200">
                    <CheckCircle className="w-4 h-4" />
                    Application Submitted
                  </span>
                ) : (
                  <button
                    onClick={() => {
                      const item = selectedInternship;
                      setSelectedInternship(null);
                      onApply(item);
                    }}
                    className="px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    Apply Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
