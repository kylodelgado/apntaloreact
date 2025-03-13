import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DefaultTheme, DarkTheme } from '@react-navigation/native';
import { COLORS } from '../styles/theme';
import GameSetupScreen from '../screens/GameSetupScreen';
import GamePlayScreen from '../screens/GamePlayScreen';
import GameOverScreen from '../screens/GameOverScreen';
import SettingsScreen from '../screens/SettingsScreen';
import GameHistoryScreen from '../screens/GameHistoryScreen';
import PrivacyPolicyScreen from '../screens/PrivacyPolicyScreen';
import TermsOfServiceScreen from '../screens/TermsOfServiceScreen';
import AppStoreScreen from '../screens/AppStoreScreen';
import { RootStackParamList } from './types';
import { AdLayout } from '../components/AdLayout';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

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

// Wrap each screen component with AdLayout
const withAdLayout = (Component: React.ComponentType<any>) => {
  return (props: any) => (
    <AdLayout>
      <Component {...props} />
    </AdLayout>
  );
};

export default function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { 
          backgroundColor: isDark ? COLORS.background.dark : COLORS.background.light 
        },
      }}
    >
      <Stack.Screen
        name="GameSetup"
        component={withAdLayout(GameSetupScreen)}
      />
      <Stack.Screen
        name="GamePlay"
        component={withAdLayout(GamePlayScreen)}
      />
      <Stack.Screen
        name="GameOver"
        component={withAdLayout(GameOverScreen)}
      />
      <Stack.Screen
        name="Settings"
        component={withAdLayout(SettingsScreen)}
      />
      <Stack.Screen
        name="GameHistory"
        component={withAdLayout(GameHistoryScreen)}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={withAdLayout(PrivacyPolicyScreen)}
      />
      <Stack.Screen
        name="TermsOfService"
        component={withAdLayout(TermsOfServiceScreen)}
      />
      <Stack.Screen
        name="AppStore"
        component={withAdLayout(AppStoreScreen)}
      />
    </Stack.Navigator>
  );
} 