import { Platform } from 'react-native';

// Ad network selection - you can switch between networks
export const USE_APPODEAL = true; // Set to false to use AdMob instead

// Test IDs for development
const TEST_IDS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
};

// Production IDs
const PRODUCTION_IDS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-5105447899809010/5030988911',
    android: 'ca-app-pub-5105447899809010/8843075568',
  }),
};

// Appodeal IDs
export const APPODEAL_IDS = {
  APP_KEY: Platform.select({
    ios: '', // Add iOS app key when available
    android: '99a802ce1c066bc3daa13a82969c9af983bc7ddd5f4909e2',
  }),
};

// Use test IDs in development and production IDs in release
export const AD_UNIT_IDS = __DEV__ ? TEST_IDS : PRODUCTION_IDS; 