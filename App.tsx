/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { AppRegistry, Animated, Platform } from 'react-native';
import mobileAds from 'react-native-google-mobile-ads';

import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import AppNavigator from './src/navigation/AppNavigator';
import { TranslationProvider } from './src/translations/TranslationContext';
import { COLORS } from './src/styles/theme';

// Initialize AdMob
mobileAds()
  .initialize()
  .then(adapterStatuses => {
    // Mobile Ads SDK is initialized
    console.log('AdMob Initialized');
  });

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hide the native splash screen
    SplashScreen.hide();
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
          backgroundColor: COLORS.background.light,
        }}
      >
        <TranslationProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </SafeAreaProvider>
        </TranslationProvider>
      </Animated.View>
    </>
  );
}

AppRegistry.registerComponent('apntaloreact', () => App);

export default App;
