import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import HomeScreen from '../screens/HomeScreen';
import GameSetupScreen from '../screens/GameSetupScreen';
import GamePlayScreen from '../screens/GamePlayScreen';
import GameOverScreen from '../screens/GameOverScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export type ScreenProps = NativeStackScreenProps<RootStackParamList>;

export function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
          gestureDirection: 'horizontal',
          animation: 'slide_from_right',
          presentation: 'card',
        }}
      >
        <Stack.Screen 
          name="Home" 
          component={HomeScreen}
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
  );
} 