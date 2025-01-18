import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

type GameMode = 'teams' | 'players';

const STORAGE_KEYS = {
  DEFAULT_SCORE: '@default_score',
  DEFAULT_GAME_MODE: '@default_game_mode',
};

export default function SettingsScreen({ navigation }: Props) {
  // Game Settings
  const [defaultScore, setDefaultScore] = useState(200);
  const [defaultGameMode, setDefaultGameMode] = useState<GameMode>('teams');

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedScore = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SCORE);
      const savedGameMode = await AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_GAME_MODE);
      
      if (savedScore) setDefaultScore(parseInt(savedScore, 10));
      if (savedGameMode) setDefaultGameMode(savedGameMode as GameMode);
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const handleScoreChange = async (score: number) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_SCORE, score.toString());
      setDefaultScore(score);
    } catch (error) {
      console.error('Error saving default score:', error);
    }
  };

  const handleGameModeChange = async (mode: GameMode) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.DEFAULT_GAME_MODE, mode);
      setDefaultGameMode(mode);
    } catch (error) {
      console.error('Error saving default game mode:', error);
    }
  };

  // Handle data management
  const handleClearHistory = () => {
    Alert.alert(
      'Clear Game History',
      'Are you sure you want to clear all game history? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('@game_state');
              Alert.alert('Success', 'Game history cleared successfully');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear game history');
            }
          },
        },
      ]
    );
  };

  const renderSettingsCard = (title: string, children: React.ReactNode) => (
    <FrostedGlassCard style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      {children}
    </FrostedGlassCard>
  );

  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Settings</Text>

        {/* App Information */}
        {renderSettingsCard('App Information', (
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.settingText}>Privacy Policy</Text>
              <Icon name="chevron-right" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.settingRow}>
              <Text style={styles.settingText}>Version</Text>
              <Text style={styles.settingValue}>1.0.0</Text>
            </View>
          </View>
        ))}

        {/* Game Settings */}
        {renderSettingsCard('Game Settings', (
          <View>
            <View style={styles.settingContainer}>
              <Text style={styles.settingText}>Default Target Score</Text>
              <View style={styles.scoreOptions}>
                {[200, 300, 400].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreOption,
                      defaultScore === score && styles.scoreOptionActive,
                    ]}
                    onPress={() => handleScoreChange(score)}
                  >
                    <Text style={[
                      styles.scoreOptionText,
                      defaultScore === score && styles.scoreOptionTextActive,
                    ]}>
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.settingContainer}>
              <Text style={styles.settingText}>Default Game Mode</Text>
              <View style={styles.gameModeOptions}>
                <TouchableOpacity
                  style={[
                    styles.gameModeOption,
                    defaultGameMode === 'teams' && styles.gameModeOptionActive,
                  ]}
                  onPress={() => handleGameModeChange('teams')}
                >
                  <Text style={[
                    styles.gameModeOptionText,
                    defaultGameMode === 'teams' && styles.gameModeOptionTextActive,
                  ]}>
                    Teams
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.gameModeOption,
                    defaultGameMode === 'players' && styles.gameModeOptionActive,
                  ]}
                  onPress={() => handleGameModeChange('players')}
                >
                  <Text style={[
                    styles.gameModeOptionText,
                    defaultGameMode === 'players' && styles.gameModeOptionTextActive,
                  ]}>
                    Players
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {/* Support */}
        {renderSettingsCard('Support', (
          <View>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Linking.openURL('mailto:app@ardanco.com')}
            >
              <Text style={styles.settingText}>Contact Us</Text>
              <Icon name="email" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Linking.openURL('mailto:app@ardanco.com?subject=Bug%20Report')}
            >
              <Text style={styles.settingText}>Report a Bug</Text>
              <Icon name="bug" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Data Management */}
        {renderSettingsCard('Data Management', (
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearHistory}>
              <Text style={styles.settingText}>Clear Game History</Text>
              <Icon name="delete" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Legal */}
        {renderSettingsCard('Legal', (
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={styles.settingText}>Terms of Service</Text>
              <Icon name="chevron-right" size={24} color={COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('AppStore')}>
              <Text style={styles.settingText}>App Store Information</Text>
              <Icon name="chevron-right" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        ))}
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
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  card: {
    marginBottom: SPACING.lg,
    padding: SPACING.md,
  },
  cardTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  settingContainer: {
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  settingText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
  },
  settingValue: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.secondary,
  },
  scoreOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  scoreOption: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  scoreOptionActive: {
    backgroundColor: COLORS.primary,
  },
  scoreOptionText: {
    ...FONTS.medium,
    color: COLORS.text.primary,
  },
  scoreOptionTextActive: {
    color: COLORS.white,
  },
  gameModeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  gameModeOption: {
    backgroundColor: COLORS.lightGray,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  gameModeOptionActive: {
    backgroundColor: COLORS.primary,
  },
  gameModeOptionText: {
    ...FONTS.medium,
    color: COLORS.text.primary,
  },
  gameModeOptionTextActive: {
    color: COLORS.white,
  },
}); 