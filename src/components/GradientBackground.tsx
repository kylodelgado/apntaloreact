import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS } from '../styles/theme';

type Props = {
  children?: ReactNode;
};

export function GradientBackground({ children }: Props) {
  const hour = new Date().getHours();
  
  // Morning colors (6-11)
  const morningColors = ['#FFF7ED', '#FFEDD5'];
  
  // Afternoon colors (12-17)
  const afternoonColors = ['#F8FAFC', '#F1F5F9'];
  
  // Evening/Night colors (18-5)
  const eveningColors = ['#EEF2FF', '#E0E7FF'];
  
  let colors;
  if (hour >= 6 && hour < 12) {
    colors = morningColors;
  } else if (hour >= 12 && hour < 18) {
    colors = afternoonColors;
  } else {
    colors = eveningColors;
  }

  return (
    <LinearGradient
      colors={colors}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 