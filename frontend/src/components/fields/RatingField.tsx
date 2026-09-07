'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';

interface Props {
  question: Question;
  value: number;
  onChange?: (val: number) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

export const RatingField: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  theme,
}) => {
  const max = question.settings?.ratingMax || 5;
  const shape = question.settings?.ratingShape || 'star';

  const primaryColor = theme?.primaryColor || '#6366F1';
  const answerColor = theme?.answerColor || '#FFFFFF';
  const textColor = theme?.textColor || 'inherit';
  const cornerRadius = theme?.cornerRadius ?? 12;

  const numbers = Array.from({ length: max }, (_, i) => i + 1);

  const renderIcon = (num: number, selected: boolean) => {
    if (shape === 'heart') {
      return (
        <svg
          className="w-7 h-7 transition-colors"
          style={{
            fill: selected ? primaryColor : 'none',
            stroke: selected ? primaryColor : 'rgba(150, 150, 150, 0.4)',
          }}
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    if (shape === 'star') {
      return (
        <svg
          className="w-7 h-7 transition-colors"
          style={{
            fill: selected ? primaryColor : 'none',
            stroke: selected ? primaryColor : 'rgba(150, 150, 150, 0.4)',
          }}
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      );
    }
    return (
      <span
        className="text-xl font-bold transition-colors"
        style={{ color: selected ? primaryColor : textColor }}
      >
        {num}
      </span>
    );
  };

  return (
    <div className="flex flex-wrap gap-2 sm:gap-3 items-center">
      {numbers.map((num) => {
        const selected = value >= num;
        return (
          <button
            key={num}
            type="button"
            disabled={isEditable}
            onClick={() => !isEditable && onChange && onChange(num)}
            className={`flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 md:w-14 md:h-14 border-2 transition-all ${
              isEditable ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'
            }`}
            style={{
              borderRadius: `${cornerRadius}px`,
              backgroundColor: selected ? `${primaryColor}18` : answerColor,
              borderColor: selected ? primaryColor : 'rgba(150, 150, 150, 0.25)',
            }}
          >
            {renderIcon(num, selected)}
          </button>
        );
      })}
    </div>
  );
};
