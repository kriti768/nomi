'use client';

import React from 'react';
import { Question, FormTheme, FormSettings } from '@/types/form';
import { QuestionRenderer } from '../fields/QuestionRenderer';
import { getEffectiveTheme } from '@/lib/theme';

interface Props {
  question: Question | null;
  questionIndex: number;
  totalQuestions: number;
  viewportMode?: 'desktop' | 'mobile';
  theme?: FormTheme;
  settings?: FormSettings;
  onUpdateTitle: (newTitle: string) => void;
  onUpdateDescription: (newDesc: string) => void;
}

export const CanvasStage: React.FC<Props> = ({
  question,
  questionIndex,
  viewportMode = 'desktop',
  theme,
  settings,
  onUpdateTitle,
  onUpdateDescription,
}) => {
  const effectiveTheme = getEffectiveTheme(theme);

  if (!question) {
    return (
      <main className="flex-1 bg-slate-50/50 dark:bg-slate-950/50 flex items-center justify-center p-8 select-none">
        <div className="text-center max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3 text-2xl font-black shadow-xs">
            +
          </div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No question selected
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
            Select a question from the left sidebar or click "+ Add content" to create a new field.
          </p>
        </div>
      </main>
    );
  }

  const stepNumber = questionIndex + 1;
  const showQuestionNumbers = settings?.showQuestionNumbers !== false;
  const alignment = effectiveTheme.textAlignment === 'center' ? 'text-center items-center' : 'text-left items-start';

  const containerBg = effectiveTheme.backgroundColor;
  const textColor = effectiveTheme.textColor;
  const primaryColor = effectiveTheme.primaryColor;
  const fontFamily = effectiveTheme.fontFamily;
  const cornerRadius = effectiveTheme.cornerRadius ?? 12;

  const content = (
    <div
      className={`w-full mx-auto space-y-7 transition-all ${
        viewportMode === 'mobile' ? 'max-w-xs' : 'max-w-2xl'
      } flex flex-col ${alignment}`}
      style={{ fontFamily }}
    >
      {/* Step Badge */}
      {showQuestionNumbers && (
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg text-white font-black text-[13px] flex items-center justify-center shadow-xs"
            style={{ backgroundColor: primaryColor, borderRadius: `${Math.min(cornerRadius, 10)}px` }}
          >
            {stepNumber}
          </div>
          <span className="font-bold text-sm opacity-60" style={{ color: textColor }}>→</span>
        </div>
      )}

      {/* Question Title (Inline Editing) */}
      <div className="group relative w-full">
        <input
          type="text"
          value={question.title || ''}
          onChange={(e) => onUpdateTitle(e.target.value)}
          placeholder="Type your question title..."
          className="w-full bg-transparent text-[32px] md:text-[38px] font-extrabold leading-[1.15] placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none border-b-2 border-transparent focus:border-indigo-600 py-2 transition-all"
          style={{ color: textColor }}
        />
        {question.required && (
          <span className="text-rose-500 ml-1 text-2xl font-bold" title="Required question">
            *
          </span>
        )}
      </div>

      {/* Description (Inline Editing) */}
      <div className="w-full">
        <input
          type="text"
          value={question.description || ''}
          onChange={(e) => onUpdateDescription(e.target.value)}
          placeholder="Description (optional)"
          className="w-full bg-transparent text-[15px] md:text-base font-medium placeholder-slate-300 dark:placeholder-slate-700 focus:outline-none border-b border-transparent focus:border-indigo-400 py-2 transition-all opacity-75"
          style={{ color: textColor }}
        />
      </div>

      {/* WYSIWYG Answer Control Frame */}
      <div className="pt-4 w-full">
        <QuestionRenderer
          question={question}
          value={null}
          isEditable={true}
          theme={effectiveTheme}
        />
      </div>

      {/* Mock Respondent Action Button */}
      <div className="pt-6">
        <button
          type="button"
          disabled
          className="min-h-11 px-5 py-2.5 rounded-lg text-white font-bold text-sm shadow-md cursor-not-allowed opacity-90 flex items-center gap-2"
          style={{ backgroundColor: primaryColor, borderRadius: `${cornerRadius}px` }}
        >
          <span>OK</span>
          <span className="text-[10px] opacity-70 bg-white/20 px-1.5 py-0.5 rounded">↵</span>
        </button>
      </div>
    </div>
  );

  return (
    <main
      className="flex-1 flex flex-col justify-center px-8 md:px-16 py-12 overflow-y-auto select-none relative transition-colors"
      style={{ backgroundColor: viewportMode === 'desktop' ? containerBg : undefined }}
    >
      {viewportMode === 'mobile' ? (
        <div className="flex justify-center my-auto">
          <div
            className="w-[340px] min-h-[580px] border-8 border-slate-800 rounded-[42px] shadow-2xl p-6 flex flex-col justify-center relative overflow-hidden ring-1 ring-slate-700/50"
            style={{ backgroundColor: containerBg }}
          >
            {/* Mobile Top Speaker Notch */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 bg-slate-800 rounded-full" />
            {content}
          </div>
        </div>
      ) : (
        content
      )}
    </main>
  );
};
