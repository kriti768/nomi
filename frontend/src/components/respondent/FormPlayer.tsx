'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FormSchema } from '@/types/form';
import { QuestionRenderer } from '../fields/QuestionRenderer';
import { ProgressBar } from './ProgressBar';
import { StepNavigation } from './StepNavigation';
import { ThankYouScreen } from './ThankYouScreen';
import { api } from '@/lib/api';
import { useToast } from '@/context/ToastContext';
import { getEffectiveTheme } from '@/lib/theme';

interface Props {
  form: FormSchema;
  isPreviewMode?: boolean;
  previewViewport?: 'desktop' | 'mobile';
}

const DRAFT_EXPIRY_DAYS = 7;

export const FormPlayer: React.FC<Props> = ({ form, isPreviewMode = false, previewViewport = 'desktop' }) => {
  const { showToast } = useToast();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');

  const questions = form.questions || [];
  const currentQuestion = questions[currentIndex];
  const draftKey = `forma_draft_${form.id}`;

  const theme = getEffectiveTheme(form.theme);

  const settings = form.settings || {
    showProgressBar: true,
    showQuestionNumbers: true,
    keyboardNav: true,
    autoSaveDraft: true,
  };


  // 1. Restore Local Storage Draft on Load (if autoSaveDraft is enabled & not in preview mode)
  useEffect(() => {
    if (isPreviewMode || typeof window === 'undefined' || settings.autoSaveDraft === false) return;

    try {
      const saved = localStorage.getItem(draftKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        const now = Date.now();
        const ageDays = (now - (parsed.timestamp || 0)) / (1000 * 60 * 60 * 24);

        if (ageDays < DRAFT_EXPIRY_DAYS && parsed.answers) {
          setAnswers(parsed.answers || {});
          if (parsed.currentIndex !== undefined && parsed.currentIndex < questions.length) {
            setCurrentIndex(parsed.currentIndex);
          }
          showToast('Welcome back — continuing where you left off', 'info');
        } else {
          localStorage.removeItem(draftKey);
        }
      }
    } catch (e) {
      console.error('Failed to restore draft:', e);
    }
  }, [draftKey, isPreviewMode, questions.length, settings.autoSaveDraft, showToast]);

  // 2. Persist Local Storage Draft on Answer / Index changes (debounced)
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (isPreviewMode || isSubmitted || typeof window === 'undefined' || settings.autoSaveDraft === false) return;

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      try {
        if (Object.keys(answers).length > 0 || currentIndex > 0) {
          localStorage.setItem(
            draftKey,
            JSON.stringify({
              currentIndex,
              answers,
              timestamp: Date.now(),
            })
          );
        }
      } catch (e) {
        console.error('Failed to save draft:', e);
      }
    }, 400);

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, [answers, currentIndex, draftKey, isPreviewMode, isSubmitted, settings.autoSaveDraft]);

  const handleAnswerChange = useCallback((val: unknown) => {
    if (!currentQuestion) return;
    setErrorMsg(null);
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: val,
    }));
  }, [currentQuestion]);

  const validateCurrent = useCallback((): boolean => {
    if (!currentQuestion) return true;
    const val = answers[currentQuestion.id];

    // 1. Required Validation
    if (currentQuestion.required) {
      if (val === undefined || val === null || val === '' || (Array.isArray(val) && val.length === 0)) {
        setErrorMsg('Please answer this question to continue');
        return false;
      }
    }

    // 2. Email Validation
    if (currentQuestion.type === 'email' && val && typeof val === 'string' && val.trim() !== '') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(val.trim())) {
        setErrorMsg('Please enter a valid email address (e.g. name@example.com)');
        return false;
      }
    }

    // 3. Number Validation
    if (currentQuestion.type === 'number' && val !== undefined && val !== null && val !== '') {
      const num = Number(val);
      if (isNaN(num)) {
        setErrorMsg('Please enter a valid number');
        return false;
      }
      const min = currentQuestion.settings?.min;
      const max = currentQuestion.settings?.max;
      if (min !== undefined && num < min) {
        setErrorMsg(`Value must be at least ${min}`);
        return false;
      }
      if (max !== undefined && num > max) {
        setErrorMsg(`Value must be no more than ${max}`);
        return false;
      }
    }

    setErrorMsg(null);
    return true;
  }, [currentQuestion, answers]);

  const handleNext = useCallback(async () => {
    if (!validateCurrent()) return;

    if (currentIndex < questions.length - 1) {
      setDirection('next');
      setCurrentIndex((prev) => prev + 1);
    } else {
      // Submit response
      if (isPreviewMode) {
        setIsSubmitted(true);
        return;
      }

      try {
        setIsSubmitting(true);
        const formattedAnswers = Object.entries(answers).map(([qId, val]) => ({
          question_id: qId,
          value: val,
        }));
        await api.submitResponse(form.id, formattedAnswers);

        // Clear local draft on submission
        if (typeof window !== 'undefined') {
          localStorage.removeItem(draftKey);
        }

        setIsSubmitted(true);
      } catch (err: any) {
        setErrorMsg(err.message || 'Failed to submit response');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [currentIndex, questions.length, validateCurrent, isPreviewMode, answers, form.id, draftKey]);

  const handlePrev = useCallback(() => {
    setErrorMsg(null);
    if (currentIndex > 0) {
      setDirection('prev');
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Global Keyboard Listener for Enter, Arrow Keys, and Quick Typeform Shortcuts
  useEffect(() => {
    if (settings.keyboardNav === false) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isSubmitted) return;

      const activeElem = document.activeElement;
      const tagName = activeElem?.tagName.toLowerCase();
      const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select';

      if (tagName === 'textarea' && e.key === 'Enter' && e.shiftKey) {
        return;
      }

      // Arrow navigation
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
        return;
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
        return;
      } else if (e.key === 'Enter' && !e.shiftKey) {
        if (tagName !== 'textarea') {
          e.preventDefault();
          handleNext();
          return;
        }
      }

      // Quick answer shortcuts when not typing in text fields
      if (!isInput && currentQuestion) {
        // Yes / No shortcuts (Y / N)
        if (currentQuestion.type === 'yes_no') {
          if (e.key === 'y' || e.key === 'Y' || e.key === '1') {
            e.preventDefault();
            handleAnswerChange('Yes');
          } else if (e.key === 'n' || e.key === 'N' || e.key === '2') {
            e.preventDefault();
            handleAnswerChange('No');
          }
        }

        // Rating shortcuts (1, 2, 3, 4, 5...)
        if (currentQuestion.type === 'rating') {
          const numKey = parseInt(e.key, 10);
          const maxRating = currentQuestion.settings?.ratingMax || 5;
          if (!isNaN(numKey) && numKey >= 1 && numKey <= maxRating) {
            e.preventDefault();
            handleAnswerChange(numKey);
          }
        }

        // Multiple choice shortcuts (A, B, C, D... or 1, 2, 3...)
        if (currentQuestion.type === 'multiple_choice') {
          const choices = currentQuestion.choices || [];
          const keyUpper = e.key.toUpperCase();
          const charCode = keyUpper.charCodeAt(0);
          
          let matchedIndex = -1;
          if (keyUpper.length === 1 && charCode >= 65 && charCode < 65 + choices.length) {
            matchedIndex = charCode - 65;
          } else {
            const numKey = parseInt(e.key, 10);
            if (!isNaN(numKey) && numKey >= 1 && numKey <= choices.length) {
              matchedIndex = numKey - 1;
            }
          }

          if (matchedIndex >= 0 && matchedIndex < choices.length) {
            e.preventDefault();
            const choiceLabel = choices[matchedIndex].label;
            const allowMultiple = currentQuestion.settings?.allowMultiple || false;
            if (allowMultiple) {
              const current = Array.isArray(answers[currentQuestion.id]) ? [...answers[currentQuestion.id]] : [];
              if (current.includes(choiceLabel)) {
                handleAnswerChange(current.filter((item: string) => item !== choiceLabel));
              } else {
                handleAnswerChange([...current, choiceLabel]);
              }
            } else {
              handleAnswerChange(choiceLabel);
            }
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, handleAnswerChange, isSubmitted, settings.keyboardNav, currentQuestion, answers]);

  if (isSubmitted) {
    return (
      <ThankYouScreen
        formTitle={form.title}
        completionMessage={settings.completionMessage}
        contained={isPreviewMode && previewViewport === 'mobile'}
      />
    );
  }

  if (!currentQuestion || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6 text-center select-none">
        <h2 className="text-2xl font-bold">This form has no questions.</h2>
      </div>
    );
  }

  const stepNumber = String(currentIndex + 1).padStart(2, '0');
  const animationClass = direction === 'next' ? 'animate-slideNextIn' : 'animate-slidePrevIn';
  const alignment = theme.textAlignment === 'center' ? 'text-center items-center' : 'text-left items-start';
  const isContainedPreview = isPreviewMode && previewViewport === 'mobile';

  return (
    <div
      className={`${isContainedPreview ? 'h-full min-h-0 overflow-y-auto px-5 py-20' : 'min-h-screen px-5 sm:px-8 md:px-20 py-24'} flex flex-col justify-center relative select-none transition-colors`}
      style={{
        backgroundColor: theme.backgroundColor || '#FFFFFF',
        color: theme.textColor || '#0F172A',
        fontFamily: theme.fontFamily || 'inherit',
      }}
    >
      {/* Top Progress Bar */}
      {settings.showProgressBar !== false && (
        <ProgressBar
          currentStep={currentIndex}
          totalSteps={questions.length}
          style={settings.progressStyle || 'percentage'}
          contained={isContainedPreview}
        />
      )}

      {/* Main Conversational Question Stage with Motion */}
      <div
        key={currentQuestion.id}
        className={`max-w-2xl w-full mx-auto space-y-5 sm:space-y-6 ${animationClass} flex flex-col ${alignment}`}
      >
        {/* Step Index Badge */}
        {settings.showQuestionNumbers !== false && (
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg text-white font-black text-[13px] flex items-center justify-center shadow-xs"
              style={{ backgroundColor: theme.primaryColor || '#6366F1' }}
            >
              {stepNumber}
            </div>
            <span
              className="font-bold text-base tracking-tight"
              style={{ color: theme.primaryColor || '#6366F1' }}
            >
              →
            </span>
          </div>
        )}

        {/* Question Title */}
        <h1
          className="text-[28px] sm:text-[34px] md:text-[40px] font-extrabold leading-[1.12] tracking-tight w-full break-words"
          style={{ color: theme.textColor || 'inherit' }}
        >
          {currentQuestion.title || 'Untitled Question'}
          {currentQuestion.required && (
            <span className="text-rose-500 ml-1.5 font-bold" title="Required question">
              *
            </span>
          )}
        </h1>

        {/* Description */}
        {currentQuestion.description && (
          <p
            className="text-[15px] sm:text-base md:text-lg font-medium leading-relaxed opacity-75 w-full break-words"
            style={{ color: theme.textColor || 'inherit' }}
          >
            {currentQuestion.description}
          </p>
        )}

        {/* Question Field Input Component */}
        <div className="pt-2 sm:pt-4 w-full min-w-0">
          <QuestionRenderer
            question={currentQuestion}
            value={answers[currentQuestion.id]}
            onChange={handleAnswerChange}
            isEditable={false}
            onEnterKey={handleNext}
            theme={theme}
          />
        </div>

        {/* Validation Error Message */}
        {errorMsg && (
          <div className="flex items-center gap-2 text-rose-500 font-semibold text-sm animate-shake pt-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <StepNavigation
        isFirstStep={currentIndex === 0}
        isLastStep={currentIndex === questions.length - 1}
        isSubmitting={isSubmitting}
        onNext={handleNext}
        onPrev={handlePrev}
        contained={isContainedPreview}
      />
    </div>
  );
};
