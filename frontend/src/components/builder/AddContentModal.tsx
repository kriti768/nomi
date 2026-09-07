'use client';

import React from 'react';
import { QuestionType } from '@/types/form';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectType: (type: QuestionType) => void;
}

interface TypeOption {
  type: QuestionType;
  label: string;
  category: 'Text & Input' | 'Choice & Rating';
  description: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  icon: React.ReactNode;
}

const QUESTION_TYPES: TypeOption[] = [
  {
    type: 'short_text',
    label: 'Short Text',
    category: 'Text & Input',
    description: 'Single-line input for names, titles, or brief answers.',
    badgeBg: 'bg-sky-50 dark:bg-sky-950/50',
    badgeText: 'text-sky-600 dark:text-sky-400',
    badgeBorder: 'border-sky-200 dark:border-sky-800',
    icon: (
      <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h10M4 18h7" />
      </svg>
    ),
  },
  {
    type: 'long_text',
    label: 'Long Text',
    category: 'Text & Input',
    description: 'Multi-line textarea for detailed feedback or notes.',
    badgeBg: 'bg-indigo-50 dark:bg-indigo-950/50',
    badgeText: 'text-indigo-600 dark:text-indigo-400',
    badgeBorder: 'border-indigo-200 dark:border-indigo-800',
    icon: (
      <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 10h16M4 14h16M4 18h10" />
      </svg>
    ),
  },
  {
    type: 'email',
    label: 'Email',
    category: 'Text & Input',
    description: 'Validated input field for email addresses.',
    badgeBg: 'bg-amber-50 dark:bg-amber-950/50',
    badgeText: 'text-amber-600 dark:text-amber-400',
    badgeBorder: 'border-amber-200 dark:border-amber-800',
    icon: (
      <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    type: 'number',
    label: 'Number',
    category: 'Text & Input',
    description: 'Numeric input with configurable min and max bounds.',
    badgeBg: 'bg-rose-50 dark:bg-rose-950/50',
    badgeText: 'text-rose-600 dark:text-rose-400',
    badgeBorder: 'border-rose-200 dark:border-rose-800',
    icon: (
      <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
      </svg>
    ),
  },
  {
    type: 'multiple_choice',
    label: 'Multiple Choice',
    category: 'Choice & Rating',
    description: 'Selectable options with single or multi-select.',
    badgeBg: 'bg-purple-50 dark:bg-purple-950/50',
    badgeText: 'text-purple-600 dark:text-purple-400',
    badgeBorder: 'border-purple-200 dark:border-purple-800',
    icon: (
      <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    category: 'Choice & Rating',
    description: 'Select menu for picking one choice from a list.',
    badgeBg: 'bg-emerald-50 dark:bg-emerald-950/50',
    badgeText: 'text-emerald-600 dark:text-emerald-400',
    badgeBorder: 'border-emerald-200 dark:border-emerald-800',
    icon: (
      <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
      </svg>
    ),
  },
  {
    type: 'yes_no',
    label: 'Yes / No',
    category: 'Choice & Rating',
    description: 'Simple dual choice buttons for affirmative/negative answers.',
    badgeBg: 'bg-fuchsia-50 dark:bg-fuchsia-950/50',
    badgeText: 'text-fuchsia-600 dark:text-fuchsia-400',
    badgeBorder: 'border-fuchsia-200 dark:border-fuchsia-800',
    icon: (
      <svg className="w-5 h-5 text-fuchsia-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
  },
  {
    type: 'rating',
    label: 'Rating',
    category: 'Choice & Rating',
    description: 'Interactive rating scale with stars, numbers, or hearts.',
    badgeBg: 'bg-yellow-50 dark:bg-yellow-950/50',
    badgeText: 'text-yellow-600 dark:text-yellow-400',
    badgeBorder: 'border-yellow-200 dark:border-yellow-800',
    icon: (
      <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

export const AddContentModal: React.FC<Props> = ({ isOpen, onClose, onSelectType }) => {
  if (!isOpen) return null;

  const categories = ['Text & Input', 'Choice & Rating'] as const;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl relative max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Add Content
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Select a question type to insert into your form
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Picker Options Grouped by Category */}
        <div className="flex-1 overflow-y-auto pt-4 space-y-6 pr-1">
          {categories.map((cat) => {
            const items = QUESTION_TYPES.filter((q) => q.category === cat);
            return (
              <div key={cat}>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-3">
                  {cat}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {items.map((opt) => (
                    <button
                      key={opt.type}
                      onClick={() => {
                        onSelectType(opt.type);
                        onClose();
                      }}
                      className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-white dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-sm transition-all text-left group cursor-pointer"
                    >
                      <div className={`p-2.5 rounded-xl ${opt.badgeBg} border ${opt.badgeBorder} shadow-2xs group-hover:scale-105 transition-transform shrink-0`}>
                        {opt.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                          {opt.label}
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight mt-0.5">
                          {opt.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
