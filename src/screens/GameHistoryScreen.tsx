import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';
import { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../translations/TranslationContext';

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
      <FrostedGlassCard key={index} style={styles.gameCard}>
        <View style={styles.gameHeader}>
          <Text style={styles.timestamp}>{formatDate(game.timestamp)}</Text>
          <View style={[
            styles.statusBadge,
            isCompleted ? styles.completedBadge : styles.inProgressBadge
          ]}>
            <Text style={styles.statusText}>
              {isCompleted ? t.gameHistory.completed : t.gameHistory.inProgress}
            </Text>
          </View>
        </View>

        <View style={styles.gameInfo}>
          <Text style={styles.gameMode}>
            {game.gameMode === 'teams' ? t.settings.teams : t.settings.players}
          </Text>
          <Text style={styles.targetScore}>
            {t.gameSetup.targetScore}: {game.targetScore}
          </Text>
        </View>

        <View style={styles.participantsContainer}>
          {game.participants.map((participant, idx) => (
            <View key={idx} style={styles.participantRow}>
              <Text style={styles.participantName}>{participant}</Text>
              <Text style={styles.participantScore}>
                {game.scores[idx].reduce((sum, score) => sum + score, 0)}
              </Text>
            </View>
          ))}
        </View>

        {game.winner && (
          <View style={styles.winnerContainer}>
            <Icon name="trophy" size={20} color={COLORS.primary} />
            <Text style={styles.winnerText}>{game.winner}</Text>
          </View>
        )}
      </FrostedGlassCard>
    );
  };

  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('GameSetup')}
        >
          <Icon name="chevron-left" size={32} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={styles.title}>{t.gameHistory.title}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {gameHistory.length > 0 ? (
          gameHistory.map((game, index) => renderGameItem(game, index))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="history" size={48} color={COLORS.text.secondary} />
            <Text style={styles.emptyText}>{t.gameHistory.noGames}</Text>
          </View>
        )}
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : SPACING.xl,
    paddingBottom: SPACING.lg,
  },
  backButton: {
    position: 'absolute',
    left: SPACING.lg,
    top: Platform.OS === 'ios' ? 60 : SPACING.xl,
    zIndex: 10,
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.xs,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: SPACING.lg,
    gap: SPACING.lg,
  },
  gameCard: {
    padding: SPACING.md,
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
  statusBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: 12,
  },
  completedBadge: {
    backgroundColor: COLORS.success + '20',
  },
  inProgressBadge: {
    backgroundColor: COLORS.warning + '20',
  },
  statusText: {
    ...FONTS.medium,
    fontSize: 12,
    color: COLORS.text.secondary,
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
  targetScore: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  participantsContainer: {
    gap: SPACING.xs,
  },
  participantRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  participantName: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
  },
  participantScore: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
  },
  winnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    marginTop: SPACING.md,
    paddingTop: SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  winnerText: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.primary,
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
}); 