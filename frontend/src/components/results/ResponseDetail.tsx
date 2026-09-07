'use client';

import React, { useEffect, useState } from 'react';
import { FormResponse, Question } from '@/types/form';

interface Props {
  response: FormResponse | null;
  questions: Question[];
  onClose: () => void;
}

export const ResponseDetail: React.FC<Props> = ({ response, questions, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!response) return null;

  const dateStr = new Date(response.submitted_at).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const answersMap = (response.answers || []).reduce<Record<string, any>>((acc, ans) => {
    acc[ans.question_id] = ans.value;
    return acc;
  }, {});

  const handleCopyAnswer = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn select-none"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative max-h-[88vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100">
                Individual Response Record
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-mono">
              Submitted on {dateStr}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
            title="Close (Esc)"
          >
            ✕
          </button>
        </div>

        {/* Answers List */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pr-1.5">
          {questions.map((q, i) => {
            const val = answersMap[q.id];
            const hasAnswer = val !== undefined && val !== null && val !== '';
            const displayVal = Array.isArray(val)
              ? val.join(', ')
              : hasAnswer
              ? String(val)
              : '—';

            return (
              <div
                key={q.id}
                className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 space-y-2 group relative"
              >
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <span className="font-mono text-indigo-600 dark:text-indigo-400 font-extrabold">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <span>• {q.type.replace('_', ' ')}</span>
                  </span>
                  {hasAnswer && (
                    <button
                      onClick={() => handleCopyAnswer(displayVal, i)}
                      className="opacity-0 group-hover:opacity-100 text-[11px] text-indigo-600 dark:text-indigo-400 font-bold hover:underline transition-opacity flex items-center gap-1"
                    >
                      {copiedIndex === i ? '✓ Copied' : 'Copy answer'}
                    </button>
                  )}
                </div>

                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-snug">
                  {q.title || 'Untitled Question'}
                </div>

                <div
                  className={`text-sm font-semibold p-2.5 rounded-lg ${
                    hasAnswer
                      ? 'bg-white dark:bg-slate-900/90 text-slate-900 dark:text-slate-100 border border-slate-200/60 dark:border-slate-800'
                      : 'bg-transparent text-slate-400 italic'
                  }`}
                >
                  {displayVal}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>{questions.length} total questions in form</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white font-bold hover:bg-slate-800 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
