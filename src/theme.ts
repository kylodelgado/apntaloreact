export const COLORS = {
  primary: '#1E3A8A',
  secondary: '#6B7280',
  accent: '#F59E0B',
  success: '#10B981',
  error: '#EF4444',
  background: {
    light: '#F8FAFC',
    dark: '#1E293B',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#F9FAFB',
  },
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONTS = {
  regular: {
    fontFamily: 'Inter',
    fontWeight: '400' as const,
  },
  medium: {
    fontFamily: 'Inter',
    fontWeight: '500' as const,
  },
  bold: {
    fontFamily: 'Inter',
    fontWeight: '700' as const,
  },
  title: {
    fontFamily: 'Nunito',
    fontWeight: '700' as const,
  },
} as const; 