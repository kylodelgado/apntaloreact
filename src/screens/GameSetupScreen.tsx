import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { RootStackParamList } from '../navigation/types';
import { DominoPattern } from '../components/DominoPattern';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

export default function GameSetupScreen({ navigation }: Props) {
  const [gameMode, setGameMode] = useState<'teams' | 'players'>('teams');
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2']);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [targetScore, setTargetScore] = useState(200);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);

  // Animation values
  const inputScales = useRef<Animated.Value[]>([]);
  const scoreScale = useRef(new Animated.Value(1)).current;

  // Initialize animation values
  useEffect(() => {
    const participants = gameMode === 'teams' ? teamNames : playerNames;
    inputScales.current = participants.map(() => new Animated.Value(1));
  }, [gameMode, teamNames.length, playerNames.length]);

  const animateInput = (index: number, focused: boolean) => {
    if (inputScales.current[index]) {
      Animated.spring(inputScales.current[index], {
        toValue: focused ? 1.05 : 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleScoreChange = (value: number) => {
    setTargetScore(value);
    if ([200, 300, 400].includes(value)) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }
  };

  const startGame = () => {
    navigation.navigate('GamePlay', {
      targetScore,
      gameMode,
      ...(gameMode === 'teams' ? { teamNames } : { playerNames }),
    });
  };

  const renderNameInputs = () => {
    const participants = gameMode === 'teams' ? teamNames : playerNames;
    
    return participants.map((name, index) => (
      <Animated.View
        key={index}
        style={[
          styles.inputWrapper,
          {
            transform: [{ 
              scale: inputScales.current[index] ? inputScales.current[index] : 1 
            }],
          },
        ]}
      >
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={(text) => {
            if (gameMode === 'teams') {
              const newNames = [...teamNames];
              newNames[index] = text;
              setTeamNames(newNames);
            } else {
              const newNames = [...playerNames];
              newNames[index] = text;
              setPlayerNames(newNames);
            }
          }}
          onFocus={() => {
            setFocusedInput(index);
            animateInput(index, true);
          }}
          onBlur={() => {
            setFocusedInput(null);
            animateInput(index, false);
          }}
        />
      </Animated.View>
    ));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GradientBackground>
        <DominoPattern variant="setup" />
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Text style={styles.title}>Game Setup</Text>

          <View style={styles.modeToggle}>
            <TouchableOpacity
              style={[
                styles.modeButton,
                gameMode === 'teams' && styles.modeButtonActive,
              ]}
              onPress={() => setGameMode('teams')}
            >
              <Icon
                name="account-group"
                size={24}
                color={gameMode === 'teams' ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  gameMode === 'teams' && styles.modeButtonTextActive,
                ]}
              >
                2 Teams
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.modeButton,
                gameMode === 'players' && styles.modeButtonActive,
              ]}
              onPress={() => setGameMode('players')}
            >
              <Icon
                name="account-multiple"
                size={24}
                color={gameMode === 'players' ? COLORS.white : COLORS.primary}
              />
              <Text
                style={[
                  styles.modeButtonText,
                  gameMode === 'players' && styles.modeButtonTextActive,
                ]}
              >
                3+ Players
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              {gameMode === 'teams' ? 'Team Names' : 'Player Names'}
            </Text>
            <View style={styles.inputsContainer}>
              {renderNameInputs()}
              {gameMode === 'players' && playerNames.length < 6 && (
                <TouchableOpacity
                  style={styles.addButton}
                  onPress={() => {
                    setPlayerNames([
                      ...playerNames,
                      `Player ${playerNames.length + 1}`,
                    ]);
                  }}
                >
                  <Icon name="plus" size={24} color={COLORS.white} />
                  <Text style={styles.addButtonText}>Add Player</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Target Score</Text>
            <Animated.View style={[styles.scoreDisplay, { transform: [{ scale: scoreScale }] }]}>
              <Text style={styles.scoreText}>{targetScore}</Text>
            </Animated.View>
            <View style={styles.commonScores}>
              {[200, 300, 400].map((score) => (
                <TouchableOpacity
                  key={score}
                  style={[
                    styles.scoreButton,
                    targetScore === score && styles.scoreButtonActive,
                  ]}
                  onPress={() => handleScoreChange(score)}
                >
                  <Text
                    style={[
                      styles.scoreButtonText,
                      targetScore === score && styles.scoreButtonTextActive,
                    ]}
                  >
                    {score}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity style={styles.startButton} onPress={startGame}>
            <Text style={styles.startButtonText}>Start Game</Text>
          </TouchableOpacity>
        </ScrollView>
      </GradientBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    ...FONTS.medium,
    color: COLORS.primary,
    fontSize: 16,
  },
  modeButtonTextActive: {
    color: COLORS.white,
  },
  inputsContainer: {
    gap: SPACING.md,
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  input: {
    ...FONTS.regular,
    fontSize: 16,
    padding: SPACING.md,
    color: COLORS.text.primary,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  addButtonText: {
    ...FONTS.medium,
    color: COLORS.white,
    fontSize: 16,
  },
  scoreDisplay: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.lg,
    alignItems: 'center',
    marginBottom: SPACING.md,
    ...SHADOWS.small,
  },
  scoreText: {
    ...FONTS.bold,
    fontSize: 48,
    color: COLORS.primary,
  },
  commonScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  scoreButton: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreButtonActive: {
    backgroundColor: COLORS.primary,
  },
  scoreButtonText: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text.secondary,
  },
  scoreButtonTextActive: {
    color: COLORS.white,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  startButtonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
  },
}); 