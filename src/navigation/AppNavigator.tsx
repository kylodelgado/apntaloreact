import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
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
import { BannerAd } from '../components/ads/BannerAd';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth } = Dimensions.get('window');
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

export default function AppNavigator() {
  const { isDark } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.navigatorContainer}>
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
          <Stack.Screen
            name="Settings"
            component={SettingsScreen}
          />
          <Stack.Screen
            name="GameHistory"
            component={GameHistoryScreen}
          />
          <Stack.Screen
            name="PrivacyPolicy"
            component={PrivacyPolicyScreen}
          />
          <Stack.Screen
            name="TermsOfService"
            component={TermsOfServiceScreen}
          />
          <Stack.Screen
            name="AppStore"
            component={AppStoreScreen}
          />
        </Stack.Navigator>
      </View>
      
      {/* Persistent banner ad that stays across all screens */}
      <View style={styles.bannerContainer}>
        <BannerAd key="global-persistent-banner" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  navigatorContainer: {
    flex: 1,
    position: 'relative',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: screenWidth,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
}); 