import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';
import { RootStackParamList } from '../navigation/types';
import { useTranslation } from '../translations/TranslationContext';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

type GameMode = 'teams' | 'players';

const STORAGE_KEYS = {
  DEFAULT_SCORE: '@default_score',
  DEFAULT_GAME_MODE: '@default_game_mode',
  GAME_IN_PROGRESS: '@game_state',
  GAME_HISTORY: '@game_history'
};

export default function SettingsScreen({ navigation }: Props) {
  const { t, language, setLanguage } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { isDark } = useTheme();
  console.log('Current language:', language); // Debug log
  
  // Game Settings
  const [defaultScore, setDefaultScore] = useState(200);
  const [defaultGameMode, setDefaultGameMode] = useState<GameMode>('teams');

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [savedScore, savedGameMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_GAME_MODE),
      ]);
      
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

  const handleLanguageChange = async (newLanguage: 'en' | 'es') => {
    console.log('Changing language to:', newLanguage); // Debug log
    await setLanguage(newLanguage);
  };

  // Handle data management
  const handleClearHistory = () => {
    Alert.alert(
      t.alerts.clearHistoryTitle,
      t.alerts.clearHistoryMessage,
      [
        { text: t.common.cancel, style: 'cancel' },
        {
          text: t.common.clear,
          style: 'destructive',
          onPress: async () => {
            try {
              // Clear both game in progress and game history
              await Promise.all([
                AsyncStorage.removeItem(STORAGE_KEYS.GAME_IN_PROGRESS),
                AsyncStorage.removeItem(STORAGE_KEYS.GAME_HISTORY)
              ]);
              Alert.alert(t.alerts.success, t.alerts.clearHistorySuccess);
            } catch (error) {
              console.error('Error clearing history:', error);
              Alert.alert(t.alerts.error, t.alerts.clearHistoryError);
            }
          },
        },
      ]
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
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            isDark && styles.titleDark
          ]}>{t.settings.title}</Text>
        </View>

        {/* Language Settings */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.language}</Text>
          <View style={styles.settingContainer}>
            <Text style={[
              styles.settingText,
              isDark && styles.settingTextDark
            ]}>{t.settings.appLanguage}</Text>
            <View style={styles.languageOptions}>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  isDark && styles.languageOptionDark,
                  language === 'en' && styles.languageOptionActive,
                  language === 'en' && isDark && styles.languageOptionActiveDark,
                ]}
                onPress={() => handleLanguageChange('en')}
              >
                <Text style={[
                  styles.languageOptionText,
                  isDark && styles.languageOptionTextDark,
                  language === 'en' && styles.languageOptionTextActive,
                ]}>
                  English
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.languageOption,
                  isDark && styles.languageOptionDark,
                  language === 'es' && styles.languageOptionActive,
                  language === 'es' && isDark && styles.languageOptionActiveDark,
                ]}
                onPress={() => handleLanguageChange('es')}
              >
                <Text style={[
                  styles.languageOptionText,
                  isDark && styles.languageOptionTextDark,
                  language === 'es' && styles.languageOptionTextActive,
                ]}>
                  Español
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Appearance Settings */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.appearance}</Text>
          <View style={styles.settingContainer}>
            <Text style={[
              styles.settingText,
              isDark && styles.settingTextDark
            ]}>{t.settings.theme}</Text>
            <View style={styles.themeOptions}>
              <TouchableOpacity
                style={[
                  styles.themeOption,
                  isDark && styles.themeOptionDark,
                  theme === 'light' && styles.themeOptionActive,
                  theme === 'light' && isDark && styles.themeOptionActiveDark,
                ]}
                onPress={() => setTheme('light')}
              >
                <Icon 
                  name="white-balance-sunny" 
                  size={24} 
                  color={theme === 'light' ? COLORS.white : (isDark ? COLORS.text.dark.primary : COLORS.primary)} 
                />
                <Text style={[
                  styles.themeOptionText,
                  isDark && styles.themeOptionTextDark,
                  theme === 'light' && styles.themeOptionTextActive,
                ]}>
                  {t.settings.light}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  isDark && styles.themeOptionDark,
                  theme === 'dark' && styles.themeOptionActive,
                  theme === 'dark' && isDark && styles.themeOptionActiveDark,
                ]}
                onPress={() => setTheme('dark')}
              >
                <Icon 
                  name="moon-waning-crescent" 
                  size={24} 
                  color={theme === 'dark' ? COLORS.white : (isDark ? COLORS.text.dark.primary : COLORS.primary)} 
                />
                <Text style={[
                  styles.themeOptionText,
                  isDark && styles.themeOptionTextDark,
                  theme === 'dark' && styles.themeOptionTextActive,
                ]}>
                  {t.settings.dark}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.themeOption,
                  isDark && styles.themeOptionDark,
                  theme === 'system' && styles.themeOptionActive,
                  theme === 'system' && isDark && styles.themeOptionActiveDark,
                ]}
                onPress={() => setTheme('system')}
              >
                <Icon 
                  name="theme-light-dark" 
                  size={24} 
                  color={theme === 'system' ? COLORS.white : (isDark ? COLORS.text.dark.primary : COLORS.primary)} 
                />
                <Text style={[
                  styles.themeOptionText,
                  isDark && styles.themeOptionTextDark,
                  theme === 'system' && styles.themeOptionTextActive,
                ]}>
                  {t.settings.system}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* App Information */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.appInformation}</Text>
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.privacyPolicy}</Text>
              <Icon name="chevron-right" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
            <View style={styles.settingRow}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.common.version}</Text>
              <Text style={[
                styles.settingValue,
                isDark && styles.settingValueDark
              ]}>1.1.3</Text>
            </View>
          </View>
        </View>

        {/* Game Settings */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.gameSettings}</Text>
          <View>
            <View style={styles.settingContainer}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.defaultTargetScore}</Text>
              <View style={styles.scoreOptions}>
                {[200, 300, 400].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreOption,
                      isDark && styles.scoreOptionDark,
                      defaultScore === score && styles.scoreOptionActive,
                      defaultScore === score && isDark && styles.scoreOptionActiveDark,
                    ]}
                    onPress={() => handleScoreChange(score)}
                  >
                    <Text style={[
                      styles.scoreOptionText,
                      isDark && styles.scoreOptionTextDark,
                      defaultScore === score && styles.scoreOptionTextActive,
                    ]}>
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={styles.settingContainer}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.defaultGameMode}</Text>
              <View style={styles.gameModeOptions}>
                <TouchableOpacity
                  style={[
                    styles.gameModeOption,
                    isDark && styles.gameModeOptionDark,
                    defaultGameMode === 'teams' && styles.gameModeOptionActive,
                    defaultGameMode === 'teams' && isDark && styles.gameModeOptionActiveDark,
                  ]}
                  onPress={() => handleGameModeChange('teams')}
                >
                  <Text style={[
                    styles.gameModeOptionText,
                    isDark && styles.gameModeOptionTextDark,
                    defaultGameMode === 'teams' && styles.gameModeOptionTextActive,
                  ]}>
                    {t.settings.teams}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.gameModeOption,
                    isDark && styles.gameModeOptionDark,
                    defaultGameMode === 'players' && styles.gameModeOptionActive,
                    defaultGameMode === 'players' && isDark && styles.gameModeOptionActiveDark,
                  ]}
                  onPress={() => handleGameModeChange('players')}
                >
                  <Text style={[
                    styles.gameModeOptionText,
                    isDark && styles.gameModeOptionTextDark,
                    defaultGameMode === 'players' && styles.gameModeOptionTextActive,
                  ]}>
                    {t.settings.players}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* Support */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.support}</Text>
          <View>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Linking.openURL('mailto:app@aplicadom.com')}
            >
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.contactUs}</Text>
              <Icon name="email" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Linking.openURL('mailto:app@aplicadom.com?subject=Bug%20Report')}
            >
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.reportBug}</Text>
              <Icon name="bug" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.settingRow}
              onPress={() => Linking.openURL('mailto:app@aplicadom.com?subject=Feature%20Request')}
            >
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.requestFeature}</Text>
              <Icon name="lightbulb-on" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.dataManagement}</Text>
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={handleClearHistory}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.clearGameHistory}</Text>
              <Icon name="delete" size={24} color={COLORS.error} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Legal */}
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>{t.settings.legal}</Text>
          <View>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('TermsOfService')}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.termsOfService}</Text>
              <Icon name="chevron-right" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.settingRow} onPress={() => navigation.navigate('AppStore')}>
              <Text style={[
                styles.settingText,
                isDark && styles.settingTextDark
              ]}>{t.settings.appStoreInfo}</Text>
              <Icon name="chevron-right" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            </TouchableOpacity>
          </View>
        </View>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
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
    marginRight: SPACING.md,
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
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    textAlign: 'center',
    flex: 1,
    marginRight: 40,
    opacity: 1,
  },
  titleDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
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
    opacity: 1,
  },
  cardTitleDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray + '20',
  },
  settingText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text.primary,
    marginBottom: SPACING.sm,
    opacity: 1,
  },
  settingTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  settingContainer: {
    paddingVertical: SPACING.md,
  },
  settingValue: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.secondary,
    opacity: 1,
  },
  settingValueDark: {
    color: COLORS.text.dark.secondary,
    opacity: 1,
  },
  languageOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.sm,
  },
  languageOption: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.md,
    borderRadius: 8,
    marginHorizontal: SPACING.xs,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  languageOptionDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  languageOptionActive: {
    backgroundColor: COLORS.primary + '80',
  },
  languageOptionActiveDark: {
    backgroundColor: COLORS.secondary + '80',
  },
  languageOptionText: {
    ...FONTS.regular,
    color: COLORS.primary,
    textAlign: 'center',
    opacity: 1,
  },
  languageOptionTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  languageOptionTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  scoreOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  scoreOption: {
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  scoreOptionDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  scoreOptionActive: {
    backgroundColor: COLORS.primary + '80',
  },
  scoreOptionActiveDark: {
    backgroundColor: COLORS.secondary + '80',
  },
  scoreOptionText: {
    ...FONTS.medium,
    color: COLORS.text.primary,
    opacity: 1,
  },
  scoreOptionTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  scoreOptionTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  gameModeOptions: {
    flexDirection: 'row',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  gameModeOption: {
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  gameModeOptionDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  gameModeOptionActive: {
    backgroundColor: COLORS.primary + '80',
  },
  gameModeOptionActiveDark: {
    backgroundColor: COLORS.secondary + '80',
  },
  gameModeOptionText: {
    ...FONTS.medium,
    color: COLORS.text.primary,
    opacity: 1,
  },
  gameModeOptionTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  gameModeOptionTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  themeOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.sm,
    marginTop: SPACING.xs,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    paddingVertical: SPACING.md,
    paddingHorizontal: SPACING.sm,
    borderRadius: 8,
    gap: SPACING.xs,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  themeOptionDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  themeOptionActive: {
    backgroundColor: COLORS.primary + '80',
  },
  themeOptionActiveDark: {
    backgroundColor: COLORS.secondary + '80',
  },
  themeOptionText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.primary,
    textAlign: 'center',
    opacity: 1,
  },
  themeOptionTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  themeOptionTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
    marginBottom: SPACING.md,
    opacity: 1,
  },
  sectionTitleDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
}); 