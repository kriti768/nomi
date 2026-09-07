'use client';

import React from 'react';
import { FormSchema, FormSettings } from '@/types/form';

interface Props {
  isOpen: boolean;
  form: FormSchema;
  onClose: () => void;
  onUpdateForm: (data: Partial<FormSchema>) => void;
  onUpdateSettings: (settings: Partial<FormSettings>) => void;
  onTogglePublished: () => void;
  onDeleteForm: () => void;
  onClearResponses: () => void;
}

export const FormSettingsPanel: React.FC<Props> = ({
  isOpen,
  form,
  onClose,
  onUpdateForm,
  onUpdateSettings,
  onTogglePublished,
  onDeleteForm,
  onClearResponses,
}) => {
  if (!isOpen) return null;

  const settings: FormSettings = form.settings || {
    showProgressBar: true,
    showQuestionNumbers: true,
    keyboardNav: true,
    autoSaveDraft: true,
    progressStyle: 'percentage',
    completionMessage: 'Your response has been received.',
    collectResponses: true,
  };

  return (
    <div className="builder-drawer fixed inset-y-0 right-0 z-50 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col animate-slideNextIn select-none">
      {/* Header */}
      <div className="builder-drawer-header border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 inline-flex items-center justify-center"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3" strokeWidth="2"/><path d="M19.4 15a1.7 1.7 0 00.34 1.88l.06.06-2.1 2.1-.06-.06A1.7 1.7 0 0015.76 19a1.7 1.7 0 00-1.05 1.56V21h-3v-.44A1.7 1.7 0 0010.66 19a1.7 1.7 0 00-1.88-.34l-.06.06-2.1-2.1.06-.06A1.7 1.7 0 007 14.68 1.7 1.7 0 005.44 13.6H5v-3h.44A1.7 1.7 0 007 9.56a1.7 1.7 0 00-.34-1.88l-.06-.06 2.1-2.1.06.06A1.7 1.7 0 0010.64 6a1.7 1.7 0 001.07-1.56V4h3v.44A1.7 1.7 0 0015.76 6a1.7 1.7 0 001.88-.34l.06-.06 2.1 2.1-.06.06a1.7 1.7 0 00-.34 1.88A1.7 1.7 0 0020.96 10.7H21v3h-.44A1.7 1.7 0 0019.4 15z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"/></svg></span>
          <h3 className="font-extrabold text-[18px] text-slate-900 dark:text-slate-100">
            Form Settings
          </h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" strokeWidth="2"/></svg>
        </button>
      </div>

      {/* Content */}
      <div className="builder-drawer-content flex-1 overflow-y-auto space-y-6">
        {/* Section 1: General */}
        <div className="space-y-3">
          <label className="block text-[13px] font-bold uppercase tracking-wider text-slate-400">
            General
          </label>
          <div>
            <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Form Title
            </label>
            <input
              type="text"
              value={form.title || ''}
              onChange={(e) => onUpdateForm({ title: e.target.value })}
              className="w-full min-h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
              Form Description
            </label>
            <textarea
              rows={2}
              value={form.description || ''}
              onChange={(e) => onUpdateForm({ description: e.target.value })}
              placeholder="Add form description..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Section 2: Behavior */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Behavior & Navigation
          </label>

          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Show Progress Bar
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ showProgressBar: settings.showProgressBar === false })}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  settings.showProgressBar !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    settings.showProgressBar !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Show Question Numbers (01 →)
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ showQuestionNumbers: settings.showQuestionNumbers === false })}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  settings.showQuestionNumbers !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    settings.showQuestionNumbers !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Keyboard Navigation
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ keyboardNav: settings.keyboardNav === false })}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  settings.keyboardNav !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
                aria-label="Toggle keyboard navigation"
                aria-pressed={settings.keyboardNav !== false}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    settings.keyboardNav !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Autosave Respondent Progress
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ autoSaveDraft: settings.autoSaveDraft === false })}
                className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                  settings.autoSaveDraft !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    settings.autoSaveDraft !== false ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Section 3: Respondent Experience */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Respondent Experience
          </label>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Progress Bar Style
            </label>
            <select
              value={settings.progressStyle || 'percentage'}
              onChange={(e) => onUpdateSettings({ progressStyle: e.target.value as FormSettings['progressStyle'] })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="percentage">Percentage (100%)</option>
              <option value="fraction">Fraction (01 / 06)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Completion Message
            </label>
            <textarea
              rows={2}
              value={settings.completionMessage || 'Your response has been received.'}
              onChange={(e) => onUpdateSettings({ completionMessage: e.target.value })}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>
        </div>

        {/* Section 4: Form */}
        <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">
            Form
          </label>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Published</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {form.status === 'published' ? 'Respondents can open this form' : 'Only you can preview this form'}
              </div>
            </div>
            <button
              type="button"
              onClick={onTogglePublished}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                form.status === 'published' ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle form publication"
              aria-pressed={form.status === 'published'}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  form.status === 'published' ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">Collect Responses</div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                {settings.collectResponses !== false ? 'Accept new submissions' : 'Pause new submissions'}
              </div>
            </div>
            <button
              type="button"
              onClick={() => onUpdateSettings({ collectResponses: settings.collectResponses === false })}
              className={`w-9 h-5 rounded-full transition-colors relative flex items-center p-0.5 ${
                settings.collectResponses !== false ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
              aria-label="Toggle response collection"
              aria-pressed={settings.collectResponses !== false}
            >
              <span
                className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                  settings.collectResponses !== false ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Section 5: Danger Zone */}
        <div className="space-y-3 pt-2 border-t border-rose-100 dark:border-rose-950/40">
          <label className="block text-xs font-bold uppercase tracking-wider text-rose-500">
            Danger Zone
          </label>

          <div className="space-y-2">
            <button
              type="button"
              onClick={onClearResponses}
              className="w-full py-2 px-3 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 text-xs font-bold hover:bg-rose-100 dark:hover:bg-rose-950/50 transition-colors text-left"
            >
              Clear All Submitted Responses
            </button>

            <button
              type="button"
              onClick={onDeleteForm}
              className="w-full py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs transition-colors text-left"
            >
              Delete This Form Permanently
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
