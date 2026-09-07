'use client';

import React from 'react';

interface Props {
  currentStep: number;
  totalSteps: number;
  style?: 'percentage' | 'fraction';
  contained?: boolean;
}

export const ProgressBar: React.FC<Props> = ({ currentStep, totalSteps, style = 'percentage', contained = false }) => {
  const percentage = totalSteps > 0 ? Math.round(((currentStep + 1) / totalSteps) * 100) : 0;
  const currentFormatted = String(currentStep + 1).padStart(2, '0');
  const totalFormatted = String(totalSteps).padStart(2, '0');

  return (
    <header className={`${contained ? 'absolute' : 'fixed'} top-0 left-0 right-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between gap-3`}>
      {/* Progress Bar Container */}
      <div className="flex-1 max-w-xs bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mr-4">
        <div
          className="bg-indigo-600 h-full transition-all duration-300 ease-out rounded-full"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Step Counter */}
      <div className="text-xs font-extrabold tracking-tight text-slate-500 dark:text-slate-400">
        {style === 'percentage' ? (
          <span>{percentage}%</span>
        ) : (
          <>
            <span>{currentFormatted}</span>
            <span className="mx-1 text-slate-300 dark:text-slate-700">/</span>
            <span>{totalFormatted}</span>
          </>
        )}
      </div>
    </header>
  );
};
