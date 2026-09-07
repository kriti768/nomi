'use client';

import React from 'react';
import { FormResponse, Question } from '@/types/form';

interface Props {
  responses: FormResponse[];
  questions: Question[];
  onSelectResponse: (resp: FormResponse) => void;
}

export const ResponseTable: React.FC<Props> = ({ responses, questions, onSelectResponse }) => {
  if (responses.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
          No responses submitted yet
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          Publish your form and share the public link to collect responses. Submitted answers will appear here in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm select-none">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <th className="py-3.5 px-4 w-12">#</th>
              <th className="py-3.5 px-4 min-w-[160px]">Submitted At</th>
              {questions.slice(0, 4).map((q) => (
                <th key={q.id} className="py-3.5 px-4 max-w-[200px] truncate">
                  {q.title}
                </th>
              ))}
              <th className="py-3.5 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            {responses.map((resp, idx) => {
              const answersMap = (resp.answers || []).reduce<Record<string, any>>((acc, ans) => {
                acc[ans.question_id] = ans.value;
                return acc;
              }, {});

              const dateStr = new Date(resp.submitted_at).toLocaleString(undefined, {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr
                  key={resp.id || idx}
                  onClick={() => onSelectResponse(resp)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-bold text-slate-400 text-xs">
                    {responses.length - idx}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 text-xs whitespace-nowrap">
                    {dateStr}
                  </td>
                  {questions.slice(0, 4).map((q) => {
                    const val = answersMap[q.id];
                    const display = Array.isArray(val) ? val.join(', ') : val ?? '—';
                    return (
                      <td key={q.id} className="py-3.5 px-4 text-slate-600 dark:text-slate-300 truncate max-w-[200px] text-xs">
                        {String(display)}
                      </td>
                    );
                  })}
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResponse(resp);
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 font-semibold text-xs hover:bg-indigo-100 transition-colors"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
