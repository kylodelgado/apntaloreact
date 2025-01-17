import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS } from '../styles/theme';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export default function GameOverScreen({ navigation, route }: Props) {
  const { scores, winner, gameMode } = route.params;

  const calculateTotal = (participantScores: number[]) => 
    participantScores.reduce((sum, score) => sum + score, 0);

  const renderParticipantSummary = (index: number) => {
    const participantScores = scores[index];
    const total = calculateTotal(participantScores);
    const isWinner = winner === (gameMode === 'teams' ? `Team ${index + 1}` : `Player ${index + 1}`);

    return (
      <View style={[styles.participantSummary, isWinner && styles.winningParticipant]}>
        <View style={styles.participantHeader}>
          <Text style={styles.participantTitle}>
            {gameMode === 'teams' ? `Team ${index + 1}` : `Player ${index + 1}`}
          </Text>
          {isWinner && (
            <Text style={styles.winnerLabel}>Winner! 🏆</Text>
          )}
        </View>
        <Text style={styles.totalScore}>{total}</Text>
        <ScrollView style={styles.scoresList}>
          {participantScores.map((score, scoreIndex) => (
            <Text key={scoreIndex} style={styles.scoreItem}>
              {score}
            </Text>
          ))}
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.content}>
        <Text style={styles.gameOverTitle}>¡Juego Terminado!</Text>

        <View style={styles.participantsContainer}>
          {scores.map((_, index) => renderParticipantSummary(index))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.newGameButton]}
            onPress={() => navigation.navigate('GameSetup')}
          >
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  homeButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...FONTS.medium,
    color: COLORS.white,
    fontSize: 18,
  },
}); 