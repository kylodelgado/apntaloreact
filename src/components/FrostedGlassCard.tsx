import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { COLORS, SHADOWS } from '../styles/theme';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children: React.ReactNode;
  style?: any;
};

export const FrostedGlassCard = ({ children, style }: Props) => {
  const { isDark } = useTheme();

  if (Platform.OS === 'android') {
    // Android fallback since BlurView doesn't work as well
    return (
      <View style={[
        styles.androidCard,
        isDark && styles.androidCardDark,
        style
      ]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <BlurView
        style={styles.blurView}
        blurType={isDark ? 'dark' : 'light'}
        blurAmount={isDark ? 10 : 20}
        reducedTransparencyFallbackColor={isDark ? 'rgba(45, 55, 72, 0.5)' : COLORS.white}
      />
      <View style={[
        styles.content,
        isDark && styles.contentDark
      ]}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    ...SHADOWS.medium,
  },
  blurView: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  contentDark: {
    backgroundColor: 'rgba(45, 55, 72, 0.3)',
  },
  androidCard: {
    backgroundColor: COLORS.card.light,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
  androidCardDark: {
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
  },
}); 