import { FormTheme } from '@/types/form';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: FormTheme;
}

export const DEFAULT_THEME: FormTheme = {
  preset: 'forma_default',
  primaryColor: '#6366F1',
  backgroundColor: '#FFFFFF',
  textColor: '#0F172A',
  answerColor: '#F8FAFC',
  fontFamily: 'Plus Jakarta Sans',
  cornerRadius: 12,
  textAlignment: 'left',
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'forma_default',
    name: 'Nomi Default',
    description: 'Clean, crisp and modern minimalist indigo',
    theme: {
      preset: 'forma_default',
      primaryColor: '#6366F1',
      backgroundColor: '#FFFFFF',
      textColor: '#0F172A',
      answerColor: '#F8FAFC',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 12,
      textAlignment: 'left',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora',
    description: 'Deep emerald dark mode with vibrant neon accents',
    theme: {
      preset: 'aurora',
      primaryColor: '#10B981',
      backgroundColor: '#064E3B',
      textColor: '#ECFDF5',
      answerColor: '#065F46',
      fontFamily: 'Inter',
      cornerRadius: 16,
      textAlignment: 'left',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    description: 'Ultra-dark obsidian canvas with electric cyan highlights',
    theme: {
      preset: 'midnight',
      primaryColor: '#38BDF8',
      backgroundColor: '#090D16',
      textColor: '#F8FAFC',
      answerColor: '#1E293B',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 14,
      textAlignment: 'left',
    },
  },
  {
    id: 'forest',
    name: 'Forest',
    description: 'Organic nature greens on fresh sage backdrop',
    theme: {
      preset: 'forest',
      primaryColor: '#059669',
      backgroundColor: '#F0FDF4',
      textColor: '#14532D',
      answerColor: '#FFFFFF',
      fontFamily: 'Roboto',
      cornerRadius: 10,
      textAlignment: 'left',
    },
  },
  {
    id: 'sunset',
    name: 'Sunset',
    description: 'Warm glowing amber on soft cream with center focus',
    theme: {
      preset: 'sunset',
      primaryColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
      textColor: '#78350F',
      answerColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 16,
      textAlignment: 'center',
    },
  },
];

export const FONT_OPTIONS = [
  { label: 'Plus Jakarta Sans', value: 'Plus Jakarta Sans', category: 'Sans-serif' },
  { label: 'Inter', value: 'Inter', category: 'Sans-serif' },
  { label: 'Roboto', value: 'Roboto', category: 'Sans-serif' },
  { label: 'Playfair Display', value: 'Playfair Display', category: 'Serif' },
  { label: 'Georgia', value: 'Georgia', category: 'Serif' },
];

/**
 * Resolves a complete, safe FormTheme object from partial or undefined input,
 * falling back to the default theme for any missing attributes.
 */
export function getEffectiveTheme(theme?: Partial<FormTheme> | null): FormTheme {
  if (!theme) return { ...DEFAULT_THEME };

  return {
    preset: theme.preset || DEFAULT_THEME.preset,
    primaryColor: theme.primaryColor || DEFAULT_THEME.primaryColor,
    backgroundColor: theme.backgroundColor || DEFAULT_THEME.backgroundColor,
    textColor: theme.textColor || DEFAULT_THEME.textColor,
    answerColor: theme.answerColor || DEFAULT_THEME.answerColor,
    fontFamily: theme.fontFamily || DEFAULT_THEME.fontFamily,
    cornerRadius: typeof theme.cornerRadius === 'number' ? theme.cornerRadius : DEFAULT_THEME.cornerRadius,
    textAlignment: theme.textAlignment || DEFAULT_THEME.textAlignment,
  };
}

/**
 * Generates CSS custom properties for a theme.
 */
export function getThemeStyles(theme?: Partial<FormTheme> | null): React.CSSProperties {
  const t = getEffectiveTheme(theme);
  return {
    backgroundColor: t.backgroundColor,
    color: t.textColor,
    fontFamily: t.fontFamily,
  };
}
