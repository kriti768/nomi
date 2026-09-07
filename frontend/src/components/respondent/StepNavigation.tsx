'use client';

import React from 'react';

interface Props {
  isFirstStep: boolean;
  isLastStep: boolean;
  isSubmitting?: boolean;
  onNext: () => void;
  onPrev: () => void;
  contained?: boolean;
}

export const StepNavigation: React.FC<Props> = ({
  isFirstStep,
  isLastStep,
  isSubmitting = false,
  onNext,
  onPrev,
  contained = false,
}) => {
  return (
    <footer className={`${contained ? 'absolute' : 'fixed'} bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3`}>
      {/* Up/Down Arrow buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirstStep || isSubmitting}
          className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Previous question (Up Arrow)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={isLastStep && isSubmitting}
          className="w-10 h-10 inline-flex items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          title="Next question (Down Arrow)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Main Continue / Submit Button */}
      <div className="flex items-center gap-3">
        <span className="hidden min-[420px]:inline text-[13px] font-semibold text-slate-400 dark:text-slate-500 whitespace-nowrap">
          press <kbd className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-[10px]">Enter ↵</kbd>
        </span>

        <button
          type="button"
          onClick={onNext}
          disabled={isSubmitting}
          className="flex items-center gap-2 px-4 sm:px-6 min-h-11 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-extrabold text-sm sm:text-[15px] shadow-lg shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-60 whitespace-nowrap"
        >
          <span>{isSubmitting ? 'Submitting...' : isLastStep ? 'Submit' : 'Continue'}</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </footer>
  );
};
