import React from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { Building2, Globe, ShieldCheck, Mail, Calendar } from 'lucide-react';

export const CompanyProfile: React.FC = () => {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Company Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Verified company details and employer brand settings
        </p>

        <div className="mt-6 flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-xl bg-blue-100 text-blue-700 font-bold text-xl flex items-center justify-center shrink-0">
            {(user.companyName || user.name).slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.companyName || user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Verified Employer Organization
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">Industry Sector</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{user.industry || 'Technology & Software'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <Mail className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">Primary Work Email</span>
            </div>
            <p className="text-sm font-bold font-mono text-slate-900">{user.email}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Company Mission & Culture
          </h3>
          <p className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-700 leading-relaxed">
            {user.description ||
              'We build world-class tools and infrastructure. Our internship program is focused on hands-on project ownership and mentorship.'}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Registered on {new Date(user.createdAt).toLocaleDateString()}</span>
          <span className="font-mono">Company ID: {user.id}</span>
        </div>
      </div>
    </div>
  );
};
