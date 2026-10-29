import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import {
  LayoutDashboard,
  Compass,
  FileText,
  Bookmark,
  User as UserIcon,
  Settings,
  LogOut,
  Building2,
  PlusCircle,
  Users,
  ShieldCheck,
  Menu,
  X,
  ChevronRight,
  RotateCcw,
  Briefcase,
} from 'lucide-react';
import { UserRole } from '../types/index.ts';

interface DashboardLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigateHome: () => void;
  children: React.ReactNode;
  onResetSeed?: () => void;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentTab,
  onSelectTab,
  onNavigateHome,
  children,
  onResetSeed,
}) => {
  const { user, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  // Student navigation links
  const studentLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'explore', label: 'Explore Internships', icon: Compass },
    { id: 'applications', label: 'My Applications', icon: FileText },
    { id: 'saved', label: 'Saved Internships', icon: Bookmark },
    { id: 'profile', label: 'My Profile', icon: UserIcon },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Company navigation links
  const companyLinks = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-internships', label: 'My Internships', icon: Briefcase },
    { id: 'post-internship', label: 'Post Internship', icon: PlusCircle },
    { id: 'candidate-applications', label: 'Applications', icon: Users },
    { id: 'company-profile', label: 'Company Profile', icon: Building2 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  // Admin navigation links
  const adminLinks = [
    { id: 'admin-stats', label: 'System Overview', icon: LayoutDashboard },
    { id: 'admin-users', label: 'User Directory', icon: Users },
    { id: 'admin-internships', label: 'Internship Moderation', icon: Briefcase },
    { id: 'admin-applications', label: 'All Applications', icon: FileText },
  ];

  const currentLinks =
    user.role === 'admin'
      ? adminLinks
      : user.role === 'company'
      ? companyLinks
      : studentLinks;

  const roleBadgeColors: Record<UserRole, string> = {
    student: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    company: 'bg-blue-50 text-blue-700 border-blue-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
  };

  const handleRoleSwitch = async (role: UserRole) => {
    await quickDemoLogin(role);
    onSelectTab('overview');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200 sticky top-0 z-30">
        <button
          onClick={onNavigateHome}
          className="flex items-center gap-2 text-slate-900 font-bold text-base cursor-pointer"
        >
          <div className="w-7 h-7 rounded bg-indigo-600 flex items-center justify-center text-white">
            <Briefcase className="w-4 h-4" />
          </div>
          <span>InternHub</span>
        </button>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } md:block w-full md:w-64 bg-white border-r border-slate-200 flex flex-col shrink-0 md:min-h-screen md:sticky md:top-0 md:h-screen z-20`}
      >
        {/* Brand header */}
        <div className="p-4 border-b border-slate-100 hidden md:flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2.5 text-slate-900 hover:opacity-90 transition-opacity cursor-pointer text-left"
          >
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-xs">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-sm tracking-tight text-slate-900 block leading-tight">
                InternHub
              </span>
              <span className="text-[10px] text-slate-400 font-medium block leading-none">
                Enterprise Portal
              </span>
            </div>
          </button>
        </div>

        {/* Current User Card */}
        <div className="p-4 border-b border-slate-100 bg-slate-50/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          <div className="mt-2.5 flex items-center justify-between">
            <span
              className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${
                roleBadgeColors[user.role]
              }`}
            >
              {user.role} workspace
            </span>
            <span className="text-[11px] text-slate-400 font-mono">ID: {user.id.slice(-4)}</span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {currentLinks.map((item) => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                  active
                    ? 'bg-indigo-50 text-indigo-700 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Presentation Fast-Switcher for Academic Demo */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/50">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-1">
            Demo Role Switcher
          </div>
          <div className="grid grid-cols-3 gap-1">
            <button
              onClick={() => handleRoleSwitch('student')}
              className={`py-1 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                user.role === 'student'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Student
            </button>
            <button
              onClick={() => handleRoleSwitch('company')}
              className={`py-1 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                user.role === 'company'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Company
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={`py-1 text-[11px] font-medium rounded border text-center transition-colors cursor-pointer ${
                user.role === 'admin'
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Admin
            </button>
          </div>
        </div>

        {/* Bottom sign out */}
        <div className="p-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onNavigateHome}
            className="text-xs text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Public Site
          </button>
          <button
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-14 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          {/* Breadcrumb trail */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span className="capitalize">{user.role} Workspace</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-slate-900 font-semibold capitalize">
              {currentTab.replace('-', ' ')}
            </span>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {onResetSeed && (
              <button
                onClick={onResetSeed}
                title="Restore default demo records"
                className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded border border-slate-200 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Demo Data</span>
              </button>
            )}

            <div className="text-right hidden sm:block">
              <span className="text-xs font-semibold text-slate-900 block leading-tight">
                {user.role === 'company' ? user.companyName || user.name : user.name}
              </span>
              <span className="text-[10px] text-slate-400 block leading-none">
                {user.email}
              </span>
            </div>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">{children}</div>
      </main>
    </div>
  );
};
