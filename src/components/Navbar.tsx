import React from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { Briefcase, ArrowRight, User as UserIcon, LogOut } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (initialMode?: 'login' | 'register', defaultRole?: 'student' | 'company') => void;
  onNavigateHome: () => void;
  onNavigateExplore: () => void;
  onNavigateCompanies: () => void;
  onNavigateAbout: () => void;
  onNavigateDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigateHome,
  onNavigateExplore,
  onNavigateCompanies,
  onNavigateAbout,
  onNavigateDashboard,
}) => {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark single element */}
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2.5 text-left text-slate-900 hover:opacity-90 transition-opacity shrink-0 cursor-pointer"
        >
          <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 block leading-tight">
              InternHub
            </span>
            <span className="text-[11px] text-slate-500 font-medium block leading-none">
              Career Platform
            </span>
          </div>
        </button>

        {/* Zone 2: Clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <button
            onClick={onNavigateHome}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={onNavigateExplore}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Explore Internships
          </button>
          <button
            onClick={onNavigateCompanies}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            For Companies
          </button>
          <button
            onClick={onNavigateAbout}
            className="hover:text-slate-900 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            How It Works
          </button>
        </nav>

        {/* Zone 3: 1 primary action or user session menu */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="flex items-center gap-3">
              <button
                onClick={onNavigateDashboard}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer whitespace-nowrap shrink-0"
              >
                <UserIcon className="w-3.5 h-3.5" />
                <span>
                  {user.name} ({user.role})
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={logout}
                title="Sign out"
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap cursor-pointer"
              >
                Log In
              </button>
              <button
                onClick={() => onOpenAuth('register', 'student')}
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
