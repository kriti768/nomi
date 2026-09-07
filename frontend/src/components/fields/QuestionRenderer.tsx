'use client';

import React from 'react';
import { Question, FormTheme } from '@/types/form';
import { ShortTextField } from './ShortTextField';
import { LongTextField } from './LongTextField';
import { MultipleChoiceField } from './MultipleChoiceField';
import { DropdownField } from './DropdownField';
import { EmailField } from './EmailField';
import { NumberField } from './NumberField';
import { YesNoField } from './YesNoField';
import { RatingField } from './RatingField';

interface Props {
  question: Question;
  value: any;
  onChange?: (val: any) => void;
  isEditable?: boolean;
  onEnterKey?: () => void;
  theme?: FormTheme;
}

export const QuestionRenderer: React.FC<Props> = ({
  question,
  value,
  onChange,
  isEditable = false,
  onEnterKey,
  theme,
}) => {
  switch (question.type) {
    case 'short_text':
      return (
        <ShortTextField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'long_text':
      return (
        <LongTextField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'multiple_choice':
      return (
        <MultipleChoiceField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'dropdown':
      return (
        <DropdownField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'email':
      return (
        <EmailField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'number':
      return (
        <NumberField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'yes_no':
      return (
        <YesNoField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    case 'rating':
      return (
        <RatingField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
    default:
      return (
        <ShortTextField
          question={question}
          value={value}
          onChange={onChange}
          isEditable={isEditable}
          onEnterKey={onEnterKey}
          theme={theme}
        />
      );
  }
};

