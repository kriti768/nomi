'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';

interface Props {
  question: Question;
  value: any; // string or string[]
  onChange?: (val: any) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

const LETTERS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

export const MultipleChoiceField: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  theme,
}) => {
  const allowMultiple = question.settings?.allowMultiple || false;
  const choices = question.choices && question.choices.length > 0
    ? question.choices
    : [
        { id: '1', label: 'Option 1' },
        { id: '2', label: 'Option 2' },
      ];

  const primaryColor = theme?.primaryColor || '#6366F1';
  const answerColor = theme?.answerColor || '#FFFFFF';
  const textColor = theme?.textColor || 'inherit';
  const cornerRadius = theme?.cornerRadius ?? 12;

  const isSelected = (choiceLabel: string) => {
    if (allowMultiple && Array.isArray(value)) {
      return value.includes(choiceLabel);
    }
    return value === choiceLabel;
  };

  const handleSelect = (choiceLabel: string) => {
    if (isEditable || !onChange) return;

    if (allowMultiple) {
      const current = Array.isArray(value) ? [...value] : [];
      if (current.includes(choiceLabel)) {
        onChange(current.filter((item) => item !== choiceLabel));
      } else {
        onChange([...current, choiceLabel]);
      }
    } else {
      onChange(choiceLabel);
    }
  };

  return (
    <div className="w-full max-w-xl flex flex-col gap-2.5 sm:gap-3">
      {choices.map((choice, index) => {
        const selected = isSelected(choice.label);
        const letter = LETTERS[index % LETTERS.length];

        return (
          <button
            key={choice.id || index}
            type="button"
            disabled={isEditable}
            onClick={() => handleSelect(choice.label)}
            className={`w-full min-h-14 flex items-center gap-3 px-3 sm:px-4 py-3 border-2 transition-all text-left font-medium text-[16px] sm:text-lg break-words ${
              isEditable ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
            }`}
            style={{
              borderRadius: `${cornerRadius}px`,
              backgroundColor: selected ? `${primaryColor}18` : answerColor,
              borderColor: selected ? primaryColor : 'rgba(150, 150, 150, 0.25)',
              color: textColor,
            }}
          >
            <span
              className="flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold uppercase transition-colors"
              style={{
                backgroundColor: selected ? primaryColor : 'rgba(150, 150, 150, 0.15)',
                color: selected ? '#FFFFFF' : textColor,
              }}
            >
              {letter}
            </span>
            <span className="flex-1 min-w-0 leading-snug">{choice.label}</span>
            {selected && (
              <svg className="w-5 h-5" style={{ color: primaryColor }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        );
      })}
    </div>
  );
};
