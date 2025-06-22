import { Platform } from 'react-native';

// Ad provider types
export enum AdProvider {
  GOOGLE_ADMOB = 'google_admob',
  IRONSOURCE = 'ironsource',
  APPODEAL = 'appodeal'
}

// Current ad provider - toggle this to switch between providers
export const CURRENT_AD_PROVIDER: AdProvider = AdProvider.APPODEAL;

// Google AdMob Configuration
const ADMOB_TEST_IDS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-3940256099942544/2934735716',
    android: 'ca-app-pub-3940256099942544/6300978111',
  }),
};

const ADMOB_PRODUCTION_IDS = {
  BANNER: Platform.select({
    ios: 'ca-app-pub-5105447899809010/5030988911',
    android: 'ca-app-pub-5105447899809010/8843075568',
  }),
};

export const ADMOB_AD_UNIT_IDS = __DEV__ ? ADMOB_TEST_IDS : ADMOB_PRODUCTION_IDS;

// IronSource LevelPlay Configuration
export const IRONSOURCE_CONFIG = {
  APP_ID: '2260b5485',
  BANNER_AD_UNIT_ID: 'l5qm716vok36zdve',
  PLACEMENT_NAME: 'DefaultBanner',
};

// Appodeal Configuration
export const APPODEAL_CONFIG = {
  APP_KEY: '99d1e968532806a1924cae1ce23246abbe6bb691481c7018',
  // Test mode - set to false for production
  TEST_MODE: __DEV__,
  // Log level for debugging
  LOG_LEVEL: __DEV__ ? 'verbose' : 'none',
  // Enable autocache for better performance
  AUTOCACHE: true,
  // Consent settings
  CONSENT: {
    GDPR_ENABLED: true,
    CCPA_ENABLED: true,
  },
};

// Legacy export for backward compatibility
export const AD_UNIT_IDS = ADMOB_AD_UNIT_IDS; 