/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { AppRegistry, Animated, Platform, AppState } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';
import { 
  LevelPlay, 
  LevelPlayInitRequest, 
  LevelPlayInitListener, 
  LevelPlayInitError, 
  LevelPlayConfiguration,
  AdFormat 
} from 'ironsource-mediation';
import { 
  Appodeal,
  AppodealAdType,
  AppodealLogLevel
} from 'react-native-appodeal';

import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { TranslationProvider } from './src/translations/TranslationContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useTheme } from './src/context/ThemeContext';
import { COLORS } from './src/styles/theme';
import { AdProvider, CURRENT_AD_PROVIDER, IRONSOURCE_CONFIG, APPODEAL_CONFIG } from './src/config/ads';

const customLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: COLORS.background.light,
    text: COLORS.text.primary,
    border: COLORS.border,
    card: COLORS.card.light,
  },
};

const customDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: COLORS.background.dark,
    text: COLORS.text.dark.primary,
    border: COLORS.border,
    card: COLORS.card.dark,
  },
};

function AppContent() {
  const { isDark, isThemeReady } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const initializeAds = async () => {
      try {
        if (CURRENT_AD_PROVIDER === AdProvider.APPODEAL) {
          // Initialize Appodeal
          console.log('Initializing Appodeal SDK...');
          
          // Set log level for debugging
          if (APPODEAL_CONFIG.LOG_LEVEL === 'verbose') {
            Appodeal.setLogLevel(AppodealLogLevel.VERBOSE);
          } else if (APPODEAL_CONFIG.LOG_LEVEL === 'none') {
            Appodeal.setLogLevel(AppodealLogLevel.NONE);
          }

          // Set testing mode
          if (APPODEAL_CONFIG.TEST_MODE) {
            Appodeal.setTesting(true);
          }

          // Enable autocache if configured
          if (APPODEAL_CONFIG.AUTOCACHE) {
            Appodeal.setAutoCache(AppodealAdType.BANNER, true);
          }

          // Configure GDPR/CCPA if needed
          if (APPODEAL_CONFIG.CONSENT.GDPR_ENABLED) {
            // Note: In production, you should handle GDPR consent properly
            // This is just a basic implementation
            console.log('GDPR compliance enabled for Appodeal');
          }

          // Initialize Appodeal with banner ads
          const adTypes = AppodealAdType.BANNER;
          await Appodeal.initialize(APPODEAL_CONFIG.APP_KEY, adTypes);
          
          console.log('Appodeal SDK initialized successfully');
        } else if (CURRENT_AD_PROVIDER === AdProvider.IRONSOURCE) {
          // Initialize IronSource LevelPlay
          const initRequest: LevelPlayInitRequest = LevelPlayInitRequest.builder(IRONSOURCE_CONFIG.APP_ID)
            .withLegacyAdFormats([AdFormat.BANNER])
            .build();

          const initListener: LevelPlayInitListener = {
            onInitSuccess: (configuration: LevelPlayConfiguration) => {
              console.log('IronSource LevelPlay initialized successfully:', configuration);
            },
            onInitFailed: (error: LevelPlayInitError) => {
              console.error('IronSource LevelPlay initialization failed:', error);
            }
          };

          await LevelPlay.init(initRequest, initListener);
        } else {
          // Initialize Google Mobile Ads (fallback or when using AdMob)
          const adapterStatuses = await mobileAds().initialize();
          console.log('Google Mobile Ads initialized:', adapterStatuses);
        }
      } catch (error) {
        console.error('Ad initialization error:', error);
      }
    };

    initializeAds();

    // Hide the native splash screen
    SplashScreen.hide();
  }, []);

  // Add AppState listener to handle app background/foreground transitions
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // App has come to the foreground - handle any app-level state restoration here
        console.log('App has come to the foreground');
        // No need to reload or show loading indicators - React Native preserves state
      }
      
      // Update the AppState ref
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const handleSplashComplete = () => {
    // Start fading in the main app
    setIsLoading(false);
    Animated.sequence([
      // Small delay to ensure the splash screen fade out is nearly complete
      Animated.delay(200),
      // Then fade in the main content
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  };

  // Only render content when theme is ready
  if (!isThemeReady && !isLoading) {
    return null; // Return empty until theme is ready
  }

  return (
    <>
      {isLoading && (
        <CustomSplashScreen onAnimationComplete={handleSplashComplete} />
      )}
      <Animated.View 
        style={{ 
          flex: 1, 
          opacity: fadeAnim,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          backgroundColor: isDark ? COLORS.background.dark : COLORS.background.light,
        }}
      >
        <SafeAreaProvider>
          <NavigationContainer theme={isDark ? customDarkTheme : customLightTheme}>
            <AppNavigator />
          </NavigationContainer>
        </SafeAreaProvider>
      </Animated.View>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <TranslationProvider>
        <AppContent />
      </TranslationProvider>
    </ThemeProvider>
  );
}

AppRegistry.registerComponent('apntaloreact', () => App);

export default App;
