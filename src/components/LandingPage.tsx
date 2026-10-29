import React, { useState } from 'react';
import {
  Search,
  ArrowRight,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
  Clock,
  Compass,
  Code2,
  Cpu,
  Palette,
  TrendingUp,
  DollarSign,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { Internship, InternshipCategory } from '../types/index.ts';

interface LandingPageProps {
  internships: Internship[];
  onExplore: (searchQuery?: string, category?: string) => void;
  onOpenInternshipDetail: (internship: Internship) => void;
  onOpenAuth: (mode?: 'login' | 'register', role?: 'student' | 'company') => void;
}

const CATEGORIES: { name: InternshipCategory; icon: React.FC<{ className?: string }>; desc: string }[] = [
  {
    name: 'Software Engineering',
    icon: Code2,
    desc: 'Frontend, backend, mobile, systems, and distributed cloud applications',
  },
  {
    name: 'Data Science & AI',
    icon: Cpu,
    desc: 'Machine learning, generative AI, telemetry pipelines, and analytics',
  },
  {
    name: 'Product & UX Design',
    icon: Palette,
    desc: 'Interaction design, Figma component libraries, prototyping, and user research',
  },
  {
    name: 'Marketing & Growth',
    icon: TrendingUp,
    desc: 'Product analytics, technical copywriting, conversion optimization, and community',
  },
  {
    name: 'Finance & Operations',
    icon: DollarSign,
    desc: 'Treasury modeling, strategic operations, fintech compliance, and planning',
  },
  {
    name: 'Hardware & Robotics',
    icon: Compass,
    desc: 'Embedded systems, firmware, Linux infrastructure, and automation testing',
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  internships,
  onExplore,
  onOpenInternshipDetail,
  onOpenAuth,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const featuredInternships = internships.slice(0, 3);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onExplore(searchQuery);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Hero Section */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headline and Call-to-actions */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-indigo-700 bg-indigo-50/80 px-3 py-1 rounded-md mb-6 border border-indigo-100/60">
                <span>Verified Fall & Summer Internship Cohorts</span>
                <span aria-hidden="true">·</span>
                <span>Active 2026 Admissions</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.1] text-balance">
                Your Next Opportunity Starts Here.
              </h1>

              <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                Discover internships, build real-world skills, and connect with companies that help
                shape your future.
              </p>

              {/* Action Buttons */}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onExplore()}
                  className="px-6 py-3 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                >
                  <span>Explore Internships</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onOpenAuth('register', 'student')}
                  className="px-6 py-3 text-sm font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer whitespace-nowrap shrink-0"
                >
                  Join InternHub
                </button>
              </div>

              {/* Search Box in Hero */}
              <form onSubmit={handleSearchSubmit} className="mt-8 max-w-xl">
                <div className="relative flex items-center">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by title, skill, or company (e.g. React, Stripe, Machine Learning)..."
                    className="w-full pl-10 pr-24 py-3 text-xs sm:text-sm bg-white border border-slate-300 rounded-lg shadow-xs focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-md transition-colors cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Trust markers */}
              <div className="mt-6 flex items-center gap-4 text-xs text-slate-500">
                <span>Verified Stipends</span>
                <span aria-hidden="true">·</span>
                <span>Direct Recruiter Review</span>
                <span aria-hidden="true">·</span>
                <span>Zero Application Fees</span>
              </div>
            </div>

            {/* Right Column: Editorial visual container with zero broken image fallback */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-6 border-b border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider block">
                      Live Cohort Preview
                    </span>
                    <h3 className="text-lg font-bold text-white mt-0.5">Top Internship Matches</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono tabular-nums">
                    {internships.length} Openings
                  </span>
                </div>

                <div className="space-y-4 pt-6">
                  {featuredInternships.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onOpenInternshipDetail(item)}
                      className="p-4 rounded-xl bg-slate-800/70 hover:bg-slate-800 border border-slate-700/60 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors">
                            {item.title}
                          </h4>
                          {/* Clean unboxed metadata with · */}
                          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-medium text-slate-300">{item.companyName}</span>
                            <span aria-hidden="true">·</span>
                            <span>{item.location}</span>
                            <span aria-hidden="true">·</span>
                            <span className="font-mono text-indigo-300">{item.stipend || 'Competitive'}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors shrink-0 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Fast response within 5-7 business days</span>
                  <button
                    onClick={() => onExplore()}
                    className="text-indigo-400 hover:text-indigo-300 font-medium inline-flex items-center gap-1 cursor-pointer"
                  >
                    <span>View all listings</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Categories */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Browse by Discipline
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Explore specialized internship tracks aligned with your academic degree and technical
              passions.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const count = internships.filter((i) => i.category === cat.name).length;
              return (
                <button
                  key={cat.name}
                  onClick={() => onExplore(undefined, cat.name)}
                  className="text-left p-6 bg-white rounded-xl border border-slate-200 hover:border-indigo-400 hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors mb-4">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="mt-1.5 text-xs text-slate-500 leading-relaxed">{cat.desc}</p>
                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                    <span className="font-mono tabular-nums">{count} active roles</span>
                    <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform inline-flex items-center gap-1">
                      Explore <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Internships Section */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                Featured Internship Opportunities
              </h2>
              <p className="mt-2 text-sm text-slate-600">
                Curated openings with transparent stipends, explicit requirements, and active review teams.
              </p>
            </div>
            <button
              onClick={() => onExplore()}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              <span>Explore all opportunities</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredInternships.map((internship) => (
              <div
                key={internship.id}
                onClick={() => onOpenInternshipDetail(internship)}
                className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all p-6 flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Clean unboxed metadata header */}
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2.5">
                    <span className="font-medium text-slate-700">{internship.companyName}</span>
                    <span aria-hidden="true">·</span>
                    <span>{internship.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{internship.workMode}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">
                    {internship.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {internship.description}
                  </p>

                  {/* Skills: Clean inline text with separators */}
                  <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs text-slate-600">
                    <span className="text-slate-400 font-medium">Skills:</span>
                    {internship.skills.slice(0, 3).map((skill, idx) => (
                      <span key={skill} className="font-medium text-slate-700">
                        {skill}
                        {idx < Math.min(internship.skills.length, 3) - 1 ? ',' : ''}
                      </span>
                    ))}
                    {internship.skills.length > 3 && (
                      <span className="text-slate-400">+{internship.skills.length - 3}</span>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Compensation</span>
                    <span className="font-mono font-semibold text-slate-900">
                      {internship.stipend || 'Unpaid / Credit'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-400 block text-[11px]">Deadline</span>
                    <span className="font-mono text-slate-700">
                      {new Date(internship.deadline).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How InternHub Works */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              How InternHub Works
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              A transparent, two-sided application workflow built for university talent and modern employers.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* For Students */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Students</h3>
                  <p className="text-xs text-slate-500">From discovery to signed offer</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Find Relevant Openings</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Filter by specific skills, work format (remote, hybrid, on-site), and verified stipends.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Submit Tailored Applications</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Provide a targeted cover letter and resume link without repetitive multi-page questionnaires.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Track Real-Time Statuses</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      No recruitment black holes. Monitor status updates (Under Review, Shortlisted, Selected).
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => onOpenAuth('register', 'student')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors cursor-pointer"
                >
                  Create Free Student Profile
                </button>
              </div>
            </div>

            {/* For Companies */}
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">For Companies</h3>
                  <p className="text-xs text-slate-500">Hire motivated emerging talent</p>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Publish Verified Listings</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Define responsibilities, skill prerequisites, duration, and compensation parameters in minutes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Review Candidate Portfolios</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Evaluate candidates based on verified university background, demonstrated skills, and cover notes.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Advance Qualified Applicants</h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Update applicant statuses with 1 click, communicate decisions, and extend formal internship offers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => onOpenAuth('register', 'company')}
                  className="w-full py-2.5 px-4 text-xs font-semibold text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Post an Internship Listing
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Illustrative Statistics & Platform Metrics */}
      <section className="py-12 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-xs text-slate-500 uppercase tracking-wider mb-6 font-semibold">
            Platform Metrics (Live sandbox data verification)
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">
                {internships.length}
              </span>
              <p className="text-xs text-slate-600 mt-1">Active Verified Positions</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-3xl font-bold font-mono text-indigo-600 tabular-nums">100%</span>
              <p className="text-xs text-slate-600 mt-1">Verified Compensation Records</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">&lt; 7d</span>
              <p className="text-xs text-slate-600 mt-1">Average Response Window</p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-3xl font-bold font-mono text-slate-900 tabular-nums">$0</span>
              <p className="text-xs text-slate-600 mt-1">Student Application Cost</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Attributable Sample Testimonials */}
      <section className="py-16 md:py-24 border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold text-indigo-700 uppercase tracking-wider block">
              Sample Participant Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
              Trusted by Students and Hiring Teams
            </h2>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed italic">
                &ldquo;Applying through InternHub was night-and-day compared to regular job boards.
                Knowing that Stripe was actively monitoring applicant profiles gave me confidence,
                and I could track my review status through every milestone.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm">
                  AR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Alex Rivera</h4>
                  <p className="text-[11px] text-slate-500">
                    B.S. Computer Science, Stanford University · Frontend Intern at Stripe
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200">
              <p className="text-sm text-slate-700 leading-relaxed italic">
                &ldquo;InternHub eliminates recruiting noise. The applicants have structured portfolios,
                clear technical skills, and tailored cover letters. We filled two product design
                internship openings in less than two weeks.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-sm">
                  LR
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">Linear Talent Team</h4>
                  <p className="text-[11px] text-slate-500">
                    Design Systems Recruiting · San Francisco, CA
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 pb-8 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Briefcase className="w-5 h-5 text-indigo-400" />
                <span>InternHub</span>
              </div>
              <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                Modern full-stack internship platform connecting university students with verified
                technical, design, and business internships.
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Platform
              </h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => onExplore()} className="hover:text-white transition-colors cursor-pointer">
                    Explore Internships
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenAuth('register', 'student')} className="hover:text-white transition-colors cursor-pointer">
                    Student Registration
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenAuth('register', 'company')} className="hover:text-white transition-colors cursor-pointer">
                    Company Portal
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Categories
              </h4>
              <ul className="space-y-2 text-xs">
                {CATEGORIES.slice(0, 3).map((c) => (
                  <li key={c.name}>
                    <button onClick={() => onExplore(undefined, c.name)} className="hover:text-white transition-colors cursor-pointer">
                      {c.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">
                Architecture & Security
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full-stack Node.js + Express with SHA-512 salted password hashing, role-based
                access control, and verified persistence.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>&copy; 2026 InternHub Platform. All rights reserved.</p>
            <div className="flex items-center gap-4">
              <span>Academic Demonstration Edition</span>
              <span aria-hidden="true">·</span>
              <span>REST API v1.0</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
