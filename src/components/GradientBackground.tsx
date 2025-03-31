import React, { ReactNode } from 'react';
import { StyleSheet, View, Platform, StatusBar, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../styles/theme';
import { Edge, SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';

type Props = {
  children?: ReactNode;
  safeAreaEdges?: Edge[];
  containerStyle?: ViewStyle;
};

export function GradientBackground({ children, safeAreaEdges, containerStyle }: Props) {
  const { isDark } = useTheme();

  const gradientColors = isDark
    ? [COLORS.background.dark, '#0A1929'] // Dark theme gradient
    : COLORS.gradient.background; // Light theme gradient

  return (
    <View style={[styles.container, containerStyle]}>
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
  },
}); 