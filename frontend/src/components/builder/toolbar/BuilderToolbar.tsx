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

        {/* First-class Design Button with Colored Theme Swatch Symbol */}
        <button
          type="button"
          onClick={() => onToggleDrawer('design')}
          className={`min-h-11 inline-flex items-center gap-2.5 px-4 rounded-xl font-bold text-sm transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-purple-500/40 whitespace-nowrap ${
            isDesignActive
              ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 text-purple-600 dark:text-purple-300 ring-2 ring-purple-500/30 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-purple-50/50 dark:hover:bg-purple-950/30 hover:border-purple-300 dark:hover:border-purple-800'
          }`}
          title="Customize Theme & Design"
        >
          <span className="w-6 h-6 rounded-lg bg-linear-to-br from-pink-500 via-purple-500 to-indigo-500 text-white flex items-center justify-center shadow-xs">
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

      {/* Group 3: Utility Icon Drawers with Colored Symbols & Spacing [ Accessibility ] [ Language ] [ Settings ] */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Accessibility Button (Teal / Emerald Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('accessibility')}
          className={`h-11 px-3.5 shrink-0 inline-flex items-center gap-2 rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500/30 ${
            activeDrawer === 'accessibility'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-700 dark:text-emerald-300 ring-2 ring-emerald-500/30 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/30 hover:border-emerald-300 dark:hover:border-emerald-800'
          }`}
          title="Accessibility Checker"
        >
          <span className="w-6 h-6 rounded-lg bg-emerald-500/15 dark:bg-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="4" r="2" strokeWidth="2.5" />
              <path d="M12 7v5m0 0 4 7m-4-7-4 7m4-7 6 2" strokeLinecap="round" strokeWidth="2.5" />
            </svg>
          </span>
          <span className="hidden lg:inline text-xs font-bold text-emerald-700 dark:text-emerald-400">
            A11y
          </span>
        </button>

        {/* Language Button (Amber / Warm Gold Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('language')}
          className={`h-11 px-3.5 shrink-0 inline-flex items-center gap-2 rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500/30 ${
            activeDrawer === 'language'
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 text-amber-700 dark:text-amber-300 ring-2 ring-amber-500/30 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-50/50 dark:hover:bg-amber-950/30 hover:border-amber-300 dark:hover:border-amber-800'
          }`}
          title="Language Settings"
        >
          <span className="w-6 h-6 rounded-lg bg-amber-500/15 dark:bg-amber-500/25 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" strokeWidth="2" />
              <path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21" strokeLinecap="round" strokeWidth="2" />
            </svg>
          </span>
          <span className="hidden lg:inline text-xs font-bold text-amber-700 dark:text-amber-400">
            Lang
          </span>
        </button>

        {/* Form Settings Button (Rose / Pink Drawing) */}
        <button
          type="button"
          onClick={() => onToggleDrawer('settings')}
          className={`h-11 px-3.5 shrink-0 inline-flex items-center gap-2 rounded-xl transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500/30 ${
            activeDrawer === 'settings'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-700 dark:text-rose-300 ring-2 ring-rose-500/30 shadow-xs'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 hover:border-rose-300 dark:hover:border-rose-800'
          }`}
          title="Form Settings"
        >
          <span className="w-6 h-6 rounded-lg bg-rose-500/15 dark:bg-rose-500/25 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="3" strokeWidth="2.5" />
              <path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.1 2.1-.06-.06A1.7 1.7 0 0015.76 19a1.7 1.7 0 00-1.05 1.56V21h-3v-.44A1.7 1.7 0 0010.66 19a1.7 1.7 0 00-1.88-.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 007 14.68 1.7 1.7 0 005.44 13.6H5v-3h.44A1.7 1.7 0 007 9.56a1.7 1.7 0 00-.34-1.88l-.06-.06 2.1-2.1.06.06A1.7 1.7 0 0010.64 6a1.7 1.7 0 001.07-1.56V4h3v.44A1.7 1.7 0 0015.76 6a1.7 1.7 0 001.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 00-.34 1.88A1.7 1.7 0 0020.96 10.7H21v3h-.44A1.7 1.7 0 0019.4 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            </svg>
          </span>
          <span className="hidden lg:inline text-xs font-bold text-rose-700 dark:text-rose-400">
            Settings
          </span>
        </button>
      </div>
    </div>
  );
};
