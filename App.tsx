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

import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { TranslationProvider } from './src/translations/TranslationContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { useTheme } from './src/context/ThemeContext';
import { COLORS } from './src/styles/theme';
import { initIronSource } from './src/services/IronSourceService';
import { USE_IRONSOURCE } from './src/config/ads';

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
    const initializeApp = async () => {
      // Initialize mobile ads
      await mobileAds().initialize();
      console.log('Mobile Ads initialized');

      // Initialize IronSource if enabled
      if (USE_IRONSOURCE && Platform.OS === 'ios') {
        const success = await initIronSource();
        console.log('IronSource initialization:', success ? 'success' : 'failed');
      }

      // Hide the native splash screen
      SplashScreen.hide();
      
      // Set loading to false after initialization
      setIsLoading(false);
    };

    initializeApp();
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
