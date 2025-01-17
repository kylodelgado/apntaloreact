import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';

type Props = {
  onNumberPress: (number: number) => void;
  onSubmit: () => void;
  onClear: () => void;
  value: string;
};

const BUTTON_SIZE = (Dimensions.get('window').width - SPACING.md * 5) / 4;

export function CustomNumberPad({ onNumberPress, onSubmit, onClear, value }: Props) {
  const buttonScale = new Animated.Value(1);

  const animatePress = (callback: () => void) => {
    Animated.sequence([
      Animated.timing(buttonScale, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(buttonScale, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start(() => callback());
  };

  const renderButton = (number: number | string, isSpecial?: boolean) => {
    const handlePress = () => {
      if (typeof number === 'number') {
        animatePress(() => onNumberPress(number));
      } else if (number === 'C') {
        animatePress(onClear);
      } else if (number === '✓') {
        animatePress(onSubmit);
      }
    };

    return (
      <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
        <TouchableOpacity
          style={[
            styles.button,
            isSpecial && styles.specialButton,
          ]}
          onPress={handlePress}
        >
          <Text
            style={[
              styles.buttonText,
              isSpecial && styles.specialButtonText,
            ]}
          >
            {number}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.display}>
        <Text style={styles.displayText}>{value || '0'}</Text>
      </View>
      <View style={styles.grid}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '✓'].map((number, index) => (
          <View key={index} style={styles.buttonContainer}>
            {renderButton(number, typeof number === 'string')}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.light,
    borderRadius: 16,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  display: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    alignItems: 'flex-end',
  },
  displayText: {
    ...FONTS.bold,
    fontSize: 32,
    color: COLORS.text.primary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  buttonContainer: {
    width: BUTTON_SIZE,
  },
  button: {
    backgroundColor: COLORS.white,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE / 2,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  specialButton: {
    backgroundColor: COLORS.primary,
  },
  buttonText: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text.primary,
  },
  specialButtonText: {
    color: COLORS.white,
  },
}); 