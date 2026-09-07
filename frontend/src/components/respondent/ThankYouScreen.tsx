'use client';

import React from 'react';

interface Props {
  formTitle: string;
  completionMessage?: string;
  contained?: boolean;
}

export const ThankYouScreen: React.FC<Props> = ({ formTitle, completionMessage, contained = false }) => {
  return (
    <div className={`${contained ? 'h-full min-h-0' : 'min-h-screen'} bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none`}>
      <div className="max-w-md w-full space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto text-2xl font-extrabold shadow-lg shadow-emerald-500/10">
          ✓
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
          Thank you.
        </h1>

        <p className="text-slate-400 text-base md:text-lg leading-relaxed">
          {completionMessage || `Your response to ${formTitle} has been received.`}
        </p>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-500 font-semibold tracking-wide">
          Powered by <span className="text-indigo-400 font-extrabold">Nomi</span>
        </div>
      </div>
    </div>
  );
};
