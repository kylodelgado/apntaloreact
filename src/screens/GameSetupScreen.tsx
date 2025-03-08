import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { RootStackParamList } from '../navigation/types';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';
import { useFocusEffect } from '@react-navigation/native';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

const STORAGE_KEYS = {
  DEFAULT_SCORE: '@default_score',
  DEFAULT_GAME_MODE: '@default_game_mode',
  GAME_IN_PROGRESS: '@game_state',
};

export default function GameSetupScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const [gameMode, setGameMode] = useState<'teams' | 'players'>('teams');
  const [teamNames, setTeamNames] = useState(['Team 1', 'Team 2']);
  const [playerNames, setPlayerNames] = useState(['Player 1', 'Player 2']);
  const [targetScore, setTargetScore] = useState(200);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [hasGameInProgress, setHasGameInProgress] = useState(false);

  // Animation values
  const inputScales = useRef<Animated.Value[]>([]);
  const scoreScale = useRef(new Animated.Value(1)).current;

  // Load default settings on mount
  useEffect(() => {
    loadDefaultSettings();
  }, []);

  // Check for game in progress when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkGameInProgress();
    }, [])
  );

  const checkGameInProgress = async () => {
    try {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
      if (gameData) {
        const parsedData = JSON.parse(gameData);
        // Only consider it a game in progress if it has valid data
        if (parsedData.scores && parsedData.gameMode && parsedData.targetScore) {
          setHasGameInProgress(true);
          // Update the form with the saved game settings
          setGameMode(parsedData.gameMode);
          setTargetScore(parsedData.targetScore);
          if (parsedData.gameMode === 'teams' && parsedData.participants) {
            setTeamNames(parsedData.participants);
          } else if (parsedData.gameMode === 'players' && parsedData.participants) {
            setPlayerNames(parsedData.participants);
          }
        } else {
          setHasGameInProgress(false);
        }
      } else {
        setHasGameInProgress(false);
      }
    } catch (error) {
      console.error('Error checking game in progress:', error);
      setHasGameInProgress(false);
    }
  };

  const loadDefaultSettings = async () => {
    try {
      const [savedScore, savedGameMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_GAME_MODE),
      ]);

      if (savedScore) {
        const score = parseInt(savedScore, 10);
        setTargetScore(score);
      }
      
      if (savedGameMode) {
        setGameMode(savedGameMode as 'teams' | 'players');
      }
    } catch (error) {
      console.error('Error loading default settings:', error);
    }
  };

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

  const startNewGame = async () => {
    // Clear any existing game data
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_IN_PROGRESS);
    } catch (error) {
      console.error('Error clearing game data:', error);
    }
    
    // Start new game
    navigation.navigate('GamePlay', {
      targetScore,
      gameMode,
      ...(gameMode === 'teams' ? { teamNames } : { playerNames }),
    });
  };

  const continueGame = async () => {
    try {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
      if (gameData) {
        const parsedData = JSON.parse(gameData);
        if (parsedData.scores && parsedData.gameMode && parsedData.targetScore) {
          navigation.navigate('GamePlay', {
            gameMode: parsedData.gameMode,
            targetScore: parsedData.targetScore,
            ...(parsedData.gameMode === 'teams' 
              ? { teamNames: parsedData.participants }
              : { playerNames: parsedData.participants }
            ),
          });
        }
      }
    } catch (error) {
      console.error('Error loading saved game:', error);
    }
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
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" />
      
      <View style={styles.headerButtons}>
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('GameHistory')}
        >
          <Icon name="history" size={24} color={COLORS.primary} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => navigation.navigate('Settings')}
        >
          <Icon name="cog" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>{t.gameSetup.title}</Text>

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
              {t.settings.teams}
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
              {t.settings.players}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {gameMode === 'teams' ? t.gameSetup.teamNames : t.gameSetup.playerNames}
          </Text>
          <View style={styles.inputsContainer}>
            {renderNameInputs()}
            {gameMode === 'players' && playerNames.length < 6 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => {
                  setPlayerNames([
                    ...playerNames,
                    `${t.settings.players} ${playerNames.length + 1}`,
                  ]);
                }}
              >
                <Icon name="plus" size={24} color={COLORS.white} />
                <Text style={styles.addButtonText}>{t.gameSetup.addPlayer}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{t.gameSetup.targetScore}</Text>
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

        <View style={styles.buttonContainer}>
          {hasGameInProgress ? (
            <>
              <TouchableOpacity style={styles.newGameButton} onPress={startNewGame}>
                <Text style={styles.buttonText}>{t.gameSetup.newGame}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.continueButton} onPress={continueGame}>
                <Text style={styles.buttonText}>{t.gameSetup.continueGame}</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={startNewGame}>
              <Text style={styles.startButtonText}>{t.gameSetup.startGame}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </GradientBackground>
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
    paddingTop: Platform.OS === 'ios' ? 50 : SPACING.xxl,
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
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  newGameButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  buttonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
  },
  headerButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : SPACING.xl,
    right: SPACING.lg,
    flexDirection: 'row',
    gap: SPACING.sm,
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: COLORS.white,
    padding: SPACING.sm,
    borderRadius: 8,
    ...SHADOWS.small,
  },
}); 