import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  StatusBar,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../translations/TranslationContext';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GameHistory'>;

type GameHistoryItem = {
  timestamp: string;
  gameMode: 'teams' | 'players';
  targetScore: number;
  participants: string[];
  scores: number[][];
  winner?: string;
};

export default function GameHistoryScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const [gameHistory, setGameHistory] = useState<GameHistoryItem[]>([]);

  useEffect(() => {
    loadGameHistory();
  }, []);

  const loadGameHistory = async () => {
    try {
      const history = await AsyncStorage.getItem('@game_history');
      if (history) {
        setGameHistory(JSON.parse(history));
      }
    } catch (error) {
      console.error('Error loading game history:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderGameItem = (game: GameHistoryItem, index: number) => {
    const isCompleted = game.winner !== undefined;

    return (
      <View key={index} style={[
        styles.gameCard,
        isDark && styles.gameCardDark,
        index > 0 && styles.gameCardMargin
      ]}>
        <View style={styles.gameHeader}>
          <Text style={[
            styles.timestamp,
            isDark && styles.timestampDark
          ]}>{formatDate(game.timestamp)}</Text>
          <View style={[
            styles.statusBadge,
            isCompleted ? styles.completedBadge : styles.inProgressBadge,
            isDark && (isCompleted ? styles.completedBadgeDark : styles.inProgressBadgeDark)
          ]}>
            <Text style={[
              styles.statusText,
              isDark && styles.statusTextDark
            ]}>
              {isCompleted ? t.gameHistory.completed : t.gameHistory.inProgress}
            </Text>
          </View>
        </View>

        <View style={styles.gameInfo}>
          <Text style={[
            styles.gameMode,
            isDark && styles.gameModeDark
          ]}>
            {game.gameMode === 'teams' ? t.settings.teams : t.settings.players}
          </Text>
          <Text style={[
            styles.targetScore,
            isDark && styles.targetScoreDark
          ]}>
            {t.gameSetup.targetScore}: {game.targetScore}
          </Text>
        </View>

        <View style={styles.participantsContainer}>
          {game.participants.map((participant, idx) => (
            <View key={idx} style={[
              styles.participantRow,
              isDark && styles.participantRowDark
            ]}>
              <Text style={[
                styles.participantName,
                isDark && styles.participantNameDark
              ]}>{participant}</Text>
              <Text style={[
                styles.participantScore,
                isDark && styles.participantScoreDark
              ]}>
                {game.scores[idx].reduce((sum, score) => sum + score, 0)}
              </Text>
            </View>
          ))}
        </View>

        {game.winner && (
          <View style={[
            styles.winnerContainer,
            isDark && styles.winnerContainerDark
          ]}>
            <Icon name="trophy" size={20} color={isDark ? COLORS.accent : COLORS.primary} />
            <Text style={[
              styles.winnerText,
              isDark && styles.winnerTextDark
            ]}>{game.winner}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={[
              styles.backButton,
              isDark && styles.backButtonDark
            ]}
            onPress={() => navigation.navigate('GameSetup')}
          >
            <Icon name="chevron-left" size={32} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            isDark && styles.titleDark
          ]}>{t.gameHistory.title}</Text>
        </View>

        {gameHistory.length > 0 ? (
          gameHistory.map((game, index) => renderGameItem(game, index))
        ) : (
          <View style={styles.emptyState}>
            <Icon 
              name="history" 
              size={48} 
              color={isDark ? COLORS.text.dark.secondary : COLORS.text.secondary} 
            />
            <Text style={[
              styles.emptyText,
              isDark && styles.emptyTextDark
            ]}>{t.gameHistory.noGames}</Text>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
    paddingTop: 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.select({
      ios: 60,
      android: SPACING.xl,
    }),
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Platform.select({
      ios: COLORS.white + '80',
      android: 'rgb(255, 255, 255)',
    }),
    opacity: Platform.OS === 'android' ? 0.9 : 1,
    borderRadius: 8,
    padding: SPACING.xs,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  backButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.5)',
      android: 'rgb(45, 55, 72)',
    }),
    opacity: Platform.OS === 'android' ? 0.7 : 1,
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    flex: 1,
    marginRight: 40,
  },
  titleDark: {
    color: COLORS.text.dark.primary,
  },
  gameCard: {
    padding: SPACING.lg,
    borderRadius: 12,
    backgroundColor: Platform.select({
      ios: COLORS.white + '80',
      android: 'rgb(255, 255, 255)',
    }),
    opacity: Platform.OS === 'android' ? 0.9 : 1,
    ...SHADOWS.small,
  },
  gameCardDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.5)',
      android: 'rgb(45, 55, 72)',
    }),
    opacity: Platform.OS === 'android' ? 0.7 : 1,
  },
  gameCardMargin: {
    marginTop: SPACING.md,
  },
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  timestamp: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.text.secondary,
  },
  timestampDark: {
    color: COLORS.text.dark.secondary,
  },
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: Platform.select({
      ios: COLORS.success + '20',
      android: 'rgb(40, 167, 69)',
    }),
    opacity: Platform.OS === 'android' ? 0.2 : 1,
  },
  completedBadgeDark: {
    backgroundColor: Platform.select({
      ios: COLORS.success + '40',
      android: 'rgb(40, 167, 69)',
    }),
    opacity: Platform.OS === 'android' ? 0.4 : 1,
  },
  inProgressBadge: {
    backgroundColor: Platform.select({
      ios: COLORS.warning + '20',
      android: 'rgb(255, 193, 7)',
    }),
    opacity: Platform.OS === 'android' ? 0.2 : 1,
  },
  inProgressBadgeDark: {
    backgroundColor: Platform.select({
      ios: COLORS.warning + '40',
      android: 'rgb(255, 193, 7)',
    }),
    opacity: Platform.OS === 'android' ? 0.4 : 1,
  },
  statusText: {
    ...FONTS.medium,
    fontSize: 12,
    color: COLORS.text.secondary,
  },
  statusTextDark: {
    color: COLORS.text.dark.secondary,
  },
  gameInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
  },
  gameMode: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  gameModeDark: {
    color: COLORS.text.dark.primary,
  },
  targetScore: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  targetScoreDark: {
    color: COLORS.text.dark.primary,
  },
  participantsContainer: {
    gap: SPACING.xs,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border + '20',
    paddingVertical: SPACING.xs,
  },
  participantRowDark: {
    borderBottomColor: COLORS.text.dark.secondary + '20',
  },
  participantName: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  participantNameDark: {
    color: COLORS.text.dark.primary,
  },
  participantScore: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  participantScoreDark: {
    color: COLORS.accent,
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border + '20',
  },
  winnerContainerDark: {
    borderTopColor: COLORS.text.dark.secondary + '20',
  },
  winnerText: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  winnerTextDark: {
    color: COLORS.accent,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: SPACING.md,
    marginTop: SPACING.xxl,
  },
  emptyText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.secondary,
    textAlign: 'center',
  },
  emptyTextDark: {
    color: COLORS.text.dark.secondary,
  },
}); 