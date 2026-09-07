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
    <div className="min-h-14 border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 px-4 md:px-6 flex items-center justify-between gap-3 select-none z-20 sticky top-14 overflow-x-auto">
      {/* Group 1: Primary Actions [ + Add content ] [ Design ] */}
      <div className="flex items-center gap-2">
        {/* + Add Content */}
        <button
          type="button"
          onClick={onOpenAddContent}
          className="min-h-10 inline-flex items-center gap-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 active:bg-slate-950 dark:bg-indigo-600 dark:hover:bg-indigo-500 text-white font-semibold text-sm shadow-xs transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40 whitespace-nowrap"
          title="Add a new question or block"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
          </svg>
          <span>Add content</span>
        </button>

        {/* First-class Design Button */}
        <button
          type="button"
          onClick={() => onToggleDrawer('design')}
          className={`min-h-10 inline-flex items-center gap-2 px-3 rounded-lg font-semibold text-sm transition-all cursor-pointer border focus:outline-none focus:ring-2 focus:ring-indigo-500/40 whitespace-nowrap ${
            isDesignActive
              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title="Customize Theme & Design"
        >
          <svg className="w-5 h-5 text-indigo-500 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a1 1 0 001-1V8a5 5 0 0110 0v1a1 1 0 001 1h1a5 5 0 015 5 4 4 0 01-4 4H7z" />
          </svg>
          <span>Design</span>
        </button>
      </div>

      {/* Group 2: [ Device ] [ Preview ] separated by subtle divider */}
      <div className="flex items-center gap-2">
        {/* Subtle Separator */}
        <div className="w-[1px] h-4.5 bg-slate-200 dark:bg-slate-800 mx-0.5" />

        {/* Device Viewport Toggle */}
        <DevicePreviewToggle mode={viewportMode} onChange={onChangeViewport} />

        {/* Preview Button */}
        <button
          type="button"
          onClick={onLaunchPreview}
          className="min-h-10 inline-flex items-center gap-2 px-3 rounded-lg font-semibold text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 transition-colors shadow-2xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 whitespace-nowrap"
          title="Launch Preview Sandbox"
        >
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Preview</span>
        </button>

        {/* Subtle Separator */}
        <div className="w-[1px] h-4.5 bg-slate-200 dark:bg-slate-800 mx-0.5" />
      </div>

      {/* Group 3: Utility Icon Drawers [ Accessibility ] [ Language ] [ Settings ] */}
      <div className="flex items-center gap-1.5">
        {/* Accessibility Button */}
        <button
          type="button"
          onClick={() => onToggleDrawer('accessibility')}
          className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            activeDrawer === 'accessibility'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title="Accessibility Checker"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="4" r="2" strokeWidth="2"/><path d="M12 7v5m0 0 4 7m-4-7-4 7m4-7 6 2" strokeLinecap="round" strokeWidth="2"/></svg>
        </button>

        {/* Language Button */}
        <button
          type="button"
          onClick={() => onToggleDrawer('language')}
          className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            activeDrawer === 'language'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title="Language Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" strokeWidth="2"/><path d="M3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21M12 3C9.5 5.5 8.5 8.5 8.5 12S9.5 18.5 12 21" strokeLinecap="round" strokeWidth="2"/></svg>
        </button>

        {/* Form Settings Button */}
        <button
          type="button"
          onClick={() => onToggleDrawer('settings')}
          className={`w-10 h-10 shrink-0 inline-flex items-center justify-center rounded-lg transition-all border cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
            activeDrawer === 'settings'
              ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-400'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
          }`}
          title="Form Settings"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.1 2.1-.06-.06A1.7 1.7 0 0015.76 19a1.7 1.7 0 00-1.05 1.56V21h-3v-.44A1.7 1.7 0 0010.66 19a1.7 1.7 0 00-1.88-.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 007 14.68 1.7 1.7 0 005.44 13.6H5v-3h.44A1.7 1.7 0 007 9.56a1.7 1.7 0 00-.34-1.88l-.06-.06 2.1-2.1.06.06A1.7 1.7 0 0010.64 6a1.7 1.7 0 001.07-1.56V4h3v.44A1.7 1.7 0 0015.76 6a1.7 1.7 0 001.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 00-.34 1.88A1.7 1.7 0 0020.96 10.7H21v3h-.44A1.7 1.7 0 0019.4 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg>
        </button>
      </div>
    </div>
  );
};
