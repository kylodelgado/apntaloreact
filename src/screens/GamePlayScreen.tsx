import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
  Dimensions,
  Keyboard,
  Platform,
  Animated,
  StatusBar,
  InputAccessoryView,
  AppState,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';
import { useTheme } from '../context/ThemeContext';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'GamePlay'>;
  route: {
    params: {
      targetScore: number;
      gameMode: 'teams' | 'players';
      teamNames?: string[];
      playerNames?: string[];
    };
  };
};

const STORAGE_KEYS = {
  GAME_IN_PROGRESS: '@game_state',
};

export default function GamePlayScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const { targetScore, gameMode, teamNames, playerNames } = route.params;
  const participants = gameMode === 'teams' ? teamNames! : playerNames!;
  
  // Add AppState ref to track app state changes
  const appState = useRef(AppState.currentState);
  
  // Add a ref to track if initial load has completed
  const hasInitiallyLoaded = useRef(false);
  
  // Animation refs
  const animationRefs = useRef({
    totalScoreAnims: participants.map(() => new Animated.Value(0)),
    tiltAnims: participants.map(() => new Animated.Value(0)),
    glowAnims: participants.map(() => new Animated.Value(0)),
    crownBounce: new Animated.Value(1),
    newScoreAnim: new Animated.Value(0),
    newScoreOpacity: new Animated.Value(1),
  });

  // State
  const [scores, setScores] = useState<number[][]>(() => {
    // Initialize with empty arrays instead of [0] to prevent overriding saved scores
    return participants.map(() => []);
  });
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Add state to prevent rendering until initial load is complete
  const [isReady, setIsReady] = useState(false);

  // Add a unique ID for the input accessory view
  const inputAccessoryViewID = "scoreInputAccessoryView";

  // Update animation arrays when participants change
  useEffect(() => {
    animationRefs.current = {
      ...animationRefs.current,
      totalScoreAnims: participants.map((_, i) => 
        animationRefs.current.totalScoreAnims[i] || new Animated.Value(0)
      ),
      tiltAnims: participants.map((_, i) => 
        animationRefs.current.tiltAnims[i] || new Animated.Value(0)
      ),
      glowAnims: participants.map((_, i) => 
        animationRefs.current.glowAnims[i] || new Animated.Value(0)
      ),
    };
  }, [participants.length]);

  // Load saved game state
  useEffect(() => {
    const loadGameState = async () => {
      try {
        // Only show loading on initial mount and if we haven't loaded yet
        if (!hasInitiallyLoaded.current) {
          setIsLoading(true);
        }
        
        const savedState = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
        if (savedState) {
          const { scores: savedScores, gameMode: savedGameMode, targetScore: savedTargetScore } = JSON.parse(savedState);
          // Only restore if it's the same game configuration
          if (savedGameMode === gameMode && savedTargetScore === targetScore && 
              savedScores.length === participants.length) {
            // Ensure we're not setting empty scores
            if (savedScores.some((participantScores: number[]) => participantScores.length > 0)) {
              setScores(savedScores);
              console.log('Restored scores:', savedScores);
            } else if (scores.every((participantScores: number[]) => participantScores.length === 0)) {
              // If saved scores are empty and current scores are empty, initialize with [0]
              setScores(participants.map(() => [0]));
            }
          } else if (!hasInitiallyLoaded.current) {
            // Only initialize with [0] on initial mount if configuration doesn't match
            setScores(participants.map(() => [0]));
          }
        } else if (!hasInitiallyLoaded.current) {
          // Only initialize with [0] on initial mount if no saved state
          setScores(participants.map(() => [0]));
        }
        
        // Mark as initially loaded
        hasInitiallyLoaded.current = true;
        // Mark component as ready to render
        setIsReady(true);
      } catch (error) {
        console.error('Error loading game state:', error);
        // Only fallback to default initialization on initial mount
        if (!hasInitiallyLoaded.current) {
          setScores(participants.map(() => [0]));
        }
        // Even on error, mark as ready
        setIsReady(true);
        hasInitiallyLoaded.current = true;
      } finally {
        setIsLoading(false);
      }
    };
    loadGameState();
  }, []); // Only run on mount

  // Add AppState change listener to handle app background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Only handle transitions from background to active
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - silently sync with storage
        const loadGameState = async () => {
          try {
            // Never show loading indicator on resume
            const savedState = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
            if (savedState) {
              const { scores: savedScores, gameMode: savedGameMode, targetScore: savedTargetScore } = JSON.parse(savedState);
              // Only restore if it's the same game configuration and there's a difference
              if (savedGameMode === gameMode && savedTargetScore === targetScore && 
                  savedScores.length === participants.length) {
                const currentTotal = scores.reduce((sum: number, participantScores: number[]) => 
                  sum + participantScores.reduce((s: number, score: number) => s + score, 0), 0);
                const savedTotal = savedScores.reduce((sum: number, participantScores: number[]) => 
                  sum + participantScores.reduce((s: number, score: number) => s + score, 0), 0);
                
                // Only update if there's actually a difference
                if (currentTotal !== savedTotal) {
                  setScores(savedScores);
                }
              }
            }
          } catch (error) {
            console.error('Error syncing game state on app foreground:', error);
            // Never show error on resume
          }
        };
        loadGameState();
      }
      
      // Update the AppState ref
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [gameMode, targetScore, participants, scores]);

  // Save game state whenever scores change
  useEffect(() => {
    const saveGameState = async () => {
      try {
        // Only save if we have actual scores (not just empty arrays)
        if (scores.some(participantScores => participantScores.length > 0)) {
          const gameState = {
            scores,
            gameMode,
            targetScore,
            participants,
            timestamp: new Date().toISOString(),
          };
          console.log('Saving game state:', gameState);
          await AsyncStorage.setItem(STORAGE_KEYS.GAME_IN_PROGRESS, JSON.stringify(gameState));
        }
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    };
    saveGameState();
  }, [scores, gameMode, targetScore, participants]);

  const checkGameOver = useCallback((newScores: number[][]) => {
    newScores.forEach((participantScores, index) => {
      const total = participantScores.reduce((sum, score) => sum + score, 0);
      if (total >= targetScore) {
        // Clear saved game state when game is over
        AsyncStorage.removeItem(STORAGE_KEYS.GAME_IN_PROGRESS).catch(console.error);
        navigation.replace('GameOver', {
          scores: newScores,
          winner: participants[index],
          gameMode,
          targetScore,
        });
      }
    });
  }, [targetScore, navigation, gameMode, participants]);

  const deleteScore = (participantIndex: number, scoreIndex: number) => {
    Alert.alert(
      t.gameplay.deleteScore,
      t.gameplay.deleteScoreConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.delete,
          style: 'destructive',
          onPress: () => {
            const newScores = scores.map((participantScores, idx) => {
              return [...participantScores.slice(0, scoreIndex), ...participantScores.slice(scoreIndex + 1)];
            });
            setScores(newScores);
          },
        },
      ]
    );
  };

  const animateNewScore = (participantIndex: number, score: number) => {
    // Reset animation values
    animationRefs.current.newScoreAnim.setValue(0);
    animationRefs.current.newScoreOpacity.setValue(1);

    // Animate the new score popping in and fading out
    Animated.parallel([
      Animated.spring(animationRefs.current.newScoreAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 50,
        friction: 7,
      }),
      Animated.sequence([
        Animated.delay(1000),
        Animated.timing(animationRefs.current.newScoreOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();

    // Animate the total score
    const currentTotal = scores[participantIndex].reduce((sum, s) => sum + s, 0);
    animationRefs.current.totalScoreAnims[participantIndex].setValue(currentTotal - score);
    Animated.spring(animationRefs.current.totalScoreAnims[participantIndex], {
      toValue: currentTotal,
      useNativeDriver: false,
      tension: 40,
      friction: 5,
    }).start();
  };

  const handleScoreSubmit = (participantIndex: number) => {
    const score = parseInt(currentScore);
    if (!isNaN(score) && score > 0) {
      // Create a deep copy of the scores array to ensure React detects the change
      const newScores = scores.map((participantScores, index) => {
        if (index === participantIndex) {
          return [...participantScores, score];
        }
        // For other participants, add 0 or keep their scores unchanged
        return participantScores.length === 0 ? [0] : [...participantScores, 0];
      });
      
      console.log('Submitting score:', score, 'for participant:', participantIndex, 'new scores:', newScores);
      setScores(newScores);
      setCurrentScore('');
      setActiveInputIndex(null);
      animateTilt(participantIndex);
      animateNewScore(participantIndex, score);
      checkGameOver(newScores);
    }
  };

  const handleQuickScore = (participantIndex: number, score: number) => {
    // Create a deep copy of the scores array to ensure React detects the change
    const newScores = scores.map((participantScores, index) => {
      if (index === participantIndex) {
        return [...participantScores, score];
      }
      // For other participants, add 0 or keep their scores unchanged
      return participantScores.length === 0 ? [0] : [...participantScores, 0];
    });
    
    console.log('Quick score:', score, 'for participant:', participantIndex, 'new scores:', newScores);
    setScores(newScores);
    animateNewScore(participantIndex, score);
    checkGameOver(newScores);
    setCurrentScore('');
    setActiveInputIndex(null);
  };

  const renderScoreInput = (participantIndex: number) => {
    if (activeInputIndex !== participantIndex) {
      return (
        <TouchableOpacity
          style={styles.addScoreButton}
          onPress={() => setActiveInputIndex(participantIndex)}
        >
          <Text style={styles.addScoreButtonText}>{t.gameplay.addScore}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <View style={styles.scoreInputContainer}>
        <TextInput
          style={[
            styles.scoreInput,
            isDark && styles.scoreInputDark
          ]}
          value={currentScore}
          onChangeText={setCurrentScore}
          keyboardType="number-pad"
          autoFocus
          returnKeyType="done"
          onSubmitEditing={() => handleScoreSubmit(participantIndex)}
          inputAccessoryViewID={Platform.OS === 'ios' ? inputAccessoryViewID : undefined}
        />
        <TouchableOpacity
          style={styles.doneButton}
          onPress={() => handleScoreSubmit(participantIndex)}
        >
          <Text style={styles.doneButtonText}>{t.common.done}</Text>
        </TouchableOpacity>
        <View style={styles.quickScores}>
          <TouchableOpacity
            style={styles.quickScoreButton}
            onPress={() => handleQuickScore(participantIndex, 25)}
          >
            <Text style={styles.quickScoreText}>25</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickScoreButton}
            onPress={() => handleQuickScore(participantIndex, 30)}
          >
            <Text style={styles.quickScoreText}>30</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Calculate the leading participant
  const leadingIndex = useMemo(() => {
    const totals = scores.map(participantScores => 
      participantScores.reduce((sum, score) => sum + score, 0)
    );
    return totals.indexOf(Math.max(...totals));
  }, [scores]);

  // Crown bounce animation
  const crownBounce = animationRefs.current.crownBounce;

  useEffect(() => {
    // Animate crown when leader changes
    Animated.sequence([
      Animated.timing(crownBounce, {
        toValue: 1.2,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.spring(crownBounce, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
  }, [leadingIndex]);

  const animateTilt = (index: number) => {
    const { tiltAnims } = animationRefs.current;
    if (tiltAnims[index]) {
      Animated.sequence([
        Animated.timing(tiltAnims[index], {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnims[index], {
          toValue: -1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(tiltAnims[index], {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  };

  const startVictoryGlow = (index: number) => {
    const { glowAnims } = animationRefs.current;
    if (glowAnims[index]) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnims[index], {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(glowAnims[index], {
            toValue: 0,
            duration: 1000,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  };

  // Check for near victory
  useEffect(() => {
    participants.forEach((_, index) => {
      const total = scores[index].reduce((sum, score) => sum + score, 0);
      if (total >= targetScore * 0.8 && total < targetScore) {
        startVictoryGlow(index);
      }
    });
  }, [scores]);

  const renderParticipantColumn = (index: number) => {
    const total = scores[index].reduce((sum, score) => sum + score, 0);
    const isLeading = scores.every(
      (participantScores, i) => 
        i === index || 
        participantScores.reduce((sum, score) => sum + score, 0) < total
    );

    return (
      <View key={index} style={styles.participantColumn}>
        <View style={[
          styles.participantCard,
          isDark && styles.participantCardDark
        ]}>
          <View style={styles.headerContainer}>
            {isLeading && total > 0 && (
              <Animated.View 
                style={[
                  styles.crownContainer,
                  isDark && styles.crownContainerDark,
                  {
                    transform: [{ scale: crownBounce }],
                  },
                ]}
              >
                <Icon name="crown" size={24} color={COLORS.accent} />
              </Animated.View>
            )}
            <Text style={[
              styles.participantName,
              isDark && styles.participantNameDark
            ]}>{participants[index]}</Text>
          </View>

          <Text style={[
            styles.totalScore,
            isDark && styles.totalScoreDark,
            isLeading && total > 0 && styles.leadingScore,
          ]}>
            {total}
          </Text>

          {activeInputIndex === index ? (
            <View style={styles.scoreInputContainer}>
              <TextInput
                style={[
                  styles.scoreInput,
                  isDark && styles.scoreInputDark
                ]}
                value={currentScore}
                onChangeText={setCurrentScore}
                keyboardType="number-pad"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => handleScoreSubmit(index)}
                inputAccessoryViewID={Platform.OS === 'ios' ? inputAccessoryViewID : undefined}
              />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => handleScoreSubmit(index)}
              >
                <Text style={styles.doneButtonText}>{t.common.done}</Text>
              </TouchableOpacity>
              <View style={styles.quickScores}>
                <TouchableOpacity
                  style={styles.quickScoreButton}
                  onPress={() => handleQuickScore(index, 25)}
                >
                  <Text style={styles.quickScoreText}>25</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickScoreButton}
                  onPress={() => handleQuickScore(index, 30)}
                >
                  <Text style={styles.quickScoreText}>30</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addScoreButton}
              onPress={() => setActiveInputIndex(index)}
            >
              <Text style={styles.addScoreButtonText}>{t.gameplay.addScore}</Text>
            </TouchableOpacity>
          )}

          <ScrollView style={[
            styles.scoresContainer,
            { maxHeight: gameMode === 'teams' ? undefined : 200 }
          ]}>
            {scores[index].map((score, scoreIndex) => (
              <View key={scoreIndex} style={styles.scoreRow}>
                <Text style={[
                  styles.scoreText,
                  isDark && styles.scoreTextDark
                ]}>
                  {score}
                </Text>
                {score !== 0 && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => deleteScore(index, scoreIndex)}
                  >
                    <Text style={styles.deleteButtonText}>×</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderParticipantColumns = () => {
    if (gameMode === 'teams') {
      return (
        <View style={styles.teamsContainer}>
          {participants.map((_, index) => renderParticipantColumn(index))}
        </View>
      );
    } else {
      const rows = [];
      for (let i = 0; i < participants.length; i += 2) {
        const row = (
          <View key={i} style={styles.playersRow}>
            {renderParticipantColumn(i)}
            {i + 1 < participants.length && renderParticipantColumn(i + 1)}
          </View>
        );
        rows.push(row);
      }
      return <View style={styles.playersContainer}>{rows}</View>;
    }
  };

  const handleReset = () => {
    Alert.alert(
      t.gameplay.resetGame,
      t.gameplay.resetConfirm,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.reset,
          style: 'destructive',
          onPress: () => {
            setScores(participants.map(() => [0]));
            AsyncStorage.removeItem(STORAGE_KEYS.GAME_IN_PROGRESS).catch(console.error);
          },
        },
      ]
    );
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      {/* Only render content when ready to prevent flashing */}
      {isReady && (
        <GradientBackground safeAreaEdges={Platform.select({
          ios: ['top', 'bottom'],
          android: ['top', 'bottom'],
        })}>
          <DominoPattern variant="gameplay" opacity={0.05} />
          
          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={[
                styles.backButton,
                isDark && styles.backButtonDark
              ]}
              onPress={() => navigation.goBack()}
            >
              <Icon name="chevron-left" size={32} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.resetButton,
                isDark && styles.resetButtonDark
              ]}
              onPress={handleReset}
            >
              <Icon name="refresh" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={[
              styles.container,
              Platform.OS === 'android' && { marginTop: StatusBar.currentHeight },
            ]}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              {isLoading && (
                <View style={styles.loadingContainer}>
                  <LoadingSpinner size={32} color={COLORS.primary} />
                </View>
              )}
              
              {error && (
                <ErrorMessage 
                  message={error} 
                  onFinish={() => setError(null)} 
                />
              )}
              
              {renderParticipantColumns()}
            </View>
          </ScrollView>

          {/* Add InputAccessoryView for iOS */}
          {Platform.OS === 'ios' && activeInputIndex !== null && (
            <InputAccessoryView nativeID={inputAccessoryViewID}>
              <View style={[
                styles.keyboardToolbar,
                isDark && styles.keyboardToolbarDark
              ]}>
                <TouchableOpacity
                  style={styles.keyboardDoneButton}
                  onPress={() => {
                    if (activeInputIndex !== null) {
                      handleScoreSubmit(activeInputIndex);
                    }
                    Keyboard.dismiss();
                  }}
                >
                  <Text style={[
                    styles.keyboardDoneButtonText,
                    isDark && styles.keyboardDoneButtonTextDark
                  ]}>{t.common.done}</Text>
                </TouchableOpacity>
              </View>
            </InputAccessoryView>
          )}
        </GradientBackground>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SPACING.xl,
  },
  content: {
    flex: 1,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: Platform.select({
      ios: SPACING.xl * 2,
      android: SPACING.xl * 3,
    }),
    paddingHorizontal: SPACING.sm,
  },
  playersContainer: {
    flex: 1,
    paddingTop: Platform.select({
      ios: SPACING.xl * 2,
      android: SPACING.xl * 3,
    }),
    paddingHorizontal: SPACING.sm,
  },
  playersRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: SPACING.md,
  },
  participantColumn: {
    width: Platform.OS === 'ios' ? '47%' : '48%',
    minHeight: 300,
    marginHorizontal: SPACING.xs,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.sm,
    position: 'relative',
    minHeight: 40,
    paddingHorizontal: SPACING.xl,
  },
  crownContainer: {
    position: 'absolute',
    top: -SPACING.sm,
    right: 0,
    zIndex: 2,
    backgroundColor: Platform.select({
      ios: COLORS.white + '30',
      android: 'rgba(255, 255, 255, 0.3)',
    }),
    borderRadius: 12,
    padding: SPACING.xs,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  crownContainerDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.3)',
      android: 'rgba(45, 55, 72, 0.4)',
    }),
    overflow: 'hidden',
  },
  participantName: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.xs,
    opacity: 1,
  },
  participantNameDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  totalScore: {
    ...FONTS.bold,
    fontSize: 36,
    color: COLORS.text.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    opacity: 1,
  },
  totalScoreDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  leadingScore: {
    color: COLORS.accent,
    opacity: 1,
  },
  scoresContainer: {
    marginTop: SPACING.md,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  scoreText: {
    ...FONTS.medium,
    fontSize: 25,
    color: COLORS.text.primary,
    textAlign: 'center',
    flex: 1,
    opacity: 1,
  },
  scoreTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  deleteButton: {
    padding: SPACING.xs,
    position: 'absolute',
    right: SPACING.xs,
  },
  deleteButtonText: {
    color: COLORS.error,
    fontSize: 20,
    fontWeight: '600',
    opacity: 1,
  },
  addScoreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: Platform.select({
      ios: SPACING.md,
      android: SPACING.sm,
    }),
    paddingHorizontal: SPACING.sm,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: SPACING.md,
    width: '100%',
    ...SHADOWS.small,
  },
  addScoreButtonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
    textAlign: 'center',
    opacity: 1,
    ...Platform.select({
      android: {
        width: '80%',
      }
    }),
  },
  scoreInputContainer: {
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  scoreInputRow: {
    marginBottom: SPACING.sm,
  },
  scoreInput: {
    backgroundColor: Platform.select({
      ios: COLORS.white + '30',
      android: 'rgba(255, 255, 255, 0.3)',
    }),
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 24,
    textAlign: 'center',
    color: COLORS.text.primary,
    opacity: 1,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  scoreInputDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.3)',
      android: 'rgba(45, 55, 72, 0.4)',
    }),
    color: COLORS.text.dark.primary,
    opacity: 1,
    overflow: 'hidden',
  },
  doneButton: {
    backgroundColor: COLORS.success,
    padding: SPACING.sm,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: SPACING.md,
    width: '100%',
    ...SHADOWS.small,
  },
  doneButtonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
  },
  quickScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.xs,
    width: '100%',
  },
  quickScoreButton: {
    backgroundColor: COLORS.secondary,
    paddingVertical: SPACING.md,
    borderRadius: 12,
    width: '48%',
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickScoreText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
  },
  keyboardToolbar: {
    backgroundColor: '#f8f8f8',
    padding: SPACING.sm,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#919191',
  },
  keyboardToolbarDark: {
    backgroundColor: COLORS.card.dark,
    borderTopColor: COLORS.border,
  },
  keyboardDoneButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  keyboardDoneButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
  },
  keyboardDoneButtonTextDark: {
    color: COLORS.accent,
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [
      { translateX: -16 },
      { translateY: -16 },
    ],
    zIndex: 10,
  },
  victoryGlow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.accent,
    borderRadius: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: Platform.select({
      ios: SPACING.xl * 2,
      android: (StatusBar.currentHeight || 0) + SPACING.xl,
    }),
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 10,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.select({
      ios: COLORS.white + '30',
      android: 'rgba(255, 255, 255, 0.3)',
    }),
    borderRadius: 8,
    padding: SPACING.xs,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  backButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.3)',
      android: 'rgba(45, 55, 72, 0.4)',
    }),
    overflow: 'hidden',
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 8,
    ...SHADOWS.medium,
  },
  resetButtonDark: {
    backgroundColor: COLORS.secondary,
  },
  participantCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  participantCardDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
}); 