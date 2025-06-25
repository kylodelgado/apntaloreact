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
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GameOver'>;

export default function GameOverScreen({ navigation, route }: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
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
        isDark && styles.participantSummaryDark,
        isWinner && styles.winningParticipant,
        isWinner && isDark && styles.winningParticipantDark,
      ]}>
        <View style={styles.participantHeader}>
          <Text style={[
            styles.participantTitle,
            isDark && styles.participantTitleDark
          ]}>
            {participantName}
          </Text>
          {isWinner && (
            <Text style={styles.winnerLabel}>{t.gameplay.winner} 🏆</Text>
          )}
        </View>
        <Text style={[
          styles.totalScore,
          isDark && styles.totalScoreDark
        ]}>{total}</Text>
        <View style={styles.scoresList}>
          {participantScores.map((score, scoreIndex) => (
            <Text key={`score-${scoreIndex}`} style={[
              styles.scoreItem,
              isDark && styles.scoreItemDark
            ]}>
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
          style={[
            styles.shareButton,
            isDark && styles.shareButtonDark
          ]}
          onPress={handleShare}
        >
          <Icon name="share-variant" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
        </TouchableOpacity>
      </View>

      <ViewShot ref={viewShotRef} style={styles.container}>
        <ScrollView 
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={[
              styles.gameOverTitle,
              isDark && styles.gameOverTitleDark
            ]}>{t.gameplay.gameOver}</Text>

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
  gameOverTitleDark: {
    color: COLORS.text.dark.primary,
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
    backgroundColor: Platform.select({
      ios: COLORS.white + '80',
      android: 'rgba(255, 255, 255, 0.9)',
    }),
    borderRadius: 12,
    padding: SPACING.md,
    height: 'auto',
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  participantSummaryDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.5)',
      android: 'rgba(45, 55, 72, 0.65)',
    }),
    overflow: 'hidden',
  },
  winningParticipant: {
    backgroundColor: Platform.select({
      ios: COLORS.success + '20',
      android: 'rgba(40, 167, 69, 0.2)',
    }),
    borderWidth: 2,
    borderColor: COLORS.success,
    overflow: 'hidden',
  },
  winningParticipantDark: {
    backgroundColor: Platform.select({
      ios: COLORS.success + '30',
      android: 'rgba(40, 167, 69, 0.3)',
    }),
    borderColor: COLORS.success + 'CC',
    overflow: 'hidden',
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
    opacity: 1,
  },
  participantTitleDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  winnerLabel: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.success,
    opacity: 1,
  },
  totalScore: {
    ...FONTS.bold,
    fontSize: 40,
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: SPACING.sm,
    opacity: 1,
  },
  totalScoreDark: {
    color: COLORS.accent,
    opacity: 1,
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
    opacity: 1,
  },
  scoreItemDark: {
    color: COLORS.text.dark.primary,
    borderBottomColor: COLORS.text.dark.secondary + '20',
    opacity: 1,
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
    backgroundColor: Platform.select({
      ios: COLORS.white + '80',
      android: 'rgba(255, 255, 255, 0.95)',
    }),
    padding: SPACING.xs,
    borderRadius: 8,
    ...SHADOWS.small,
  },
  shareButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.5)',
      android: 'rgba(45, 55, 72, 0.9)',
    }),
  },
}); 