import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { COLORS, SHADOWS } from '../styles/theme';

type Props = {
  children: React.ReactNode;
  style?: any;
};

export const FrostedGlassCard = ({ children, style }: Props) => {
  if (Platform.OS === 'android') {
    // Android fallback since BlurView doesn't work as well
    return (
      <View style={[styles.androidCard, style]}>
        {children}
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <BlurView
        style={styles.blurView}
        blurType="light"
        blurAmount={20}
        reducedTransparencyFallbackColor={COLORS.white}
      />
      <View style={styles.content}>
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
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  content: {
    padding: 16,
  },
  androidCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.medium,
  },
}); 