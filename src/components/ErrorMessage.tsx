import React, { useEffect } from 'react';
import { StyleSheet, Animated, Text } from 'react-native';
import { COLORS, FONTS, SPACING } from '../styles/theme';

type Props = {
  message: string;
  onFinish?: () => void;
};

export function ErrorMessage({ message, onFinish }: Props) {
  const translateX = new Animated.Value(0);

  useEffect(() => {
    const shake = Animated.sequence([
      Animated.timing(translateX, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 10,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration: 100,
        useNativeDriver: true,
      }),
    ]);

    shake.start(() => {
      if (onFinish) {
        setTimeout(onFinish, 2000);
      }
    });
  }, [message]);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.error + '20',
    padding: SPACING.md,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.error,
    marginVertical: SPACING.sm,
  },
  text: {
    ...FONTS.medium,
    color: COLORS.error,
    fontSize: 14,
  },
}); 