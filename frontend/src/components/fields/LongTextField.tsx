'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';

interface Props {
  question: Question;
  value: string;
  onChange?: (val: string) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

export const LongTextField: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  onEnterKey,
  theme,
}) => {
  const textColor = theme?.textColor || 'inherit';
  const cornerRadius = theme?.cornerRadius ?? 12;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !isEditable && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div className="w-full">
      <textarea
        disabled={isEditable}
        rows={4}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={question.settings?.placeholder || 'Type your detailed answer here... (Shift + Enter for new line)'}
        className="w-full max-w-2xl bg-transparent border-2 border-slate-300 dark:border-slate-700 p-3 sm:p-4 text-[16px] sm:text-lg md:text-xl font-medium placeholder-slate-400 focus:outline-none transition-colors resize-none disabled:cursor-not-allowed disabled:opacity-75"
        style={{
          color: textColor,
          borderRadius: `${cornerRadius}px`,
          borderColor: 'rgba(150, 150, 150, 0.3)',
        }}
        autoFocus={!isEditable}
      />
    </div>
  );
};
