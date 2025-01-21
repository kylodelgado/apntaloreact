/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { AppRegistry } from 'react-native';

import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import { AppNavigator } from './src/navigation/AppNavigator';
import { TranslationProvider } from './src/translations/TranslationContext';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Hide the native splash screen
    SplashScreen.hide();

    // Show our custom splash screen for 2 seconds
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <CustomSplashScreen />;
  }

  return (
    <TranslationProvider>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </SafeAreaProvider>
    </TranslationProvider>
  );
}

AppRegistry.registerComponent('apntaloreact', () => App);

export default App;
