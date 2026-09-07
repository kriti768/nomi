'use client';

import React from 'react';
import { Question, QuestionType } from '@/types/form';

interface Props {
  question: Question | null;
  onUpdateQuestion: (updated: Partial<Question>) => void;
}

const QUESTION_TYPES: { type: QuestionType; label: string }[] = [
  { type: 'short_text', label: 'Short Text' },
  { type: 'long_text', label: 'Long Text' },
  { type: 'multiple_choice', label: 'Multiple Choice' },
  { type: 'dropdown', label: 'Dropdown' },
  { type: 'email', label: 'Email' },
  { type: 'number', label: 'Number' },
  { type: 'yes_no', label: 'Yes / No' },
  { type: 'rating', label: 'Rating' },
];

export const QuestionInspector: React.FC<Props> = ({ question, onUpdateQuestion }) => {
  if (!question) {
    return (
      <aside className="hidden xl:flex w-[344px] border-l border-slate-200/80 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-900/60 p-6 items-center justify-center text-center text-slate-400 text-sm font-medium select-none shrink-0 h-[calc(100vh-4rem)]">
        Select a question from the left sidebar to edit settings.
      </aside>
    );
  }

  const choices = question.choices || [];
  const settings = question.settings || {};

  const handleChoiceChange = (index: number, newLabel: string) => {
    const updatedChoices = [...choices];
    updatedChoices[index] = { ...updatedChoices[index], label: newLabel };
    onUpdateQuestion({ choices: updatedChoices });
  };

  const handleAddChoice = () => {
    const nextNum = choices.length + 1;
    const updatedChoices = [...choices, { label: `Option ${nextNum}`, position: choices.length }];
    onUpdateQuestion({ choices: updatedChoices });
  };

  const handleDeleteChoice = (index: number) => {
    const updatedChoices = choices.filter((_, i) => i !== index);
    onUpdateQuestion({ choices: updatedChoices });
  };

  const handleSettingChange = (key: string, val: any) => {
    onUpdateQuestion({
      settings: { ...settings, [key]: val },
    });
  };

  return (
    <aside className="hidden xl:flex w-[344px] border-l border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 flex-col h-[calc(100vh-4rem)] overflow-y-auto shrink-0 select-none">
      {/* Section 1: Question Core Settings */}
      <div className="p-5 border-b border-slate-100 dark:border-slate-800/60 space-y-5">
        <span className="text-[13px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          Question
        </span>

        {/* Question Type */}
        <div>
          <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Type
          </label>
          <select
            value={question.type}
            onChange={(e) => onUpdateQuestion({ type: e.target.value as QuestionType })}
            className="w-full min-h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-[14px] font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            {QUESTION_TYPES.map((t) => (
              <option key={t.type} value={t.type}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Question Text
          </label>
          <input
            type="text"
            value={question.title || ''}
            onChange={(e) => onUpdateQuestion({ title: e.target.value })}
            placeholder="Type your question..."
            className="w-full min-h-11 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400 mb-2">
            Description
          </label>
          <textarea
            rows={2}
            value={question.description || ''}
            onChange={(e) => onUpdateQuestion({ description: e.target.value })}
            placeholder="Description (optional)..."
            className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2.5 text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500 resize-none"
          />
        </div>

        {/* Required Switch */}
        <div className="flex items-center justify-between pt-1">
          <span className="text-[14px] font-semibold text-slate-800 dark:text-slate-200">
            Required
          </span>
          <button
            type="button"
            onClick={() => onUpdateQuestion({ required: !question.required })}
            className={`w-10 h-5 rounded-full transition-colors relative flex items-center p-0.5 cursor-pointer ${
              question.required ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
          >
            <span
              className={`w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${
                question.required ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Section 2: Type-Specific Answer Settings */}
      <div className="p-5 space-y-5 flex-1">
        <span className="text-[13px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block">
          Answer Settings
        </span>

        {/* Choices Editor (Multiple Choice & Dropdown) */}
        {(question.type === 'multiple_choice' || question.type === 'dropdown') && (
          <div className="space-y-3">
            <label className="block text-[14px] font-semibold text-slate-600 dark:text-slate-400">
              Choices ({choices.length})
            </label>
            <div className="space-y-2">
              {choices.map((c, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-[10px] font-bold text-slate-400 w-4">
                    {String.fromCharCode(65 + (i % 26))}
                  </span>
                  <input
                    type="text"
                    value={c.label}
                    onChange={(e) => handleChoiceChange(i, e.target.value)}
                    className="flex-1 min-h-10 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 text-[14px] font-medium text-slate-900 dark:text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleDeleteChoice(i)}
                    className="text-slate-400 hover:text-rose-600 text-xs px-1"
                    title="Delete choice"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleAddChoice}
              className="w-full min-h-10 py-2 px-3 rounded-lg border border-dashed border-indigo-400 text-indigo-600 dark:text-indigo-400 font-bold text-[14px] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition-colors"
            >
              + Add Choice
            </button>

            {question.type === 'multiple_choice' && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Multiple Selection
                </span>
                <input
                  type="checkbox"
                  checked={settings.allowMultiple || false}
                  onChange={(e) => handleSettingChange('allowMultiple', e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
              </div>
            )}
          </div>
        )}

        {/* Rating Settings */}
        {question.type === 'rating' && (
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Steps (3 to 10)
              </label>
              <input
                type="number"
                min={3}
                max={10}
                value={settings.ratingMax || 5}
                onChange={(e) => handleSettingChange('ratingMax', parseInt(e.target.value) || 5)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Icon Style
              </label>
              <select
                value={settings.ratingShape || 'star'}
                onChange={(e) => handleSettingChange('ratingShape', e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold"
              >
                <option value="star">Star ★</option>
                <option value="heart">Heart ♥</option>
                <option value="number">Number 1-5</option>
              </select>
            </div>
          </div>
        )}

        {/* Number Range Settings */}
        {question.type === 'number' && (
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Min Value
              </label>
              <input
                type="number"
                value={settings.min !== undefined ? settings.min : ''}
                onChange={(e) => handleSettingChange('min', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="No min"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Max Value
              </label>
              <input
                type="number"
                value={settings.max !== undefined ? settings.max : ''}
                onChange={(e) => handleSettingChange('max', e.target.value === '' ? undefined : Number(e.target.value))}
                placeholder="No max"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium"
              />
            </div>
          </div>
        )}

        {/* Placeholder setting for text/email/number */}
        {(question.type === 'short_text' ||
          question.type === 'long_text' ||
          question.type === 'email' ||
          question.type === 'number') && (
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1">
              Placeholder Text
            </label>
            <input
              type="text"
              value={settings.placeholder || ''}
              onChange={(e) => handleSettingChange('placeholder', e.target.value)}
              placeholder="Custom placeholder..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-1.5 text-xs font-medium"
            />
          </div>
        )}
      </div>
    </aside>
  );
};
