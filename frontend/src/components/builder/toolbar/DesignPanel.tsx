'use client';

import React from 'react';
import { FormTheme } from '@/types/form';
import { THEME_PRESETS, FONT_OPTIONS, getEffectiveTheme } from '@/lib/theme';

interface Props {
  isOpen: boolean;
  theme: FormTheme;
  onClose: () => void;
  onUpdateTheme: (theme: Partial<FormTheme>) => void;
}

export const DesignPanel: React.FC<Props> = ({
  isOpen,
  theme,
  onClose,
  onUpdateTheme,
}) => {
  if (!isOpen) return null;

  const currentTheme = getEffectiveTheme(theme);

  const handlePresetSelect = (presetTheme: FormTheme) => {
    onUpdateTheme(presetTheme);
  };

  return (
    <div className="builder-drawer fixed inset-y-0 right-0 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideNextIn select-none">
      {/* Header */}
      <div className="builder-drawer-header border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white text-white dark:text-black flex items-center justify-center shadow-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4 5 5 0 015-5h1a1 1 0 001-1V8a5 5 0 0110 0v1a1 1 0 001 1h1a5 5 0 015 5 4 4 0 01-4 4H7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[18px] text-slate-900 dark:text-slate-100 leading-tight">
              Design & Themes
            </h3>
            <p className="text-[13px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
              Form styling and live aesthetics
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          aria-label="Close design panel"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="builder-drawer-content flex-1 overflow-y-auto space-y-7">
        {/* Theme Presets Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[13px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Theme Presets ({THEME_PRESETS.length})
            </label>
            <span className="text-[13px] font-semibold text-indigo-600 dark:text-indigo-400">
              {THEME_PRESETS.find(p => p.id === (currentTheme.preset || 'forma_default'))?.name || 'Custom'}
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {THEME_PRESETS.map((preset) => {
              const isSelected = (currentTheme.preset || 'forma_default') === preset.id;
              const pTheme = preset.theme;
              const alignClass = pTheme.textAlignment === 'center' ? 'text-center items-center' : 'text-left items-start';

              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handlePresetSelect(pTheme)}
                  className={`p-4 rounded-lg border-2 transition-all relative cursor-pointer text-left overflow-hidden ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-600/25 shadow-sm'
                      : 'border-slate-200 dark:border-slate-750 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                  style={{ backgroundColor: pTheme.backgroundColor }}
                >
                  {/* Theme Header + Check Badge */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: pTheme.primaryColor }}
                      />
                      <span
                        className="text-[15px] font-bold"
                        style={{ color: pTheme.textColor }}
                      >
                        {preset.name}
                      </span>
                    </div>
                    {isSelected && (
                      <span
                        className="text-[12px] font-bold px-2 py-1 rounded text-white flex items-center gap-1"
                        style={{ backgroundColor: pTheme.primaryColor }}
                      >
                        Active
                      </span>
                    )}
                  </div>

                  {/* Theme Visual Preview Card: Question Text + Answer/Control + Button */}
                  <div
                    className={`p-4 rounded-lg border border-black/5 dark:border-white/5 space-y-3 flex flex-col ${alignClass}`}
                    style={{
                      fontFamily: pTheme.fontFamily,
                      backgroundColor: pTheme.backgroundColor,
                    }}
                  >
                    {/* 1. Question Text */}
                    <div className="w-full">
                      <p
                        className="text-[15px] font-extrabold truncate leading-tight"
                        style={{ color: pTheme.textColor }}
                      >
                        What is your team size?
                      </p>
                    </div>

                    {/* 2. Answer / Control */}
                    <div
                      className="w-full px-3 py-2.5 border flex items-center justify-between"
                      style={{
                        backgroundColor: pTheme.answerColor || '#FFFFFF',
                        borderColor: `${pTheme.primaryColor}55`,
                        borderRadius: `${Math.min(pTheme.cornerRadius ?? 12, 8)}px`,
                      }}
                    >
                      <span
                        className="text-[13px] font-medium opacity-85 truncate"
                        style={{ color: pTheme.textColor }}
                      >
                        10 – 50 team members
                      </span>
                      <div
                        className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white"
                        style={{ backgroundColor: pTheme.primaryColor }}
                      >
                        ✓
                      </div>
                    </div>

                    {/* 3. Action Button */}
                    <div
                      className="px-4 py-2 text-[13px] font-bold text-white inline-flex items-center gap-1 shadow-2xs"
                      style={{
                        backgroundColor: pTheme.primaryColor,
                        borderRadius: `${Math.min(pTheme.cornerRadius ?? 12, 8)}px`,
                      }}
                    >
                      <span>OK</span>
                      <span className="opacity-70 text-[11px]">↵</span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Colors Section */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Custom Colors
          </label>

          <div className="space-y-3">
            {/* Primary Accent Color */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Accent / Button
                </span>
                <span className="text-[10px] text-slate-400">Primary focus & active states</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.primaryColor}
                  onChange={(e) =>
                    onUpdateTheme({ preset: 'custom', primaryColor: e.target.value })
                  }
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-16 text-right">
                  {currentTheme.primaryColor}
                </span>
              </div>
            </div>

            {/* Background Color */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Background
                </span>
                <span className="text-[10px] text-slate-400">Page canvas backdrop</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.backgroundColor}
                  onChange={(e) =>
                    onUpdateTheme({ preset: 'custom', backgroundColor: e.target.value })
                  }
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-16 text-right">
                  {currentTheme.backgroundColor}
                </span>
              </div>
            </div>

            {/* Question Text Color */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Question Text
                </span>
                <span className="text-[10px] text-slate-400">Titles and descriptions</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.textColor}
                  onChange={(e) =>
                    onUpdateTheme({ preset: 'custom', textColor: e.target.value })
                  }
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-16 text-right">
                  {currentTheme.textColor}
                </span>
              </div>
            </div>

            {/* Answer Control Background Color */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 block">
                  Answer Cards
                </span>
                <span className="text-[10px] text-slate-400">Choice options & inputs</span>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={currentTheme.answerColor || '#FFFFFF'}
                  onChange={(e) =>
                    onUpdateTheme({ preset: 'custom', answerColor: e.target.value })
                  }
                  className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer p-0.5 bg-white dark:bg-slate-800"
                />
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 w-16 text-right">
                  {currentTheme.answerColor || '#FFFFFF'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Typography & Layout Section */}
        <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Typography & Style
          </label>

          {/* Font Family */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Font Family
            </label>
            <select
              value={currentTheme.fontFamily || 'Plus Jakarta Sans'}
              onChange={(e) =>
                onUpdateTheme({ preset: 'custom', fontFamily: e.target.value })
              }
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 cursor-pointer"
            >
              {FONT_OPTIONS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label} ({f.category})
                </option>
              ))}
            </select>
          </div>

          {/* Text Alignment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Text Alignment
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onUpdateTheme({ preset: 'custom', textAlignment: 'left' })}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  (currentTheme.textAlignment || 'left') === 'left'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h14" />
                </svg>
                <span>Left Align</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateTheme({ preset: 'custom', textAlignment: 'center' })}
                className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  currentTheme.textAlignment === 'center'
                    ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-500/20'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M5 18h14" />
                </svg>
                <span>Center Align</span>
              </button>
            </div>
          </div>

          {/* Corner Radius */}
          <div>
            <div className="flex justify-between items-center text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              <span>Corner Radius</span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                {currentTheme.cornerRadius ?? 12}px
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="24"
              step="2"
              value={currentTheme.cornerRadius ?? 12}
              onChange={(e) =>
                onUpdateTheme({
                  preset: 'custom',
                  cornerRadius: parseInt(e.target.value, 10),
                })
              }
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1">
              <span>Sharp (0px)</span>
              <span>Subtle (12px)</span>
              <span>Rounded (24px)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
