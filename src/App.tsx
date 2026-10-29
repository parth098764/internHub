import React, { useState, useEffect, useCallback } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { LandingPage } from './components/LandingPage.tsx';
import { AuthModal } from './components/AuthModal.tsx';
import { DashboardLayout } from './components/DashboardLayout.tsx';
import { StudentOverview } from './components/student/StudentOverview.tsx';
import { InternshipExplorer } from './components/student/InternshipExplorer.tsx';
import { ApplicationModal } from './components/student/ApplicationModal.tsx';
import { MyApplications } from './components/student/MyApplications.tsx';
import { SavedInternships } from './components/student/SavedInternships.tsx';
import { StudentProfile } from './components/student/StudentProfile.tsx';
import { CompanyOverview } from './components/company/CompanyOverview.tsx';
import { CompanyInternships } from './components/company/CompanyInternships.tsx';
import { PostInternshipModal } from './components/company/PostInternshipModal.tsx';
import { CompanyApplications } from './components/company/CompanyApplications.tsx';
import { CompanyProfile } from './components/company/CompanyProfile.tsx';
import { AdminDashboard } from './components/admin/AdminDashboard.tsx';
import { api } from './services/api.ts';
import { Internship, Application } from './types/index.ts';
import { Loader2 } from 'lucide-react';

function MainApp() {
  const { user, loading: authLoading } = useAuth();

  // Navigation states
  const [view, setView] = useState<'landing' | 'explore' | 'dashboard'>('landing');
  const [dashboardTab, setDashboardTab] = useState<string>('overview');

  // Modal states
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'register'>('login');
  const [authDefaultRole, setAuthDefaultRole] = useState<'student' | 'company'>('student');

  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [applyingInternship, setApplyingInternship] = useState<Internship | null>(null);

  const [postModalOpen, setPostModalOpen] = useState(false);
  const [editingInternship, setEditingInternship] = useState<Internship | null>(null);

  // Application data
  const [internships, setInternships] = useState<Internship[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  // Search/category presets for explorer
  const [explorerCategory, setExplorerCategory] = useState<string>('All');
  const [explorerSearch, setExplorerSearch] = useState<string>('');

  // Fetch central listings and applications
  const loadData = useCallback(async () => {
    setDataLoading(true);
    try {
      const res = await api.internships.list();
      setInternships(res.internships);

      if (user) {
        const appsRes = await api.applications.list();
        setApplications(appsRes.applications);

        if (user.role === 'student') {
          const savedRes = await api.saved.list().catch(() => ({ savedIds: [] }));
          setSavedIds(savedRes.savedIds);
        }
      } else {
        setApplications([]);
        setSavedIds([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setDataLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Sync default view on user login/logout
  useEffect(() => {
    if (user) {
      setView('dashboard');
      setDashboardTab('overview');
    } else {
      setView('landing');
    }
  }, [user?.id]);

  // Auth Modal trigger
  const handleOpenAuth = (mode: 'login' | 'register' = 'login', role: 'student' | 'company' = 'student') => {
    setAuthInitialMode(mode);
    setAuthDefaultRole(role);
    setAuthModalOpen(true);
  };

  // Student apply trigger
  const handleApply = (internship: Internship) => {
    if (!user) {
      handleOpenAuth('register', 'student');
      return;
    }
    if (user.role !== 'student') {
      alert('Only student accounts can apply for internships. Switch to student role in the sidebar.');
      return;
    }
    setApplyingInternship(internship);
    setApplicationModalOpen(true);
  };

  // Toggle bookmark
  const handleToggleSave = async (internshipId: string) => {
    if (!user) {
      handleOpenAuth('login', 'student');
      return;
    }
    try {
      const res = await api.saved.toggle(internshipId);
      if (res.isSaved) {
        setSavedIds((prev) => [...prev, internshipId]);
      } else {
        setSavedIds((prev) => prev.filter((id) => id !== internshipId));
      }
    } catch (err) {
      console.error('Toggle save failed:', err);
    }
  };

  // Company: Edit listing
  const handleEditInternship = (item: Internship) => {
    setEditingInternship(item);
    setPostModalOpen(true);
  };

  // Company: View candidates specifically for one role
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);
  const handleViewApplicantsForRole = (roleId: string) => {
    setSelectedRoleFilter(roleId);
    setDashboardTab('candidate-applications');
  };

  const handlePostSuccess = (newOrUpdated: Internship) => {
    setInternships((prev) => {
      const idx = prev.findIndex((i) => i.id === newOrUpdated.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = newOrUpdated;
        return copy;
      }
      return [newOrUpdated, ...prev];
    });
  };

  const handleInternshipDeleted = (deletedId: string) => {
    setInternships((prev) => prev.filter((i) => i.id !== deletedId));
  };

  const handleStatusUpdated = (updatedApp: Application) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === updatedApp.id ? updatedApp : a))
    );
  };

  const handleResetSeed = async () => {
    try {
      await api.seed.reset();
      await loadData();
    } catch (err) {
      console.error('Seed reset error:', err);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
          <span>Starting InternHub Platform...</span>
        </div>
      </div>
    );
  }

  // Derived datasets
  const myCompanyInternships = user?.role === 'company'
    ? internships.filter((i) => i.companyId === user.id)
    : [];

  const savedInternshipsList = internships.filter((i) => savedIds.includes(i.id));
  const appliedIdsSet = new Set(applications.map((a) => a.internshipId));

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* View 1 & 2: Public Landing or Public Explorer */}
      {view !== 'dashboard' && (
        <>
          <Navbar
            onOpenAuth={handleOpenAuth}
            onNavigateHome={() => setView('landing')}
            onNavigateExplore={() => {
              setExplorerCategory('All');
              setExplorerSearch('');
              setView('explore');
            }}
            onNavigateCompanies={() => handleOpenAuth('register', 'company')}
            onNavigateAbout={() => {
              const el = document.getElementById('how-it-works');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
              else setView('landing');
            }}
            onNavigateDashboard={user ? () => setView('dashboard') : undefined}
          />

          {view === 'landing' ? (
            <LandingPage
              internships={internships}
              onExplore={(query, category) => {
                if (query) setExplorerSearch(query);
                if (category) setExplorerCategory(category);
                setView('explore');
              }}
              onOpenInternshipDetail={(item) => {
                setApplyingInternship(item);
                setView('explore');
              }}
              onOpenAuth={handleOpenAuth}
            />
          ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1">
              <InternshipExplorer
                internships={internships}
                applications={applications}
                savedInternshipIds={savedIds}
                onToggleSave={handleToggleSave}
                onApply={handleApply}
                initialCategory={explorerCategory}
                initialSearch={explorerSearch}
              />
            </div>
          )}
        </>
      )}

      {/* View 3: Authenticated Dashboard */}
      {view === 'dashboard' && user && (
        <DashboardLayout
          currentTab={dashboardTab}
          onSelectTab={(tab) => {
            setDashboardTab(tab);
            if (tab === 'post-internship') {
              setEditingInternship(null);
              setPostModalOpen(true);
            }
          }}
          onNavigateHome={() => setView('landing')}
          onResetSeed={handleResetSeed}
        >
          {/* Student Tabs */}
          {user.role === 'student' && (
            <>
              {dashboardTab === 'overview' && (
                <StudentOverview
                  applications={applications}
                  internships={internships}
                  savedInternshipIds={savedIds}
                  onNavigateTab={(tab) => setDashboardTab(tab)}
                  onOpenInternshipDetail={(item) => handleApply(item)}
                />
              )}

              {dashboardTab === 'explore' && (
                <InternshipExplorer
                  internships={internships}
                  applications={applications}
                  savedInternshipIds={savedIds}
                  onToggleSave={handleToggleSave}
                  onApply={handleApply}
                />
              )}

              {dashboardTab === 'applications' && (
                <MyApplications
                  applications={applications}
                  onExplore={() => setDashboardTab('explore')}
                />
              )}

              {dashboardTab === 'saved' && (
                <SavedInternships
                  savedInternships={savedInternshipsList}
                  onOpenDetail={(item) => handleApply(item)}
                  onApply={handleApply}
                  onToggleSave={handleToggleSave}
                  appliedIds={appliedIdsSet}
                  onExplore={() => setDashboardTab('explore')}
                />
              )}

              {dashboardTab === 'profile' && <StudentProfile />}

              {dashboardTab === 'settings' && (
                <div className="max-w-xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Student Account Settings</h2>
                  <p className="text-xs text-slate-500">
                    Manage email preferences, notification alerts, and session credentials.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleResetSeed}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      Reset Demo Workspace Records
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Company Tabs */}
          {user.role === 'company' && (
            <>
              {dashboardTab === 'overview' && (
                <CompanyOverview
                  myInternships={myCompanyInternships}
                  companyApplications={applications}
                  onNavigateTab={(tab) => setDashboardTab(tab)}
                  onOpenPostModal={() => {
                    setEditingInternship(null);
                    setPostModalOpen(true);
                  }}
                />
              )}

              {dashboardTab === 'my-internships' && (
                <CompanyInternships
                  internships={myCompanyInternships}
                  applications={applications}
                  onOpenPostModal={() => {
                    setEditingInternship(null);
                    setPostModalOpen(true);
                  }}
                  onEditInternship={handleEditInternship}
                  onViewApplicantsForRole={handleViewApplicantsForRole}
                  onInternshipDeleted={handleInternshipDeleted}
                />
              )}

              {dashboardTab === 'candidate-applications' && (
                <CompanyApplications
                  applications={applications}
                  internships={myCompanyInternships}
                  onStatusUpdated={handleStatusUpdated}
                  selectedFilterInternshipId={selectedRoleFilter}
                />
              )}

              {dashboardTab === 'company-profile' && <CompanyProfile />}

              {dashboardTab === 'settings' && (
                <div className="max-w-xl bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
                  <h2 className="text-base font-bold text-slate-900">Company Settings</h2>
                  <p className="text-xs text-slate-500">
                    Organization contact details, team invitations, and applicant notification channels.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={handleResetSeed}
                      className="px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors cursor-pointer"
                    >
                      Reset Demo Dataset
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Admin Tabs */}
          {user.role === 'admin' && (
            <AdminDashboard
              currentTab={dashboardTab}
              onRefreshData={loadData}
              internships={internships}
              applications={applications}
            />
          )}
        </DashboardLayout>
      )}

      {/* Global Modals */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authInitialMode}
        defaultRole={authDefaultRole}
        onSuccess={() => {
          setView('dashboard');
          loadData();
        }}
      />

      <ApplicationModal
        internship={applyingInternship}
        isOpen={applicationModalOpen}
        onClose={() => {
          setApplicationModalOpen(false);
          setApplyingInternship(null);
        }}
        onSuccess={() => {
          loadData();
          if (view === 'dashboard') {
            setDashboardTab('applications');
          }
        }}
      />

      <PostInternshipModal
        isOpen={postModalOpen}
        onClose={() => {
          setPostModalOpen(false);
          setEditingInternship(null);
        }}
        onSuccess={handlePostSuccess}
        internshipToEdit={editingInternship}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
