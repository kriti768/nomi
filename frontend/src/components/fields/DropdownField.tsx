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

export const DropdownField: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  onEnterKey,
  theme,
}) => {
  const choices = question.choices && question.choices.length > 0
    ? question.choices
    : [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ];

  const answerColor = theme?.answerColor || '#FFFFFF';
  const textColor = theme?.textColor || 'inherit';
  const cornerRadius = theme?.cornerRadius ?? 12;

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === 'Enter' && !isEditable && onEnterKey) {
      e.preventDefault();
      onEnterKey();
    }
  };

  return (
    <div className="w-full max-w-xl">
      <select
        disabled={isEditable}
        value={value || ''}
        onChange={(e) => onChange && onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full min-h-14 border-2 px-3 sm:px-4 py-3 text-[16px] sm:text-lg font-medium focus:outline-none transition-colors disabled:cursor-not-allowed disabled:opacity-75 cursor-pointer"
        style={{
          borderRadius: `${cornerRadius}px`,
          backgroundColor: answerColor,
          borderColor: 'rgba(150, 150, 150, 0.25)',
          color: textColor,
        }}
        autoFocus={!isEditable}
      >
        <option value="" disabled>
          Select an option...
        </option>
        {choices.map((choice, index) => (
          <option key={choice.id || index} value={choice.label}>
            {choice.label}
          </option>
        ))}
      </select>
    </div>
  );
};
