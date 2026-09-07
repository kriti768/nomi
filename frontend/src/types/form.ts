export type QuestionType =
  | 'short_text'
  | 'long_text'
  | 'multiple_choice'
  | 'dropdown'
  | 'email'
  | 'number'
  | 'yes_no'
  | 'rating';

export interface QuestionChoice {
  id?: string;
  label: string;
  position?: number;
}

export interface QuestionSettings {
  placeholder?: string;
  allowMultiple?: boolean;
  ratingMax?: number;
  ratingShape?: 'star' | 'number' | 'heart';
  min?: number;
  max?: number;
}

export interface Question {
  id: string;
  form_id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  position: number;
  choices?: QuestionChoice[];
  settings?: QuestionSettings;
  logic?: Record<string, any>[];
}

export interface FormTheme {
  preset?: string;
  primaryColor: string;
  backgroundColor: string;
  textColor: string;
  answerColor?: string;
  fontFamily: string;
  cornerRadius?: number;
  textAlignment?: 'left' | 'center';
}

export interface FormSettings {
  showProgressBar?: boolean;
  showQuestionNumbers?: boolean;
  keyboardNav?: boolean;
  autoSaveDraft?: boolean;
  progressStyle?: 'percentage' | 'fraction';
  completionMessage?: string;
  collectResponses?: boolean;
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'published';
  language?: string;
  theme: FormTheme;
  settings?: FormSettings;
  questions: Question[];
  created_at: string;
  updated_at: string;
}

export interface Answer {
  id?: string;
  question_id: string;
  value: any;
}

export interface FormResponse {
  id: string;
  form_id: string;
  submitted_at: string;
  answers: Answer[];
}
