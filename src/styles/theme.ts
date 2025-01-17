import { TextStyle } from 'react-native';

export const COLORS = {
  primary: '#1E3A8A',    // Deep blue
  secondary: '#6B7280',  // Warm gray
  accent: '#FBC02D',     // Gold
  success: '#10B981',    // Green
  error: '#EF4444',      // Red
  white: '#FFFFFF',
  black: '#000000',
  lightGray: '#F3F4F6',
  gray: '#9CA3AF',
  background: {
    light: '#FFFFFF',
    dark: '#1E2A3B'
  },
  text: {
    primary: '#1F2937',
    secondary: '#4B5563',
    light: '#E5E7EB'
  },
  gradient: {
    primary: ['#1E3A8A', '#2563EB'],
    accent: ['#FBC02D', '#F59E0B'],
    background: ['#EEF2FF', '#FFFFFF']
  }
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48
};

export const FONTS = {
  regular: {
    fontFamily: 'Inter',
    fontWeight: '400' as const
  },
  medium: {
    fontFamily: 'Inter',
    fontWeight: '500' as const
  },
  bold: {
    fontFamily: 'Inter',
    fontWeight: '700' as const
  },
  title: {
    fontFamily: 'Nunito',
    fontWeight: '700' as const
  }
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6
  }
}; 