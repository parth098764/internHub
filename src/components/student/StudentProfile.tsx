import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.tsx';
import { User, GraduationCap, BookOpen, Award, CheckCircle2 } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  if (!user) return null;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <h1 className="text-xl font-bold tracking-tight text-slate-900">Student Profile</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Your verified credentials and skills visible to hiring companies
        </p>

        <div className="mt-6 flex items-start gap-4 pb-6 border-b border-slate-100">
          <div className="w-14 h-14 rounded-full bg-indigo-100 text-indigo-700 font-bold text-lg flex items-center justify-center shrink-0">
            {user.name.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900">{user.name}</h2>
            <p className="text-xs text-slate-500">{user.email}</p>
            <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
              Verified University Student
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">Institution / University</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{user.college || 'Stanford University'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
              <BookOpen className="w-4 h-4 text-slate-400" />
              <span className="font-semibold">Major / Program</span>
            </div>
            <p className="text-sm font-bold text-slate-900">{user.course || 'B.S. in Computer Science'}</p>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
            Skills & Competencies
          </h3>
          <div className="flex flex-wrap gap-1.5">
            {(user.skills && user.skills.length > 0
              ? user.skills
              : ['React', 'TypeScript', 'Node.js', 'SQL', 'Git', 'Tailwind CSS']
            ).map((skill) => (
              <span
                key={skill}
                className="px-2.5 py-1 text-xs font-medium text-slate-700 bg-slate-100 rounded-md border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Account created on {new Date(user.createdAt).toLocaleDateString()}</span>
          <span className="font-mono">User ID: {user.id}</span>
        </div>
      </div>
    </div>
  );
};
