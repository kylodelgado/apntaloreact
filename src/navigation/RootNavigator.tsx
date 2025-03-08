import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import GameSetupScreen from '../screens/GameSetupScreen';
import GamePlayScreen from '../screens/GamePlayScreen';
import GameOverScreen from '../screens/GameOverScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameHistoryScreen from '../screens/GameHistoryScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="GameSetup"
      >
        <Stack.Screen name="GameSetup" component={GameSetupScreen} />
        <Stack.Screen name="GamePlay" component={GamePlayScreen} />
        <Stack.Screen name="GameOver" component={GameOverScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="GameHistory" component={GameHistoryScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
} 