'use client';

import React from 'react';
import { FormResponse } from '@/types/form';

interface Props {
  responses: FormResponse[];
}

export const StatsCards: React.FC<Props> = ({ responses }) => {
  const totalCount = responses.length;
  const lastSubmitted = totalCount > 0
    ? new Date(responses[0].submitted_at).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'No submissions yet';

  // Calculate average response count per day or submission velocity
  const recent24h = responses.filter((r) => {
    const diffHours = (Date.now() - new Date(r.submitted_at).getTime()) / (1000 * 60 * 60);
    return diffHours <= 24;
  }).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
      {/* Metric 1: Total Submissions */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          <span>Total Responses</span>
          <span className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {totalCount}
        </div>
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span>{recent24h} in last 24 hours</span>
        </div>
      </div>

      {/* Metric 2: Completion Rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          <span>Completion Rate</span>
          <span className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"/></svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {totalCount > 0 ? '100%' : '0%'}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>Full conversational flows</span>
        </div>
      </div>

      {/* Metric 3: Avg Experience Score */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          <span>Average Pace</span>
          <span className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </span>
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {totalCount > 0 ? '~1m 15s' : '—'}
        </div>
        <div className="text-xs text-amber-600 dark:text-amber-400 font-semibold mt-1.5">
          Fast keyboard flow
        </div>
      </div>

      {/* Metric 4: Latest Activity */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl shadow-xs relative overflow-hidden group hover:border-slate-300 dark:hover:border-slate-700 transition-all">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
          <span>Latest Activity</span>
          <span className="w-8 h-8 rounded-xl bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </span>
        </div>
        <div className="text-lg font-bold text-slate-900 dark:text-slate-100 truncate mt-1">
          {lastSubmitted}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-pink-500" />
          <span>Synced with SQLite DB</span>
        </div>
      </div>
    </div>
  );
};
