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
  const titleTextareaRef = React.useRef<HTMLTextAreaElement>(null);
  const descTextareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize title textarea to fit content and wrap cleanly
  React.useEffect(() => {
    if (titleTextareaRef.current) {
      titleTextareaRef.current.style.height = 'auto';
      titleTextareaRef.current.style.height = `${titleTextareaRef.current.scrollHeight}px`;
    }
  }, [question?.title, viewportMode]);

  // Auto-resize description textarea
  React.useEffect(() => {
    if (descTextareaRef.current) {
      descTextareaRef.current.style.height = 'auto';
      descTextareaRef.current.style.height = `${descTextareaRef.current.scrollHeight}px`;
    }
  }, [question?.description, viewportMode]);

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
            Select a question from the left sidebar or click &quot;+ Add content&quot; to create a new field.
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
  const isMobile = viewportMode === 'mobile';

  const content = (
    <div
      className={`w-full mx-auto transition-all ${
        isMobile ? 'max-w-full space-y-5' : 'max-w-2xl space-y-6'
      } flex flex-col ${alignment}`}
      style={{ fontFamily }}
    >
      {/* Step Badge */}
      {showQuestionNumbers && (
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-white font-black text-xs sm:text-[13px] flex items-center justify-center shadow-xs"
            style={{ backgroundColor: primaryColor, borderRadius: `${Math.min(cornerRadius, 10)}px` }}
          >
            {stepNumber}
          </div>
          <span className="font-bold text-sm opacity-60" style={{ color: textColor }}>→</span>
        </div>
      )}

      {/* Question Title (Auto-Wrapping Multi-Line Inline Editing) */}
      <div className="group relative w-full">
        <textarea
          ref={titleTextareaRef}
          rows={1}
          value={question.title || ''}
          onChange={(e) => {
            onUpdateTitle(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Type your question title..."
          className={`w-full bg-transparent font-extrabold leading-tight placeholder-slate-400/60 dark:placeholder-slate-600 focus:outline-none border-b-2 border-transparent focus:border-indigo-600/60 transition-all resize-none overflow-hidden break-words whitespace-pre-wrap ${
            isMobile ? 'text-xl sm:text-2xl py-1' : 'text-2xl sm:text-3xl md:text-[36px] py-1.5'
          }`}
          style={{
            color: textColor,
            textAlign: effectiveTheme.textAlignment === 'center' ? 'center' : 'left',
          }}
        />
        {question.required && (
          <span
            className="text-rose-500 font-bold ml-1 align-top text-lg sm:text-xl inline-block"
            title="Required question"
          >
            *
          </span>
        )}
      </div>

      {/* Description (Auto-Wrapping Multi-Line Inline Editing) */}
      <div className="w-full">
        <textarea
          ref={descTextareaRef}
          rows={1}
          value={question.description || ''}
          onChange={(e) => {
            onUpdateDescription(e.target.value);
            e.target.style.height = 'auto';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          placeholder="Description (optional)"
          className={`w-full bg-transparent font-medium leading-relaxed placeholder-slate-400/50 dark:placeholder-slate-600 focus:outline-none border-b border-transparent focus:border-indigo-400/60 transition-all opacity-80 resize-none overflow-hidden break-words whitespace-pre-wrap ${
            isMobile ? 'text-xs sm:text-sm py-1' : 'text-sm sm:text-base py-1.5'
          }`}
          style={{
            color: textColor,
            textAlign: effectiveTheme.textAlignment === 'center' ? 'center' : 'left',
          }}
        />
      </div>

      {/* WYSIWYG Answer Control Frame */}
      <div className="pt-2 sm:pt-4 w-full min-w-0">
        <QuestionRenderer
          question={question}
          value={null}
          isEditable={true}
          theme={effectiveTheme}
        />
      </div>

      {/* Mock Respondent Action Button */}
      <div className="pt-4 sm:pt-6">
        <button
          type="button"
          disabled
          className="min-h-10 sm:min-h-11 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg text-white font-bold text-xs sm:text-sm shadow-md cursor-not-allowed opacity-90 flex items-center gap-2"
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
      className="flex-1 flex flex-col justify-center px-4 sm:px-8 md:px-16 py-8 md:py-12 overflow-y-auto select-none relative transition-colors"
      style={{ backgroundColor: viewportMode === 'desktop' ? containerBg : undefined }}
    >
      {viewportMode === 'mobile' ? (
        <div className="flex justify-center my-auto py-2 sm:py-4">
          <div
            className="w-full max-w-[340px] min-h-[500px] max-h-[82vh] border-[7px] sm:border-[9px] border-slate-900 dark:border-slate-800 rounded-[36px] sm:rounded-[44px] shadow-2xl p-4 sm:p-6 flex flex-col justify-center relative overflow-y-auto overflow-x-hidden ring-1 ring-slate-700/50"
            style={{ backgroundColor: containerBg }}
          >
            {/* Mobile Top Speaker Notch / Dynamic Island */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-3.5 sm:h-4 bg-slate-900 dark:bg-slate-800 rounded-full" />
            <div className="pt-4 flex-1 flex flex-col justify-center">
              {content}
            </div>
          </div>
        </div>
      ) : (
        content
      )}
    </main>
  );
};
