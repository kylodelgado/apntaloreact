import { TextStyle, Platform } from 'react-native';

export const COLORS = {
  primary: '#1E3A8A',    // Deep blue
  secondary: '#3B82F6',   // Blue
  accent: '#FBC02D',     // Gold
  success: '#059669',    // Green
  warning: '#F59E0B',    // Orange
  error: '#DC2626',       // Red
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F3F4F6',
  gray: '#6B7280',
  border: '#E5E7EB',     // Light gray for borders
  background: {
    light: '#EEF2FF',
    dark: '#1E3A8A',
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#9CA3AF',
  },
  gradient: {
    primary: ['#EEF2FF', '#C7D2FE'],
    secondary: ['#1E3A8A', '#3B82F6'],
    accent: ['#FBC02D', '#F59E0B'],
    background: ['#EEF2FF', '#1E3A8A']
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const fontFamily = Platform.select({
  ios: {
    regular: 'System',
    medium: 'System',
    bold: 'System',
  },
  android: {
    regular: 'Roboto',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold',
  },
});

export const FONTS: Record<string, TextStyle> = {
  regular: {
    fontFamily: fontFamily?.regular,
    fontWeight: '400',
  },
  medium: {
    fontFamily: fontFamily?.medium,
    fontWeight: '600',
  },
  bold: {
    fontFamily: fontFamily?.bold,
    fontWeight: '700',
  },
  title: {
    fontFamily: fontFamily?.bold,
    fontWeight: '700',
    color: COLORS.primary,
  },
};

export const FONT_SIZES = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 24,
  xxl: 32,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6
  }
}; 