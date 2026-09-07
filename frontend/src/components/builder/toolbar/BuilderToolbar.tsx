'use client';

import React from 'react';
import { DevicePreviewToggle } from './DevicePreviewToggle';

interface Props {
  activeDrawer: 'design' | 'accessibility' | 'language' | 'settings' | null;
  viewportMode: 'desktop' | 'mobile';
  onToggleDrawer: (drawer: 'design' | 'accessibility' | 'language' | 'settings') => void;
  onChangeViewport: (mode: 'desktop' | 'mobile') => void;
  onOpenAddContent: () => void;
  onLaunchPreview: () => void;
}

export const BuilderToolbar: React.FC<Props> = ({
  activeDrawer,
  viewportMode,
  onToggleDrawer,
  onChangeViewport,
  onOpenAddContent,
  onLaunchPreview,
}) => {
  const isDesignActive = activeDrawer === 'design';

  return (
    <div className="min-h-16 border-b border-slate-200/90 dark:border-slate-800/90 bg-white/95 dark:bg-slate-900/95 px-4 sm:px-6 md:px-8 flex items-center justify-between gap-4 md:gap-8 select-none z-20 sticky top-14 overflow-x-auto">
      {/* Group 1: Primary Actions [ + Add content ] [ Design ] */}
      <div className="flex items-center gap-3 shrink-0">
        {/* + Add Content */}
        <button
          type="button"
          onClick={onOpenAddContent}
          className="min-h-11 inline-flex items-center gap-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 active:scale-[0.98] dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-bold text-sm shadow-sm transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 whitespace-nowrap"
          title="Add a new question or block"
        >
          <span className="w-5 h-5 rounded-lg bg-white/20 text-white flex items-center justify-center text-sm font-black leading-none">
            +
          </span>
          <span>Add content</span>
        </button>

        {/* First-class Design Button with Sleek Black Logo Symbol */}
        <button
          type="button"
          onClick={() => onToggleDrawer('design')}
          className={`min-h-11 inline-flex items-center gap-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-slate-900/40 whitespace-nowrap ${
            isDesignActive
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          }`}
          title="Customize Theme & Design"
        >
          <span className={`w-6 h-6 rounded-lg ${isDesignActive ? 'bg-white/20 text-white' : 'bg-black dark:bg-white text-white dark:text-black'} flex items-center justify-center shadow-xs`}>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a1 1 0 001-1V8a5 5 0 0110 0v1a1 1 0 001 1h1a5 5 0 015 5 4 4 0 01-4 4H7z" />
            </svg>
          </span>
          <span>Design</span>
        </button>
      </div>

      {/* Group 2: [ Device Viewport ] [ Preview ] */}
      <div className="flex items-center gap-4 shrink-0">
        {/* Device Viewport Toggle */}
        <DevicePreviewToggle mode={viewportMode} onChange={onChangeViewport} />

        {/* Preview Button */}
        <button
          type="button"
          onClick={onLaunchPreview}
          className="min-h-11 inline-flex items-center gap-2 px-4 rounded-xl font-bold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 whitespace-nowrap"
          title="Launch Preview Sandbox"
        >
          <span className="w-6 h-6 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span>Preview</span>
        </button>
      </div>

      {/* Group 3: Utility Icon Drawers with Pure Colored Symbols & Spacing [ Accessibility ] [ Language ] [ Settings ] */}
      <div className="flex items-center gap-3.5 sm:gap-4 shrink-0">
        {/* Accessibility Button (Emerald Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('accessibility')}
          className={`w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/40 ${
            activeDrawer === 'accessibility'
              ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20 scale-105'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:border-emerald-300 dark:hover:border-emerald-700 shadow-xs'
          }`}
          title="Accessibility Checker"
          aria-label="Accessibility Checker"
        >
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeDrawer === 'accessibility' ? 'bg-white/20 text-white' : 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="4" r="2" strokeWidth="2.5" />
              <path d="M12 7v5m0 0 4 7m-4-7-4 7m4-7 6 2" strokeLinecap="round" strokeWidth="2.5" />
            </svg>
          </span>
        </button>

        {/* Language Button (Amber / Warm Gold Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('language')}
          className={`w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/40 ${
            activeDrawer === 'language'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 scale-105'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/40 hover:border-amber-300 dark:hover:border-amber-700 shadow-xs'
          }`}
          title="Language Settings"
          aria-label="Language Settings"
        >
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeDrawer === 'language' ? 'bg-white/20 text-white' : 'bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
        </button>

        {/* Form Settings Button (Rose / Pink Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('settings')}
          className={`w-11 h-11 shrink-0 inline-flex items-center justify-center rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/40 ${
            activeDrawer === 'settings'
              ? 'bg-rose-500 text-white border-rose-600 shadow-md shadow-rose-500/20 scale-105'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:border-rose-300 dark:hover:border-rose-700 shadow-xs'
          }`}
          title="Form Settings"
          aria-label="Form Settings"
        >
          <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${activeDrawer === 'settings' ? 'bg-white/20 text-white' : 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" strokeWidth="2.5" />
              <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.1 2.1-.06-.06A1.7 1.7 0 0015.76 19a1.7 1.7 0 00-1.05 1.56V21h-3v-.44A1.7 1.7 0 0010.66 19a1.7 1.7 0 00-1.88-.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 007 14.68 1.7 1.7 0 005.44 13.6H5v-3h.44A1.7 1.7 0 007 9.56a1.7 1.7 0 00-.34-1.88l-.06-.06 2.1-2.1.06.06A1.7 1.7 0 0010.64 6a1.7 1.7 0 001.07-1.56V4h3v.44A1.7 1.7 0 0015.76 6a1.7 1.7 0 001.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 00-.34 1.88A1.7 1.7 0 0020.96 10.7H21v3h-.44A1.7 1.7 0 0019.4 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};
