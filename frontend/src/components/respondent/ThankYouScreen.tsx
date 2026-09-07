'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';

interface Props {
  formTitle: string;
  completionMessage?: string;
  contained?: boolean;
}

export const ThankYouScreen: React.FC<Props> = ({ formTitle, completionMessage, contained = false }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        window.location.assign('/');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className={`${contained ? 'h-full min-h-0 py-8' : 'min-h-screen py-16'} bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center animate-fadeIn select-none`}>
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

        {/* Action Buttons to return to Home or Create a Form */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-bold text-sm transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>← Return to Home</span>
            <kbd className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400">ESC</kbd>
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-pink-600 to-indigo-600 hover:from-pink-500 hover:to-indigo-500 text-white font-bold text-sm shadow-md transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
          >
            <span>Create your own form</span>
            <span>→</span>
          </Link>
        </div>

        <div className="pt-8 border-t border-slate-800/80 text-xs text-slate-500 font-semibold tracking-wide">
          Powered by <span className="text-indigo-400 font-extrabold">Nomi</span>
        </div>
      </div>
    </div>
  );
};
