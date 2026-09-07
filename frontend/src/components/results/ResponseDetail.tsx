'use client';

import React from 'react';
import { FormResponse, Question } from '@/types/form';

interface Props {
  response: FormResponse | null;
  questions: Question[];
  onClose: () => void;
}

export const ResponseDetail: React.FC<Props> = ({ response, questions, onClose }) => {
  if (!response) return null;

  const dateStr = new Date(response.submitted_at).toLocaleString();
  const answersMap = (response.answers || []).reduce<Record<string, any>>((acc, ans) => {
    acc[ans.question_id] = ans.value;
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn select-none">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
              Response Details
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Submitted on {dateStr}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Answers List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
          {questions.map((q, i) => {
            const val = answersMap[q.id];
            const displayVal = Array.isArray(val)
              ? val.join(', ')
              : val !== undefined && val !== null && val !== ''
              ? String(val)
              : '(No answer provided)';

            return (
              <div
                key={q.id}
                className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800"
              >
                <div className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                  {String(i + 1).padStart(2, '0')} • {q.title}
                </div>
                <div className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {displayVal}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
