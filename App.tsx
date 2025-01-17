/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import { AppRegistry } from 'react-native';

import { SplashScreen as CustomSplashScreen } from './src/components/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import GameSetupScreen from './src/screens/GameSetupScreen';
import GamePlayScreen from './src/screens/GamePlayScreen';
import GameOverScreen from './src/screens/GameOverScreen';
import { RootStackParamList } from './src/navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

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
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
            gestureEnabled: true,
            gestureDirection: 'horizontal',
          }}
        >
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{
              animationTypeForReplace: 'pop',
            }}
          />
          <Stack.Screen 
            name="GameSetup" 
            component={GameSetupScreen}
          />
          <Stack.Screen 
            name="GamePlay" 
            component={GamePlayScreen}
          />
          <Stack.Screen 
            name="GameOver" 
            component={GameOverScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent('apntaloreact', () => App);

export default App;
