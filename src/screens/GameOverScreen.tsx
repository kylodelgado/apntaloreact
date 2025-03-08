import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export default function GameOverScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { scores, winner, gameMode, targetScore } = route.params;

  // Save game to history when component mounts
  useEffect(() => {
    saveGameToHistory();
  }, []);

  const saveGameToHistory = async () => {
    try {
      // Get existing history
      const historyJson = await AsyncStorage.getItem('@game_history');
      const history = historyJson ? JSON.parse(historyJson) : [];

      // Create new game history entry
      const gameEntry = {
        timestamp: new Date().toISOString(),
        gameMode,
        targetScore,
        participants: scores.map((_, index) => 
          gameMode === 'teams' ? `Team ${index + 1}` : `Player ${index + 1}`
        ),
        scores,
        winner,
      };

      // Add new game to history
      const updatedHistory = [gameEntry, ...history];

      // Save updated history
      await AsyncStorage.setItem('@game_history', JSON.stringify(updatedHistory));

      // Clear the game in progress
      await AsyncStorage.removeItem('@game_state');
    } catch (error) {
      console.error('Error saving game to history:', error);
    }
  };

  const calculateTotal = (participantScores: number[]) => 
    participantScores.reduce((sum, score) => sum + score, 0);

  const renderParticipantSummary = (index: number) => {
    const participantScores = scores[index];
    const total = calculateTotal(participantScores);
    const participantName = gameMode === 'teams' ? `Team ${index + 1}` : `Player ${index + 1}`;
    const isWinner = winner === participantName;

    return (
      <View key={`participant-${index}`} style={[styles.participantSummary, isWinner && styles.winningParticipant]}>
        <View style={styles.participantHeader}>
          <Text style={styles.participantTitle}>
            {participantName}
          </Text>
          {isWinner && (
            <Text style={styles.winnerLabel}>{t.gameplay.winner} 🏆</Text>
          )}
        </View>
        <Text style={styles.totalScore}>{total}</Text>
        <ScrollView style={styles.scoresList}>
          {participantScores.map((score, scoreIndex) => (
            <Text key={`score-${scoreIndex}`} style={styles.scoreItem}>
              {score}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="gameOver" opacity={0.08} />
      
      <View style={styles.content}>
        <Text style={styles.gameOverTitle}>{t.gameplay.gameOver}</Text>

        <View style={styles.participantsContainer}>
          {scores.map((_, index) => renderParticipantSummary(index))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.newGameButton]}
            onPress={() => navigation.navigate('GameSetup')}
          >
            <Text style={styles.buttonText}>{t.gameSetup.newGame}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.historyButton]}
            onPress={() => navigation.navigate('GameHistory')}
          >
            <Text style={styles.buttonText}>{t.gameSetup.viewHistory}</Text>
          </TouchableOpacity>
        </View>
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
    padding: SPACING.lg,
  },
  gameOverTitle: {
    ...FONTS.bold,
    fontSize: 36,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.xl,
  },
  participantsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.md,
    justifyContent: 'center',
  },
  participantSummary: {
    flex: 1,
    minWidth: 150,
    maxWidth: 200,
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    margin: SPACING.sm,
  },
  winningParticipant: {
    backgroundColor: COLORS.success + '20',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  participantHeader: {
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  participantTitle: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  winnerLabel: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.success,
  },
  totalScore: {
    ...FONTS.bold,
    fontSize: 48,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.md,
  },
  scoresList: {
    maxHeight: 200,
  },
  scoreItem: {
    ...FONTS.regular,
    fontSize: 16,
    textAlign: 'center',
    padding: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: SPACING.lg,
  },
  button: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  newGameButton: {
    backgroundColor: COLORS.primary,
  },
  historyButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...FONTS.medium,
    color: COLORS.white,
    fontSize: 18,
  },
}); 