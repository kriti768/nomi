import { FormTheme } from '@/types/form';

export interface ThemePreset {
  id: string;
  name: string;
  description: string;
  theme: FormTheme;
}

export const DEFAULT_THEME: FormTheme = {
  preset: 'forma_default',
  primaryColor: '#c65a87',
  backgroundColor: '#fff9f8',
  textColor: '#29202c',
  answerColor: '#ffffff',
  fontFamily: 'Plus Jakarta Sans',
  cornerRadius: 14,
  textAlignment: 'left',
};

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'forma_default',
    name: 'Nomi Signature',
    description: 'Signature warm blush pink with editorial typography and gentle contrast',
    theme: {
      preset: 'forma_default',
      primaryColor: '#c65a87',
      backgroundColor: '#fff9f8',
      textColor: '#29202c',
      answerColor: '#ffffff',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 14,
      textAlignment: 'left',
    },
  },
  {
    id: 'bubblegum',
    name: 'Bubblegum Pop',
    description: 'Playful vibrant candy pink on soft strawberry cream',
    theme: {
      preset: 'bubblegum',
      primaryColor: '#EC4899',
      backgroundColor: '#FDF2F8',
      textColor: '#831843',
      answerColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 18,
      textAlignment: 'left',
    },
  },
  {
    id: 'cyber_neon',
    name: 'Cyber Neon',
    description: 'Electric lime green glows on deep space obsidian',
    theme: {
      preset: 'cyber_neon',
      primaryColor: '#22C55E',
      backgroundColor: '#050811',
      textColor: '#F0FDF4',
      answerColor: '#0F172A',
      fontFamily: 'Inter',
      cornerRadius: 8,
      textAlignment: 'left',
    },
  },
  {
    id: 'lavender_mist',
    name: 'Lavender Mist',
    description: 'Dreamy soft lilac backdrop with royal violet highlights',
    theme: {
      preset: 'lavender_mist',
      primaryColor: '#8B5CF6',
      backgroundColor: '#F5F3FF',
      textColor: '#4C1D95',
      answerColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 16,
      textAlignment: 'left',
    },
  },
  {
    id: 'matcha',
    name: 'Matcha Latte',
    description: 'Fresh earthy matcha green on warm oat milk cream',
    theme: {
      preset: 'matcha',
      primaryColor: '#65A30D',
      backgroundColor: '#FEFCE8',
      textColor: '#365314',
      answerColor: '#FFFFFF',
      fontFamily: 'Roboto',
      cornerRadius: 16,
      textAlignment: 'center',
    },
  },
  {
    id: 'solar_flare',
    name: 'Solar Flare',
    description: 'Fiery neon coral glowing against warm volcanic charcoal',
    theme: {
      preset: 'solar_flare',
      primaryColor: '#FF5722',
      backgroundColor: '#181112',
      textColor: '#FFF7ED',
      answerColor: '#261C1D',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 16,
      textAlignment: 'left',
    },
  },
  {
    id: 'nordic_frost',
    name: 'Nordic Frost',
    description: 'Crisp arctic glacier blue with clean minimalist modern lines',
    theme: {
      preset: 'nordic_frost',
      primaryColor: '#0284C7',
      backgroundColor: '#F0F9FF',
      textColor: '#0C4A6E',
      answerColor: '#FFFFFF',
      fontFamily: 'Inter',
      cornerRadius: 12,
      textAlignment: 'left',
    },
  },
  {
    id: 'aurora',
    name: 'Aurora Emerald',
    description: 'Deep rainforest dark mode with vibrant emerald neon',
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
    name: 'Midnight Electric',
    description: 'Ultra-dark obsidian canvas with electric cyan laser highlights',
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
    id: 'sunset',
    name: 'Sunset Glow',
    description: 'Warm golden amber on soft desert cream with center stage focus',
    theme: {
      preset: 'sunset',
      primaryColor: '#F59E0B',
      backgroundColor: '#FFFBEB',
      textColor: '#78350F',
      answerColor: '#FFFFFF',
      fontFamily: 'Plus Jakarta Sans',
      cornerRadius: 18,
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
