import { Platform } from 'react-native';

// Toggle between ad providers
export const USE_IRONSOURCE = true;

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

// IronSource IDs
export const IRONSOURCE_IDS = {
  APP_KEY: '2260b5485',
  BANNER: 'l5qm716vok36zdve',
};

// Use test IDs in development and production IDs in release
export const AD_UNIT_IDS = __DEV__ ? TEST_IDS : PRODUCTION_IDS; 