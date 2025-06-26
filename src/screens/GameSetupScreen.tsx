import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Platform,
  StatusBar,
  AppState,
  Alert,
  Share,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { RootStackParamList } from '../navigation/types';
import { DominoPattern } from '../components/DominoPattern';
import { useTranslation } from '../translations/TranslationContext';
import { useFocusEffect } from '@react-navigation/native';
import { ResponsiveContainer } from '../components/ResponsiveContainer';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'GameSetup'>;

const STORAGE_KEYS = {
  DEFAULT_SCORE: '@default_score',
  DEFAULT_GAME_MODE: '@default_game_mode',
  GAME_IN_PROGRESS: '@game_state',
};

export default function GameSetupScreen({ navigation }: Props) {
  const { t } = useTranslation();
  const { getResponsiveFontSize, getResponsiveSpacing, isTablet } = useResponsiveLayout();
  const { isDark } = useTheme();
  const [gameMode, setGameMode] = useState<'teams' | 'players'>('teams');
  const [teamNames, setTeamNames] = useState([`${t.settings.team} 1`, `${t.settings.team} 2`]);
  const [playerNames, setPlayerNames] = useState([`${t.settings.player} 1`, `${t.settings.player} 2`]);
  const [targetScore, setTargetScore] = useState(200);
  const [focusedInput, setFocusedInput] = useState<number | null>(null);
  const [hasGameInProgress, setHasGameInProgress] = useState(false);
  const appState = useRef(AppState.currentState);
  
  // Create refs array for inputs
  const inputRefs = useRef<Array<React.RefObject<TextInput>>>([]);
  // Animation values
  const inputScales = useRef<Animated.Value[]>([]);
  const [shareModalVisible, setShareModalVisible] = useState(false);
  const [showShareDot, setShowShareDot] = useState(false);
  const GOOGLE_PLAY_LINK = 'https://play.google.com/store/apps/details?id=com.dominoapunte';
  const APP_STORE_LINK = 'https://apps.apple.com/us/app/domino-apunte-rd/id6740721729';

  // Load default settings on mount
  useEffect(() => {
    loadDefaultSettings();
  }, []);

  // Check for game in progress when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      checkGameInProgress();
    }, [])
  );

  // Add AppState listener to handle app background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - check for game in progress
        checkGameInProgress();
      }
      
      // Update the AppState ref
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Update names when language changes
  useEffect(() => {
    if (gameMode === 'teams') {
      setTeamNames(prevNames => prevNames.map((_, index) => `${t.settings.team} ${index + 1}`));
    } else {
      setPlayerNames(prevNames => prevNames.map((_, index) => `${t.settings.player} ${index + 1}`));
    }
  }, [t, gameMode]);

  // Check if user has seen the share feature
  useEffect(() => {
    const checkShareFeature = async () => {
      try {
        const seen = await AsyncStorage.getItem('hasSeenShareFeature');
        setShowShareDot(!seen);
      } catch (e) {
        setShowShareDot(false);
      }
    };
    checkShareFeature();
  }, []);

  const checkGameInProgress = async () => {
    try {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
      if (gameData) {
        const parsedData = JSON.parse(gameData);
        // Only consider it a game in progress if it has valid data
        if (parsedData.scores && parsedData.gameMode && parsedData.targetScore) {
          setHasGameInProgress(true);
          // Update the form with the saved game settings
          setGameMode(parsedData.gameMode);
          setTargetScore(parsedData.targetScore);
          if (parsedData.gameMode === 'teams' && parsedData.participants) {
            setTeamNames(parsedData.participants);
          } else if (parsedData.gameMode === 'players' && parsedData.participants) {
            setPlayerNames(parsedData.participants);
          }
        } else {
          setHasGameInProgress(false);
        }
      } else {
        setHasGameInProgress(false);
      }
    } catch (error) {
      console.error('Error checking game in progress:', error);
      setHasGameInProgress(false);
    }
  };

  const loadDefaultSettings = async () => {
    try {
      const [savedScore, savedGameMode] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_SCORE),
        AsyncStorage.getItem(STORAGE_KEYS.DEFAULT_GAME_MODE),
      ]);

      if (savedScore) {
        const score = parseInt(savedScore, 10);
        setTargetScore(score);
      }
      
      if (savedGameMode) {
        setGameMode(savedGameMode as 'teams' | 'players');
      }
    } catch (error) {
      console.error('Error loading default settings:', error);
    }
  };

  // Initialize or update refs when number of participants changes
  useEffect(() => {
    const participants = gameMode === 'teams' ? teamNames : playerNames;
    // Initialize input refs
    inputRefs.current = Array(participants.length)
      .fill(null)
      .map((_, i) => inputRefs.current[i] || React.createRef<TextInput>());
    
    // Initialize animation values
    inputScales.current = Array(participants.length)
      .fill(null)
      .map((_, i) => inputScales.current[i] || new Animated.Value(1));
  }, [gameMode, teamNames.length, playerNames.length]);

  const animateInput = (index: number, focused: boolean) => {
    if (inputScales.current[index]) {
      Animated.spring(inputScales.current[index], {
        toValue: focused ? 1.05 : 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();
    }
  };

  const handleScoreChange = (value: number) => {
    setTargetScore(value);
    if ([200, 300, 400].includes(value)) {
      ReactNativeHapticFeedback.trigger('impactMedium');
    }
  };

  const startNewGame = async () => {
    // Fill empty fields with default names before starting
    if (gameMode === 'teams') {
      const filledTeamNames = teamNames.map((name, index) => 
        name.trim() || `${t.settings.team} ${index + 1}`
      );
      setTeamNames(filledTeamNames);
    } else {
      const filledPlayerNames = playerNames.map((name, index) => 
        name.trim() || `${t.settings.player} ${index + 1}`
      );
      setPlayerNames(filledPlayerNames);
    }

    // Clear any existing game data
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GAME_IN_PROGRESS);
    } catch (error) {
      console.error('Error clearing game data:', error);
    }
    
    // Start new game with filled names
    navigation.navigate('GamePlay', {
      targetScore,
      gameMode,
      ...(gameMode === 'teams' 
        ? { teamNames: teamNames.map((name, index) => name.trim() || `${t.settings.team} ${index + 1}`) }
        : { playerNames: playerNames.map((name, index) => name.trim() || `${t.settings.player} ${index + 1}`) }
      ),
    });
  };

  const continueGame = async () => {
    try {
      const gameData = await AsyncStorage.getItem(STORAGE_KEYS.GAME_IN_PROGRESS);
      if (gameData) {
        const parsedData = JSON.parse(gameData);
        if (parsedData.scores && parsedData.gameMode && parsedData.targetScore) {
          navigation.navigate('GamePlay', {
            gameMode: parsedData.gameMode,
            targetScore: parsedData.targetScore,
            ...(parsedData.gameMode === 'teams' 
              ? { teamNames: parsedData.participants }
              : { playerNames: parsedData.participants }
            ),
          });
        }
      }
    } catch (error) {
      console.error('Error loading saved game:', error);
    }
  };

  const handleShare = async (link: string) => {
    try {
      await Share.share({
        message: link,
      });
    } catch (error) {
      // Optionally handle error
    }
    setShareModalVisible(false);
  };

  // When opening the share modal, mark as seen
  const handleOpenShareModal = async () => {
    setShareModalVisible(true);
    if (showShareDot) {
      setShowShareDot(false);
      try {
        await AsyncStorage.setItem('hasSeenShareFeature', 'true');
      } catch (e) {}
    }
  };

  const renderNameInputs = () => {
    const participants = gameMode === 'teams' ? teamNames : playerNames;
    
    return participants.map((name, index) => (
      <Animated.View
        key={index}
        style={[
          styles.inputWrapper,
          isDark && styles.inputWrapperDark,
          {
            transform: [{ 
              scale: inputScales.current[index] || new Animated.Value(1)
            }],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.inputRow}
          onPress={() => inputRefs.current[index]?.current?.focus()}
        >
          <TextInput
            ref={inputRefs.current[index]}
            style={[
              styles.input,
              isDark && styles.inputDark,
              gameMode === 'players' && index > 1 && styles.inputWithButton
            ]}
            value={name}
            onChangeText={(text) => {
              if (gameMode === 'teams') {
                const newNames = [...teamNames];
                newNames[index] = text;
                setTeamNames(newNames);
              } else {
                const newNames = [...playerNames];
                newNames[index] = text;
                setPlayerNames(newNames);
              }
            }}
            onFocus={() => {
              setFocusedInput(index);
              animateInput(index, true);
              // Clear text immediately on focus
              if (gameMode === 'teams') {
                const newNames = [...teamNames];
                newNames[index] = '';
                setTeamNames(newNames);
              } else {
                const newNames = [...playerNames];
                newNames[index] = '';
                setPlayerNames(newNames);
              }
            }}
            onBlur={() => {
              setFocusedInput(null);
              animateInput(index, false);
              // If the field is empty when losing focus, restore default name
              if (gameMode === 'teams') {
                const newNames = [...teamNames];
                if (!newNames[index].trim()) {
                  newNames[index] = `${t.settings.team} ${index + 1}`;
                  setTeamNames(newNames);
                }
              } else {
                const newNames = [...playerNames];
                if (!newNames[index].trim()) {
                  newNames[index] = `${t.settings.player} ${index + 1}`;
                  setPlayerNames(newNames);
                }
              }
            }}
            autoCorrect={false}
            spellCheck={false}
            autoCapitalize="words"
          />
          <View style={styles.inputIconsContainer}>
            <Icon 
              name="pencil-outline" 
              size={18} 
              color={isDark ? COLORS.text.dark.secondary : COLORS.text.secondary}
              style={styles.editIcon}
            />
            {gameMode === 'players' && index > 1 && (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => {
                  const newNames = playerNames.filter((_, i) => i !== index);
                  setPlayerNames(newNames);
                }}
              >
                <Icon name="close" size={24} color={COLORS.error} />
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      </Animated.View>
    ));
  };

  return (
    <>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <GradientBackground safeAreaEdges={['bottom']}>
        <DominoPattern variant="setup" opacity={0.05} />
        
        <ResponsiveContainer>
          <ScrollView 
            style={styles.container}
            contentContainerStyle={[
              styles.content,
              { 
                padding: getResponsiveSpacing(SPACING.lg),
                paddingTop: isTablet ? getResponsiveSpacing(SPACING.xl * 3) : getResponsiveSpacing(SPACING.lg)
              }
            ]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.titleContainer}>
              <Text style={[
                styles.title,
                isDark && styles.titleDark,
                { fontSize: getResponsiveFontSize(32) }
              ]}>
                {t.gameSetup.title}
              </Text>
            </View>

            <View style={[
              styles.modeToggle,
              isDark && styles.modeToggleDark
            ]}>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  gameMode === 'teams' && styles.modeButtonActive,
                  gameMode === 'teams' && isDark && styles.modeButtonActiveDark,
                ]}
                onPress={() => setGameMode('teams')}
              >
                <Icon
                  name="account-group"
                  size={24}
                  color={gameMode === 'teams' ? COLORS.white : (isDark ? COLORS.text.dark.primary : COLORS.primary)}
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    isDark && gameMode !== 'teams' && styles.modeButtonTextDark,
                    gameMode === 'teams' && styles.modeButtonTextActive,
                  ]}
                >
                  {t.settings.teams}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modeButton,
                  gameMode === 'players' && styles.modeButtonActive,
                  gameMode === 'players' && isDark && styles.modeButtonActiveDark,
                ]}
                onPress={() => setGameMode('players')}
              >
                <Icon
                  name="account-multiple"
                  size={24}
                  color={gameMode === 'players' ? COLORS.white : (isDark ? COLORS.text.dark.primary : COLORS.primary)}
                />
                <Text
                  style={[
                    styles.modeButtonText,
                    isDark && gameMode !== 'players' && styles.modeButtonTextDark,
                    gameMode === 'players' && styles.modeButtonTextActive,
                  ]}
                >
                  {t.settings.players}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                isDark && styles.sectionTitleDark
              ]}>{gameMode === 'teams' ? t.gameSetup.teamNames : t.gameSetup.playerNames}</Text>
              <View style={styles.inputsContainer}>
                {renderNameInputs()}
                {gameMode === 'players' && playerNames.length < 6 && (
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                      const newNames = [
                        ...playerNames,
                        `${t.settings.player} ${playerNames.length + 1}`,
                      ];
                      setPlayerNames(newNames);
                    }}
                  >
                    <Icon name="plus" size={24} color={COLORS.white} />
                    <Text style={styles.addButtonText}>{t.gameSetup.addPlayer}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={[
                styles.sectionTitle,
                isDark && styles.sectionTitleDark
              ]}>{t.gameSetup.targetScore}</Text>
              <View style={styles.commonScores}>
                {[200, 300, 400].map((score) => (
                  <TouchableOpacity
                    key={score}
                    style={[
                      styles.scoreButton,
                      isDark && styles.scoreButtonDark,
                      targetScore === score && styles.scoreButtonActive,
                      targetScore === score && isDark && styles.scoreButtonActiveDark,
                    ]}
                    onPress={() => handleScoreChange(score)}
                  >
                    <Text style={[
                      styles.scoreButtonText,
                      isDark && styles.scoreButtonTextDark,
                      targetScore === score && styles.scoreButtonTextActive,
                    ]}>
                      {score}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              {hasGameInProgress ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.newGameButton,
                      isDark && styles.newGameButtonDark
                    ]}
                    onPress={startNewGame}
                  >
                    <Text style={styles.buttonText}>{t.gameSetup.newGame}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.continueButton,
                      isDark && styles.continueButtonDark
                    ]}
                    onPress={continueGame}
                  >
                    <Text style={styles.buttonText}>{t.gameSetup.continueGame}</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.startButton,
                    isDark && styles.startButtonDark
                  ]}
                  onPress={startNewGame}
                >
                  <Text style={styles.startButtonText}>{t.gameSetup.startGame}</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </ResponsiveContainer>

        <View style={[
          styles.headerButtons,
          {
            top: Platform.select({
              ios: SPACING.xl * 2,
              android: (StatusBar.currentHeight || 0) + SPACING.xl,
            }),
            right: getResponsiveSpacing(SPACING.lg),
            gap: getResponsiveSpacing(SPACING.sm),
          }
        ]}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark && styles.iconButtonDark,
              { padding: getResponsiveSpacing(SPACING.sm) }
            ]}
            onPress={() => navigation.navigate('Settings')}
          >
            <Icon name="cog" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark && styles.iconButtonDark,
              { padding: getResponsiveSpacing(SPACING.sm) }
            ]}
            onPress={() => navigation.navigate('GameHistory')}
          >
            <Icon name="history" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark && styles.iconButtonDark,
              { padding: getResponsiveSpacing(SPACING.sm) }
            ]}
            onPress={handleOpenShareModal}
          >
            <Icon name="share-variant" size={24} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
            {showShareDot && (
              <View style={styles.redDot} />
            )}
          </TouchableOpacity>
        </View>
        <Modal
          visible={shareModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setShareModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setShareModalVisible(false)}>
            <View style={[styles.shareModal, isDark && styles.shareModalDark]}>
              <Text style={[styles.shareTitle, isDark && styles.shareTitleDark]}>{t.gameSetup.shareTitle}</Text>
              <View style={styles.shareOptionsRow}>
                <TouchableOpacity
                  style={[styles.shareOption, isDark && styles.shareOptionDark]}
                  onPress={() => handleShare(GOOGLE_PLAY_LINK)}
                >
                  <View style={styles.shareOptionLabelContainer}>
                    <Text style={[styles.shareOptionOsLabel, isDark && styles.shareOptionOsLabelDark]}>{t.gameSetup.shareAndroid}</Text>
                    <View style={styles.shareOptionContentColumn}>
                      <Icon name="google-play" size={24} color={COLORS.primary} style={{ marginBottom: 4 }} />
                      <Text style={[styles.shareOptionText, isDark && styles.shareOptionTextDark]}>{t.gameSetup.shareGooglePlay}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.shareOption, isDark && styles.shareOptionDark]}
                  onPress={() => handleShare(APP_STORE_LINK)}
                >
                  <View style={styles.shareOptionLabelContainer}>
                    <Text style={[styles.shareOptionOsLabel, isDark && styles.shareOptionOsLabelDark]}>{t.gameSetup.shareIOS}</Text>
                    <View style={styles.shareOptionContentColumn}>
                      <Icon name="apple" size={24} color={COLORS.primary} style={{ marginBottom: 4 }} />
                      <Text style={[styles.shareOptionText, isDark && styles.shareOptionTextDark]}>{t.gameSetup.shareAppStore}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </Pressable>
        </Modal>
      </GradientBackground>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  content: {
    flexGrow: 1,
  },
  titleContainer: {
    paddingTop: Platform.select({
      ios: SPACING.xl,
      android: SPACING.xl * 2,
    }),
    paddingHorizontal: Platform.select({
      ios: SPACING.xl,
      android: SPACING.xl * 2,
    }),
    marginBottom: SPACING.xl,
  },
  title: {
    ...FONTS.title,
    textAlign: 'center',
    color: COLORS.primary,
    opacity: 1,
  },
  titleDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.medium,
    fontSize: 18,
    color: COLORS.text.secondary,
    marginBottom: SPACING.md,
    opacity: 1,
  },
  sectionTitleDark: {
    color: COLORS.text.dark.secondary,
    opacity: 1,
  },
  modeToggle: {
    flexDirection: 'row',
    backgroundColor: Platform.select({
      ios: COLORS.white + '30',
      android: 'rgba(255, 255, 255, 0.3)',
    }),
    borderRadius: 12,
    padding: SPACING.xs,
    marginBottom: SPACING.xl,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  modeToggleDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.3)',
      android: 'rgba(45, 55, 72, 0.4)',
    }),
    overflow: 'hidden',
  },
  modeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonActiveDark: {
    backgroundColor: COLORS.secondary,
  },
  modeButtonText: {
    ...FONTS.medium,
    color: COLORS.primary,
    fontSize: 16,
    opacity: 1,
  },
  modeButtonTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  modeButtonTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  inputsContainer: {
    gap: SPACING.md,
  },
  inputWrapper: {
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  inputWrapperDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  input: {
    ...FONTS.regular,
    fontSize: 16,
    padding: SPACING.md,
    color: COLORS.text.primary,
    flex: 1,
    opacity: 1,
  },
  inputDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  inputWithButton: {
    flex: 1,
    marginRight: -8, // To account for the button padding
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 8,
    gap: SPACING.sm,
  },
  addButtonText: {
    ...FONTS.medium,
    color: COLORS.white,
    fontSize: 16,
    opacity: 1,
  },
  scoreButton: {
    flex: 1,
    backgroundColor: Platform.select({
      ios: COLORS.white + '20',
      android: 'rgba(255, 255, 255, 0.2)',
    }),
    padding: SPACING.lg,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 80,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  scoreButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.2)',
      android: 'rgba(45, 55, 72, 0.3)',
    }),
    overflow: 'hidden',
  },
  scoreButtonActive: {
    backgroundColor: COLORS.primary,
    ...SHADOWS.medium,
  },
  scoreButtonActiveDark: {
    backgroundColor: COLORS.secondary,
  },
  scoreButtonText: {
    ...FONTS.bold,
    fontSize: 28,
    color: COLORS.primary,
    opacity: 1,
  },
  scoreButtonTextDark: {
    color: COLORS.text.dark.primary,
    opacity: 1,
  },
  scoreButtonTextActive: {
    color: COLORS.white,
    opacity: 1,
  },
  commonScores: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: SPACING.md,
  },
  startButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: SPACING.md,
    ...SHADOWS.medium,
  },
  startButtonDark: {
    backgroundColor: COLORS.secondary,
  },
  startButtonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
    opacity: 1,
  },
  buttonContainer: {
    marginTop: 'auto',
    marginBottom: SPACING.md,
    gap: SPACING.md,
  },
  newGameButton: {
    backgroundColor: COLORS.secondary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  newGameButtonDark: {
    backgroundColor: COLORS.secondary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    padding: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
    ...SHADOWS.medium,
  },
  continueButtonDark: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...FONTS.bold,
    color: COLORS.white,
    fontSize: 18,
    opacity: 1,
  },
  headerButtons: {
    position: 'absolute',
    flexDirection: 'row',
    zIndex: 10,
  },
  iconButton: {
    backgroundColor: Platform.select({
      ios: COLORS.white + '30',
      android: 'rgba(255, 255, 255, 0.3)',
    }),
    borderRadius: 8,
    overflow: 'hidden',
    shadowColor: SHADOWS.small.shadowColor,
    shadowOffset: SHADOWS.small.shadowOffset,
    shadowOpacity: SHADOWS.small.shadowOpacity,
    shadowRadius: SHADOWS.small.shadowRadius,
    elevation: Platform.OS === 'ios' ? SHADOWS.small.elevation : 0,
  },
  iconButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.3)',
      android: 'rgba(45, 55, 72, 0.4)',
    }),
    overflow: 'hidden',
  },
  inputIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: SPACING.sm,
  },
  editIcon: {
    opacity: 0.6,
    marginRight: SPACING.xs,
  },
  removeButton: {
    padding: SPACING.sm,
    marginLeft: SPACING.xs,
  },
  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'red',
    zIndex: 20,
    borderWidth: 1,
    borderColor: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareModal: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    minWidth: 260,
    elevation: 5,
  },
  shareModalDark: {
    backgroundColor: '#23283a',
  },
  shareTitle: {
    ...FONTS.bold,
    fontSize: 18,
    marginBottom: 16,
    color: COLORS.primary,
  },
  shareTitleDark: {
    color: COLORS.text.dark.primary,
  },
  shareOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    gap: 12,
  },
  shareOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: COLORS.white + '80',
    minWidth: 120,
    marginBottom: 0,
  },
  shareOptionDark: {
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
  },
  shareOptionText: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.primary,
  },
  shareOptionTextDark: {
    color: COLORS.text.dark.primary,
  },
  shareOptionLabelContainer: {
    alignItems: 'center',
    width: '100%',
  },
  shareOptionOsLabel: {
    fontSize: 15,
    color: COLORS.text.secondary,
    marginBottom: 2,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  shareOptionOsLabelDark: {
    color: COLORS.text.dark.secondary,
  },
  shareOptionContentColumn: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 