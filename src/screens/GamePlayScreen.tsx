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
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { FrostedGlassCard } from '../components/FrostedGlassCard';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { CustomNumberPad } from '../components/CustomNumberPad';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';

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
  const { targetScore, gameMode, teamNames, playerNames } = route.params;
  const participants = gameMode === 'teams' ? teamNames! : playerNames!;
  
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
  const [scores, setScores] = useState<number[][]>(
    participants.map(() => [0])
  );
  const [activeInputIndex, setActiveInputIndex] = useState<number | null>(null);
  const [currentScore, setCurrentScore] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
        const savedState = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
        if (savedState) {
          const { scores: savedScores, gameMode: savedGameMode, targetScore: savedTargetScore } = JSON.parse(savedState);
          // Only restore if it's the same game configuration
          if (savedGameMode === gameMode && savedTargetScore === targetScore && 
              savedScores.length === participants.length) {
            setScores(savedScores);
          }
        }
      } catch (error) {
        console.error('Error loading game state:', error);
      }
    };
    loadGameState();
  }, []);

  // Save game state whenever scores change
  useEffect(() => {
    const saveGameState = async () => {
      try {
        const gameState = {
          scores,
          gameMode,
          targetScore,
          participants,
          timestamp: new Date().toISOString(),
        };
        await AsyncStorage.setItem(STORAGE_KEYS.GAME_IN_PROGRESS, JSON.stringify(gameState));
      } catch (error) {
        console.error('Error saving game state:', error);
      }
    };
    saveGameState();
  }, [scores]);

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
      const newScores = [...scores];
      newScores[participantIndex] = [...newScores[participantIndex], score];
      setScores(newScores);
      setCurrentScore('');
      setActiveInputIndex(null);
      animateTilt(participantIndex);

      // Check for game over
      const total = newScores[participantIndex].reduce((sum, s) => sum + s, 0);
      if (total >= targetScore) {
        navigation.replace('GameOver', {
          scores: newScores,
          winner: participants[participantIndex],
          gameMode,
          targetScore,
        });
      }
    }
  };

  const handleQuickScore = (participantIndex: number, score: number) => {
    const newScores = scores.map((participantScores, index) => {
      if (index === participantIndex) {
        return [...participantScores, score];
      }
      return [...participantScores, 0];
    });
    
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
        <CustomNumberPad
          value={currentScore}
          onNumberPress={(number) => setCurrentScore(prev => prev + number.toString())}
          onClear={() => setCurrentScore('')}
          onSubmit={() => handleScoreSubmit(participantIndex)}
        />
        <View style={styles.quickScores}>
          <TouchableOpacity
            style={styles.quickScoreButton}
            onPress={() => {
              setCurrentScore('25');
              handleScoreSubmit(participantIndex);
            }}
          >
            <Text style={styles.quickScoreText}>25</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.quickScoreButton}
            onPress={() => {
              setCurrentScore('30');
              handleScoreSubmit(participantIndex);
            }}
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
        <FrostedGlassCard>
          <View style={styles.headerContainer}>
            {isLeading && total > 0 && (
              <Animated.View 
                style={[
                  styles.crownContainer,
                  {
                    transform: [{ scale: crownBounce }],
                  },
                ]}
              >
                <Icon name="crown" size={24} color={COLORS.accent} />
              </Animated.View>
            )}
            <Text style={styles.participantName}>{participants[index]}</Text>
          </View>

          <Text style={[
            styles.totalScore,
            isLeading && total > 0 && styles.leadingScore,
          ]}>
            {total}
          </Text>

          {activeInputIndex === index ? (
            <View style={styles.scoreInputContainer}>
              <TextInput
                style={styles.scoreInput}
                value={currentScore}
                onChangeText={setCurrentScore}
                keyboardType="number-pad"
                autoFocus
                returnKeyType="done"
                onSubmitEditing={() => handleScoreSubmit(index)}
              />
              <TouchableOpacity
                style={styles.doneButton}
                onPress={() => handleScoreSubmit(index)}
              >
                <Text style={styles.doneButtonText}>Done</Text>
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

          <ScrollView style={styles.scoresContainer}>
            {scores[index].map((score, scoreIndex) => (
              <View key={scoreIndex} style={styles.scoreRow}>
                <Text style={styles.scoreText}>{score}</Text>
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
        </FrostedGlassCard>
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
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="gameplay" />
      
      <View style={styles.content}>
        <TouchableOpacity 
          style={styles.resetButton}
          onPress={handleReset}
        >
          <Icon name="refresh" size={24} color={COLORS.white} />
        </TouchableOpacity>

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
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  content: {
    flex: 1,
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: SPACING.xl * 2,
    paddingHorizontal: SPACING.sm,
  },
  playersContainer: {
    flex: 1,
    paddingTop: SPACING.xl * 2,
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
    backgroundColor: COLORS.white + '80',
    borderRadius: 12,
    padding: SPACING.xs,
  },
  participantName: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text.primary,
    textAlign: 'center',
    flex: 1,
  },
  totalScore: {
    ...FONTS.bold,
    fontSize: 40,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  leadingScore: {
    color: COLORS.accent,
    fontSize: 48,
  },
  scoresContainer: {
    marginTop: SPACING.md,
    maxHeight: 200,
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
  },
  addScoreButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: SPACING.md,
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
  },
  scoreInputContainer: {
    marginVertical: SPACING.sm,
    gap: SPACING.sm,
  },
  scoreInputRow: {
    marginBottom: SPACING.sm,
  },
  scoreInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.sm,
    fontSize: 24,
    textAlign: 'center',
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
  keyboardDoneButton: {
    padding: SPACING.sm,
    marginRight: SPACING.sm,
  },
  keyboardDoneButtonText: {
    color: COLORS.primary,
    fontSize: 17,
    fontWeight: '600',
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
  resetButton: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: COLORS.primary,
    padding: SPACING.sm,
    borderRadius: 8,
    zIndex: 10,
    ...SHADOWS.medium,
  },
}); 