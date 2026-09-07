'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';

interface Props {
  question: Question;
  value: string; // 'Yes' | 'No'
  onChange?: (val: string) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

export const YesNoField: React.FC<Props> = ({
  value,
  onChange,
  isEditable = false,
  theme,
}) => {
  const options = [
    { label: 'Yes', key: 'Y' },
    { label: 'No', key: 'N' },
  ];

  const primaryColor = theme?.primaryColor || '#6366F1';
  const answerColor = theme?.answerColor || '#FFFFFF';
  const textColor = theme?.textColor || 'inherit';
  const cornerRadius = theme?.cornerRadius ?? 12;

  return (
    <div className="flex gap-3 sm:gap-4 w-full max-w-sm">
      {options.map((opt) => {
        const selected = value === opt.label;
        return (
          <button
            key={opt.label}
            type="button"
            disabled={isEditable}
            onClick={() => !isEditable && onChange && onChange(opt.label)}
            className={`min-h-14 flex-1 flex items-center justify-center gap-2 sm:gap-3 px-2 py-3 border-2 font-semibold text-[16px] sm:text-lg transition-all ${
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
              className="w-7 h-7 rounded-lg text-xs flex items-center justify-center font-bold uppercase"
              style={{
                backgroundColor: selected ? primaryColor : 'rgba(150, 150, 150, 0.15)',
                color: selected ? '#FFFFFF' : textColor,
              }}
            >
              {opt.key}
            </span>
            <span>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};
