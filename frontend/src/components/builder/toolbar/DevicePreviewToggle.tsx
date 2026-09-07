'use client';

import React from 'react';

interface Props {
  mode: 'desktop' | 'mobile';
  onChange: (mode: 'desktop' | 'mobile') => void;
}

export const DevicePreviewToggle: React.FC<Props> = ({ mode, onChange }) => {
  return (
    <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200/80 dark:border-slate-700/80 select-none">
      <button
        type="button"
        onClick={() => onChange('desktop')}
        className={`w-10 h-10 inline-flex items-center justify-center rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          mode === 'desktop'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="Desktop View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>
      <button
        type="button"
        onClick={() => onChange('mobile')}
        className={`w-10 h-10 inline-flex items-center justify-center rounded-md transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/40 ${
          mode === 'mobile'
            ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
        }`}
        title="Mobile View"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
};
