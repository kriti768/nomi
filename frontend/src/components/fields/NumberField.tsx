'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';

interface Props {
  question: Question;
  value: string | number;
  onChange?: (val: string) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

export const NumberField: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  onEnterKey,
  theme,
}) => {
  const textColor = theme?.textColor || 'inherit';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isEditable && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div className="w-full">
      <input
        type="number"
        disabled={isEditable}
        value={value ?? ''}
        min={question.settings?.min}
        max={question.settings?.max}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={question.settings?.placeholder || 'Type a number...'}
        className="w-full max-w-xl bg-transparent border-b-2 border-slate-300 dark:border-slate-700 py-3 text-[18px] sm:text-xl md:text-2xl font-medium placeholder-slate-400 focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-75"
        style={{
          color: textColor,
          borderBottomColor: 'rgba(150, 150, 150, 0.3)',
        }}
        autoFocus={!isEditable}
      />
    </div>
  );
};
