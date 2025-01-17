import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { DominoPattern } from '../components/DominoPattern';
import { GradientBackground } from '../components/GradientBackground';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  // Animation values
  const titleBounce = new Animated.Value(0);
  const buttonScale = new Animated.Value(1);

  useEffect(() => {
    // Title bounce animation
    Animated.sequence([
      Animated.delay(300),
      Animated.spring(titleBounce, {
        toValue: 1,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleNewGame = () => {
    try {
      navigation.navigate('GameSetup');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GradientBackground>
        <DominoPattern />
        
        <View style={styles.content}>
          <Animated.Text
            style={[
              styles.title,
              {
                transform: [
                  {
                    scale: titleBounce.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.8, 1],
                    }),
                  },
                ],
              },
            ]}
          >
            ¡Apuntalo!
          </Animated.Text>
          
          <Text style={styles.subtitle}>Domino Score Tracker</Text>

          <TouchableOpacity
            style={styles.button}
            onPress={handleNewGame}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        </View>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.light,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.xl,
  },
  title: {
    ...FONTS.title,
    fontSize: 48,
    color: COLORS.primary,
    marginBottom: SPACING.sm,
  },
  subtitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xxl,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    borderRadius: 12,
    ...SHADOWS.medium,
  },
  buttonText: {
    ...FONTS.bold,
    fontSize: 18,
    color: COLORS.white,
    textAlign: 'center',
  },
}); 