'use client';

import React from 'react';

interface Props {
  isOpen: boolean;
  language: string;
  onClose: () => void;
  onUpdateLanguage: (lang: string) => void;
}

const LANGUAGE_OPTIONS = [
  { code: 'en', name: 'English', available: true },
  { code: 'hi', name: 'Hindi', available: false },
  { code: 'es', name: 'Spanish', available: false },
  { code: 'fr', name: 'French', available: false },
  { code: 'de', name: 'German', available: false },
  { code: 'pt', name: 'Portuguese', available: false },
] as const;

export const LanguagePanel: React.FC<Props> = ({
  isOpen,
  language,
  onClose,
  onUpdateLanguage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="builder-drawer fixed inset-y-0 right-0 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideNextIn select-none">
      {/* Header */}
      <div className="builder-drawer-header border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 inline-flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21" strokeLinecap="round" strokeWidth="2"/></svg></span>
          <h3 className="font-extrabold text-[18px] text-slate-900 dark:text-slate-100">
            Form Language
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
        <div>
          <label htmlFor="form-language" className="block text-[13px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Form Language
          </label>
          <p className="text-[14px] leading-relaxed text-slate-600 dark:text-slate-400 mb-4">Choose the language used for your form&apos;s system messages and respondent interface.</p>
          <select
            id="form-language"
            value={language || 'en'}
            onChange={(event) => onUpdateLanguage(event.target.value)}
            className="w-full min-h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-[15px] font-semibold text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}{option.available ? '' : ' (Coming soon)'}
              </option>
            ))}
          </select>
        </div>
        <div className="builder-drawer-section border-t border-slate-100 dark:border-slate-800">
          <h4 className="text-[13px] font-bold uppercase tracking-wider text-slate-400">Available Languages</h4>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {LANGUAGE_OPTIONS.map((option) => (
              <div key={option.code} className="rounded-lg border border-slate-200 dark:border-slate-800 px-3 py-2.5 text-[14px] text-slate-700 dark:text-slate-300">
                <div className="font-semibold">{option.name}</div>
                <div className="text-[12px] text-slate-400 mt-0.5">{option.available ? 'Available now' : 'Coming soon'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
