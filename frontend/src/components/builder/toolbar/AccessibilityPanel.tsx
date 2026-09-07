'use client';

import React from 'react';
import { FormSchema } from '@/types/form';
import { getEffectiveTheme } from '@/lib/theme';
import { getContrastRatio } from '@/lib/accessibility';

interface Props {
  isOpen: boolean;
  form: FormSchema;
  onClose: () => void;
}

export const AccessibilityPanel: React.FC<Props> = ({ isOpen, form, onClose }) => {
  if (!isOpen) return null;

  const questions = form.questions || [];
  const questionsWithoutDesc = questions.filter((q) => !q.description || q.description.trim() === '');
  const theme = getEffectiveTheme(form.theme);
  const questionTextContrast = getContrastRatio(theme.textColor, theme.backgroundColor);
  const answerTextContrast = getContrastRatio(theme.textColor, theme.answerColor || theme.backgroundColor);
  const buttonContrast = getContrastRatio('#FFFFFF', theme.primaryColor);
  const formatRatio = (ratio: number | null) => (ratio === null ? 'Unable to calculate' : `${ratio.toFixed(1)}:1`);
  const meetsAA = (ratio: number | null) => ratio !== null && ratio >= 4.5;

  const checks = [
    {
      title: 'Question Text Contrast',
      status: meetsAA(questionTextContrast) ? 'pass' : 'warn',
      detail: `${formatRatio(questionTextContrast)} against the form background. AA requires at least 4.5:1.`,
    },
    {
      title: 'Answer Text Contrast',
      status: meetsAA(answerTextContrast) ? 'pass' : 'warn',
      detail: `${formatRatio(answerTextContrast)} against the answer background. AA requires at least 4.5:1.`,
    },
    {
      title: 'Button Contrast',
      status: meetsAA(buttonContrast) ? 'pass' : 'warn',
      detail: `${formatRatio(buttonContrast)} for white button text on the primary color. AA requires at least 4.5:1.`,
    },
    {
      title: 'Question Descriptions',
      status: questionsWithoutDesc.length === 0 ? 'pass' : 'warn',
      detail:
        questionsWithoutDesc.length === 0
          ? 'Every question includes supporting description text.'
          : `${questionsWithoutDesc.length} question(s) have no supporting description.`,
    },
    {
      title: 'Keyboard Navigation',
      status: form.settings?.keyboardNav === false ? 'warn' : 'pass',
      detail:
        form.settings?.keyboardNav === false
          ? 'Keyboard navigation is disabled in Form Settings.'
          : 'Enter and arrow-key navigation are enabled.',
    },
  ];

  const passCount = checks.filter((c) => c.status === 'pass').length;
  const score = Math.round((passCount / checks.length) * 100);

  return (
    <div className="builder-drawer fixed inset-y-0 right-0 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideNextIn select-none">
      {/* Header */}
      <div className="builder-drawer-header border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 inline-flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="4" r="2" strokeWidth="2"/><path d="M12 7v5m0 0 4 7m-4-7-4 7m4-7 6 2" strokeLinecap="round" strokeWidth="2"/></svg></span>
          <h3 className="font-extrabold text-[18px] text-slate-900 dark:text-slate-100">
            Accessibility Checker
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeWidth="2"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="builder-drawer-content flex-1 overflow-y-auto space-y-6">
        {/* Score Card */}
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 rounded-lg p-6 text-center">
          <div className="text-[40px] leading-none font-extrabold text-emerald-600 dark:text-emerald-400">
            {score}%
          </div>
          <div className="text-[15px] font-bold text-emerald-800 dark:text-emerald-300 mt-3">
            {score === 100 ? 'All Checks Passed' : 'Accessibility Review Needed'}
          </div>
          <p className="text-[13px] leading-relaxed text-emerald-700 dark:text-emerald-400/80 mt-1.5">
            {passCount} of {checks.length} lightweight checks passed.
          </p>
        </div>

        {/* Audit Checks */}
        <div className="space-y-3">
          <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-400">
            Automated Audit Results
          </label>

          <div className="space-y-3">
            {checks.map((check, i) => (
              <div
                key={i}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[15px] font-bold text-slate-800 dark:text-slate-200">
                    {check.title}
                  </span>
                  <span
                    className={`text-[12px] font-extrabold uppercase px-2.5 py-1 rounded-full ${
                      check.status === 'pass'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                    }`}
                  >
                    {check.status === 'pass' ? 'Passed' : 'Warning'}
                  </span>
                </div>
                <p className="text-[13px] text-slate-500 dark:text-slate-400 leading-relaxed">
                  {check.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
