import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../styles/theme';
import GameSetupScreen from '../screens/GameSetupScreen';
import GamePlayScreen from '../screens/GamePlayScreen';
import GameOverScreen from '../screens/GameOverScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameHistoryScreen from '../screens/GameHistoryScreen';
import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: COLORS.background.light },
};

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="GameSetup">
      <Stack.Screen name="GameSetup" component={GameSetupScreen} />
      <Stack.Screen name="GamePlay" component={GamePlayScreen} />
      <Stack.Screen name="GameOver" component={GameOverScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="GameHistory" component={GameHistoryScreen} />
    </Stack.Navigator>
  );
} 