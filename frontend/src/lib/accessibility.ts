const hexToRgb = (color: string): [number, number, number] | null => {
  const value = color.trim().replace('#', '');
  const normalized = value.length === 3
    ? value.split('').map((character) => `${character}${character}`).join('')
    : value;

  if (!/^[0-9a-fA-F]{6}$/.test(normalized)) return null;

  return [
    parseInt(normalized.slice(0, 2), 16),
    parseInt(normalized.slice(2, 4), 16),
    parseInt(normalized.slice(4, 6), 16),
  ];
};

const relativeLuminance = (color: string): number | null => {
  const rgb = hexToRgb(color);
  if (!rgb) return null;

  const [red, green, blue] = rgb.map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * red + 0.7152 * green + 0.0722 * blue;
};

export const getContrastRatio = (foreground: string, background: string): number | null => {
  const foregroundLuminance = relativeLuminance(foreground);
  const backgroundLuminance = relativeLuminance(background);

  if (foregroundLuminance === null || backgroundLuminance === null) return null;

  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);
  return (lighter + 0.05) / (darker + 0.05);
};
