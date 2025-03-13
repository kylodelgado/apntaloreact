import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../styles/theme';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children?: ReactNode;
  safeAreaEdges?: Edge[];
};

export function GradientBackground({ children, safeAreaEdges }: Props) {
  const { isDark } = useTheme();

  const gradientColors = isDark
    ? [COLORS.background.dark, '#0A1929'] // Dark theme gradient
    : COLORS.gradient.background; // Light theme gradient

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradientColors}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={StyleSheet.absoluteFillObject}>
        {safeAreaEdges ? (
          <SafeAreaView edges={safeAreaEdges} style={styles.content}>
            {children}
          </SafeAreaView>
        ) : (
          <View style={styles.content}>{children}</View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
}); 