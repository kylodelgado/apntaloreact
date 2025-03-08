import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { DominoPattern } from '../components/DominoPattern';
import { GradientBackground } from '../components/GradientBackground';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTranslation } from '../translations/TranslationContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};

export default function HomeScreen({ navigation }: Props) {
  const { t } = useTranslation();
  
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
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="home" />
      
      <TouchableOpacity 
        style={styles.settingsButton}
        onPress={() => navigation.navigate('Settings')}
      >
        <Icon name="cog" size={24} color={COLORS.primary} />
      </TouchableOpacity>

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
          Domino Apunte!
        </Animated.Text>
        
        <Text style={styles.subtitle}>{t.home.subtitle}</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={handleNewGame}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>{t.home.newGame}</Text>
        </TouchableOpacity>
      </View>
    </GradientBackground>
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
  settingsButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : SPACING.xl,
    right: SPACING.lg,
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: 8,
    zIndex: 10,
    ...SHADOWS.small,
  },
}); 