import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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

const Stack = createNativeStackNavigator<RootStackParamList>();

const screenOptions = {
  headerShown: false,
  contentStyle: { backgroundColor: COLORS.background.light },
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
  return (
    <Stack.Navigator screenOptions={screenOptions} initialRouteName="GameSetup">
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