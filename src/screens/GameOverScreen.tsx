import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import ViewShot, { ViewShotProperties } from 'react-native-view-shot';
import Share from 'react-native-share';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export default function GameOverScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { scores, winner, gameMode, targetScore } = route.params;
  const viewShotRef = useRef<ViewShot & { capture: () => Promise<string> }>(null);

  // Save game to history when component mounts
  useEffect(() => {
    saveGameToHistory();
  }, []);

  const handleShare = async () => {
    try {
      if (viewShotRef.current) {
        const uri = await viewShotRef.current.capture();
        await Share.open({
          url: uri,
          title: t.gameplay.gameOver,
          message: `${t.gameplay.gameOver} - ${winner} ${t.gameplay.winner}! 🏆`,
        });
      }
    } catch (error) {
      console.error('Error sharing screenshot:', error);
    }
  };

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
          gameMode === 'teams' ? `${t.settings.team} ${index + 1}` : `${t.settings.player} ${index + 1}`
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
    const participantName = gameMode === 'teams' 
      ? `${t.settings.team} ${index + 1}` 
      : `${t.settings.player} ${index + 1}`;
    const isWinner = winner === participantName;

    return (
      <View key={`participant-${index}`} style={[
        styles.participantSummary, 
        isWinner && styles.winningParticipant,
      ]}>
        <View style={styles.participantHeader}>
          <Text style={styles.participantTitle}>
            {participantName}
          </Text>
          {isWinner && (
            <Text style={styles.winnerLabel}>{t.gameplay.winner} 🏆</Text>
          )}
        </View>
        <Text style={styles.totalScore}>{total}</Text>
        <View style={styles.scoresList}>
          {participantScores.map((score, scoreIndex) => (
            <Text key={`score-${scoreIndex}`} style={styles.scoreItem}>
              {score}
            </Text>
          ))}
        </View>
      </View>
    );
  };

  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="gameOver" opacity={0.08} />
      
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.shareButton}
          onPress={handleShare}
        >
          <Icon name="share-variant" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ViewShot ref={viewShotRef} style={styles.container}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.gameOverTitle}>{t.gameplay.gameOver}</Text>

            <View style={styles.participantsContainer}>
              {scores.map((_, index) => (
                <View key={`participant-${index}`} style={styles.participantColumn}>
                  {renderParticipantSummary(index)}
                </View>
              ))}
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
        </ScrollView>
      </ViewShot>
    </GradientBackground>
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
    padding: SPACING.lg,
  },
  gameOverTitle: {
    ...FONTS.bold,
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.lg,
  },
  participantsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  participantColumn: {
    width: '47%',
  },
  participantSummary: {
    backgroundColor: COLORS.lightGray,
    borderRadius: 12,
    padding: SPACING.md,
    height: 'auto',
  },
  winningParticipant: {
    backgroundColor: COLORS.success + '20',
    borderWidth: 2,
    borderColor: COLORS.success,
  },
  participantHeader: {
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  participantTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text.primary,
    marginBottom: SPACING.xs,
  },
  winnerLabel: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.success,
  },
  totalScore: {
    ...FONTS.bold,
    fontSize: 40,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  scoresList: {
    width: '100%',
  },
  scoresListContent: {
    flexGrow: 1,
  },
  scoreItem: {
    ...FONTS.medium,
    fontSize: 22,
    color: COLORS.text.primary,
    textAlign: 'center',
    padding: SPACING.xs,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    marginTop: 'auto',
    paddingHorizontal: SPACING.md,
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
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: Platform.OS === 'ios' ? SPACING.xl * 2 : SPACING.xl,
    marginBottom: SPACING.md,
  },
  shareButton: {
    backgroundColor: COLORS.white,
    padding: SPACING.xs,
    borderRadius: 8,
    ...SHADOWS.small,
  },
}); 