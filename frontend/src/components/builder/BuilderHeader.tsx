'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FormSchema } from '@/types/form';
import { api } from '@/lib/api';
import { NomiLogo } from '@/components/brand/NomiLogo';

interface Props {
  form: FormSchema;
  activeTab: 'create' | 'results';
  isPreviewMode: boolean;
  isSaving?: boolean;
  onTabChange: (tab: 'create' | 'results') => void;
  onTogglePreview: () => void;
  onFormUpdated: (updated: FormSchema) => void;
}

export const BuilderHeader: React.FC<Props> = ({
  form,
  activeTab,
  isPreviewMode,
  isSaving = false,
  onTabChange,
  onTogglePreview,
  onFormUpdated,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(form.title);
  const [actionLoading, setActionLoading] = useState(false);

  const handleTitleSubmit = async () => {
    setIsEditingTitle(false);
    if (!titleInput.trim() || titleInput === form.title) return;
    try {
      setActionLoading(true);
      const updated = await api.updateForm(form.id, { title: titleInput });
      onFormUpdated(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    try {
      setActionLoading(true);
      if (form.status === 'published') {
        const updated = await api.unpublishForm(form.id);
        onFormUpdated(updated);
      } else {
        const updated = await api.publishForm(form.id);
        onFormUpdated(updated);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoading(false);
    }
  };

  const publicUrl = `/f/${form.id}`;

  return (
    <header className="min-h-14 sm:min-h-16 border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 px-3 sm:px-4 md:px-6 flex items-center justify-between gap-2 sm:gap-4 select-none z-30 sticky top-0">
      {/* Left: Logo, Form Title & Save Indicator */}
      <div className="flex items-center gap-1.5 sm:gap-3 min-w-0 shrink">
        <Link
          href="/"
          className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0"
          title="Back to Dashboard"
        >
          <span className="hidden min-[480px]:inline">
            <NomiLogo size="sm" withWordmark={true} />
          </span>
          <span className="min-[480px]:hidden">
            <NomiLogo size="sm" withWordmark={false} />
          </span>
        </Link>

        <span className="text-slate-300 dark:text-slate-700 font-light hidden min-[360px]:inline">/</span>

        {isEditingTitle ? (
          <input
            type="text"
            value={titleInput}
            onChange={(e) => setTitleInput(e.target.value)}
            onBlur={handleTitleSubmit}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSubmit()}
            className="px-2 py-0.5 border border-indigo-500 rounded bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:outline-none text-xs sm:text-sm max-w-[100px] min-[400px]:max-w-[140px] sm:max-w-[240px]"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingTitle(true)}
            className="flex items-center gap-1 font-bold text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors truncate max-w-[90px] min-[400px]:max-w-[130px] sm:max-w-[220px] text-xs sm:text-sm"
            title="Click to edit form title"
          >
            <span className="truncate">{form.title}</span>
            <svg className="w-2.5 h-2.5 opacity-40 shrink-0 hidden sm:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
        )}

        {/* Save Status Badge */}
        <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 dark:text-slate-500 shrink-0 flex items-center gap-1">
          {isSaving ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span className="hidden sm:inline">Saving...</span>
            </>
          ) : (
            <>
              <span className="text-emerald-500 font-bold">✓</span>
              <span className="hidden sm:inline">Saved</span>
            </>
          )}
        </span>
      </div>

      {/* Center: Tabs Switcher */}
      <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 rounded-lg sm:rounded-xl shrink-0">
        <button
          onClick={() => onTabChange('create')}
          className={`px-2.5 sm:px-4 min-h-7 sm:min-h-8 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'create'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Create
        </button>
        <button
          onClick={() => onTabChange('results')}
          className={`px-2.5 sm:px-4 min-h-7 sm:min-h-8 py-0.5 sm:py-1 rounded-md sm:rounded-lg font-bold text-xs sm:text-sm transition-all ${
            activeTab === 'results'
              ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100'
          }`}
        >
          Results
        </button>
      </div>

      {/* Right: Actions (Publish is ALWAYS visible) */}
      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        {form.status === 'published' && (
          <Link
            href={publicUrl}
            target="_blank"
            className="hidden md:flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            <span>Public Link</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </Link>
        )}

        <button
          onClick={onTogglePreview}
          className={`hidden sm:flex items-center gap-2 min-h-9 px-3 py-1 rounded-lg font-bold text-xs sm:text-sm transition-colors border ${
            isPreviewMode
              ? 'bg-indigo-600 text-white border-indigo-600'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span>Preview</span>
        </button>

        <button
          onClick={handlePublishToggle}
          disabled={actionLoading}
          className={`flex items-center justify-center min-h-8 sm:min-h-9 px-3 sm:px-3.5 py-1 rounded-lg font-bold text-xs sm:text-sm shadow-xs transition-all shrink-0 ${
            form.status === 'published'
              ? 'bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white'
          }`}
        >
          {form.status === 'published' ? 'Unpublish' : 'Publish'}
        </button>
      </div>
    </header>
  );
};
