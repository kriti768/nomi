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
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl p-12 text-center text-slate-400 dark:text-slate-500 shadow-xs">
        <svg className="w-12 h-12 mx-auto mb-3 opacity-30 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h3 className="font-bold text-slate-700 dark:text-slate-300 text-base">
          No matching submissions found
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
          No responses matched your current search criteria. Try clearing the search query or submit a response on the live form.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/80 rounded-2xl overflow-hidden shadow-xs select-none">
      <div className="overflow-x-auto max-w-full">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800/80 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4 min-w-[150px]">Submitted</th>
              {questions.map((q, qIdx) => (
                <th key={q.id} className="py-3.5 px-4 min-w-[180px] max-w-[260px]">
                  <span className="text-indigo-600 dark:text-indigo-400 font-mono mr-1">Q{qIdx + 1}.</span>
                  <span className="truncate inline-block max-w-[200px] align-bottom" title={q.title}>
                    {q.title || 'Untitled'}
                  </span>
                </th>
              ))}
              <th className="py-3.5 px-4 text-right min-w-[100px]">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-xs">
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
                  className="hover:bg-slate-50/90 dark:hover:bg-slate-800/50 transition-colors cursor-pointer group"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-400 text-center">
                    {responses.length - idx}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200 whitespace-nowrap">
                    {dateStr}
                  </td>
                  {questions.map((q) => {
                    const val = answersMap[q.id];
                    const isAnswered = val !== undefined && val !== null && val !== '';
                    const display = Array.isArray(val) ? val.join(', ') : isAnswered ? String(val) : '—';

                    return (
                      <td key={q.id} className="py-3.5 px-4 max-w-[260px]">
                        <span
                          className={`line-clamp-2 break-words ${
                            isAnswered
                              ? 'text-slate-700 dark:text-slate-200 font-medium'
                              : 'text-slate-300 dark:text-slate-600 italic'
                          }`}
                          title={String(display)}
                        >
                          {String(display)}
                        </span>
                      </td>
                    );
                  })}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectResponse(resp);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-bold text-xs hover:bg-indigo-100 dark:hover:bg-indigo-900/60 transition-colors"
                    >
                      View Details →
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
