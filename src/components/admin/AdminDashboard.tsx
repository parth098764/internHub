import React, { useState, useEffect } from 'react';
import { AdminStats, User, Internship, Application } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  ShieldCheck,
  Users,
  Building2,
  Briefcase,
  FileText,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RotateCcw,
  RefreshCw,
  Search,
} from 'lucide-react';

interface AdminDashboardProps {
  currentTab: string;
  onRefreshData: () => void;
  internships: Internship[];
  applications: Application[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentTab,
  onRefreshData,
  internships,
  applications,
}) => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [searchUser, setSearchUser] = useState('');

  const loadAdminData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, usersRes] = await Promise.all([
        api.admin.stats(),
        api.admin.users(),
      ]);
      setStats(statsRes);
      setUsers(usersRes.users);
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove user "${name}"?`)) return;
    try {
      await api.admin.deleteUser(id);
      setActionMsg(`User "${name}" removed successfully.`);
      loadAdminData();
      onRefreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    }
  };

  const handleDeleteInternship = async (id: string, title: string) => {
    if (!window.confirm(`Are you sure you want to moderate and delete listing "${title}"?`)) return;
    try {
      await api.internships.delete(id);
      setActionMsg(`Internship "${title}" removed by admin.`);
      onRefreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to delete internship');
    }
  };

  const handleResetSeed = async () => {
    if (!window.confirm('Reset database to clean default demo dataset?')) return;
    try {
      await api.seed.reset();
      setActionMsg('Platform database reset to initial demonstration state.');
      loadAdminData();
      onRefreshData();
    } catch (err: any) {
      setError(err.message || 'Failed to reset seed');
    }
  };

  const filteredUsers = users.filter((u) => {
    if (!searchUser.trim()) return true;
    const q = searchUser.toLowerCase();
    return (
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Admin Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-purple-100 text-purple-700">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">
              Super Admin Console
            </span>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900 mt-1">
            System Moderation & Analytics
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Full platform oversight, role enforcement, and vacancy moderation
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleResetSeed}
            className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg border border-slate-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset Demo Seed</span>
          </button>
          <button
            onClick={loadAdminData}
            className="p-2 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{actionMsg}</span>
          </div>
          <button onClick={() => setActionMsg(null)} className="text-emerald-600 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 rounded-lg flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-red-600 cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Students</span>
            <Users className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {stats?.totalStudents ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Registered candidates</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Companies</span>
            <Building2 className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {stats?.totalCompanies ?? 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active partner accounts</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Internships</span>
            <Briefcase className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {stats?.totalInternships ?? internships.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Published opportunities</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
            <span>Total Applications</span>
            <FileText className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
            {stats?.totalApplications ?? applications.length}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Submitted through platform</span>
        </div>
      </div>

      {/* Tab 1 / Default: User Management */}
      {(currentTab === 'admin-stats' || currentTab === 'admin-users') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                User Management & Permissions
              </h2>
              <p className="text-xs text-slate-500">
                Registered platform participants ({filteredUsers.length} accounts)
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
                placeholder="Search user, email, role..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-md focus:outline-hidden focus:ring-2 focus:ring-purple-500/20"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">User</th>
                  <th className="px-5 py-3 font-semibold">Assigned Role</th>
                  <th className="px-5 py-3 font-semibold">Affiliation / Org</th>
                  <th className="px-5 py-3 font-semibold">Registered</th>
                  <th className="px-5 py-3 font-semibold text-right">Moderation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900 block">{u.name}</span>
                      <span className="text-[11px] font-mono text-slate-500">{u.email}</span>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                          u.role === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                            : u.role === 'company'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-slate-600">
                      {u.role === 'company'
                        ? u.companyName || u.name
                        : u.college || 'Stanford University'}
                    </td>

                    <td className="px-5 py-3.5 font-mono text-slate-500 tabular-nums">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          title="Delete user"
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 italic">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Internship Moderation */}
      {(currentTab === 'admin-stats' || currentTab === 'admin-internships') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Internship Directory Moderation
            </h2>
            <p className="text-xs text-slate-500">
              Audit listings, check compliance with compensation policies, and delete violations
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Listing Title</th>
                  <th className="px-5 py-3 font-semibold">Publishing Company</th>
                  <th className="px-5 py-3 font-semibold">Category & Mode</th>
                  <th className="px-5 py-3 font-semibold">Compensation</th>
                  <th className="px-5 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {internships.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900 block">{item.title}</span>
                      <span className="text-[11px] text-slate-400 font-mono">ID: {item.id}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{item.companyName}</td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {item.category} · {item.workMode}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-medium text-slate-900">
                      {item.stipend || 'Unpaid'}
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <button
                        onClick={() => handleDeleteInternship(item.id, item.title)}
                        className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                      >
                        Remove Listing
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: All Applications Overview */}
      {(currentTab === 'admin-stats' || currentTab === 'admin-applications') && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Platform-Wide Applications Stream
            </h2>
            <p className="text-xs text-slate-500">
              Complete historical submissions across all student and company interactions
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="px-5 py-3 font-semibold">Applicant</th>
                  <th className="px-5 py-3 font-semibold">Target Company</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold font-mono">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {applications.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-slate-900">{app.studentName}</span>
                      <span className="block text-[11px] text-slate-500">{app.studentEmail}</span>
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-800">{app.companyName}</td>
                    <td className="px-5 py-3.5 text-slate-700">{app.internshipTitle}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex px-2 py-0.5 rounded text-[11px] font-semibold border bg-slate-50 border-slate-200 text-slate-800">
                        {app.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-slate-500 tabular-nums">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
