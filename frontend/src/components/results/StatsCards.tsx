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
    : 'No responses';

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 select-none">
      {/* Metric 1: Total Responses */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Total Submissions
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {totalCount}
        </div>
        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mt-1">
          {totalCount === 1 ? '1 response collected' : `${totalCount} responses collected`}
        </div>
      </div>

      {/* Metric 2: Completion Rate */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Completion Rate
        </div>
        <div className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          {totalCount > 0 ? '100%' : '0%'}
        </div>
        <div className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1">
          Full form submissions
        </div>
      </div>

      {/* Metric 3: Last Submission */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-2xl shadow-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-1">
          Latest Submission
        </div>
        <div className="text-xl font-bold text-slate-900 dark:text-slate-100 truncate">
          {lastSubmitted}
        </div>
        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-1">
          Real-time backend database sync
        </div>
      </div>
    </div>
  );
};
