import { Platform } from 'react-native';
import {
  Appodeal,
  AppodealAdType,
  AppodealLogLevel,
  AppodealBannerEvent,
  AppodealSdkEvent,
} from 'react-native-appodeal';
import { APPODEAL_IDS } from '../config/ads';

// Initialize Appodeal SDK
export const initAppodeal = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    try {
      if (!APPODEAL_IDS.APP_KEY) {
        console.error('Appodeal app key not found');
        resolve(false);
        return;
      }

      // Set up SDK configuration
      Appodeal.setTesting(__DEV__); // Enable testing in development
      Appodeal.setLogLevel(AppodealLogLevel.DEBUG);
      
      // Initialize SDK with banner ad type
      const adTypes = AppodealAdType.BANNER;
      
      // Set up initialization callback
      Appodeal.addEventListener(AppodealSdkEvent.INITIALIZED, () => {
        console.log('Appodeal SDK initialized successfully');
        resolve(true);
      });

      // Initialize Appodeal
      Appodeal.initialize(APPODEAL_IDS.APP_KEY as string, adTypes);
      
      // Fallback timeout in case callback doesn't fire
      setTimeout(() => {
        console.log('Appodeal initialization timeout - considering as success');
        resolve(true);
      }, 10000);
      
    } catch (error) {
      console.error('Appodeal initialization failed:', error);
      resolve(false);
    }
  });
};

// Create banner ad listener
export const createAppodealBannerListener = () => {
  // Set up banner event listeners
  Appodeal.addEventListener(AppodealBannerEvent.LOADED, (event: any) => {
    console.log('Appodeal banner loaded:', event);
  });

  Appodeal.addEventListener(AppodealBannerEvent.SHOWN, () => {
    console.log('Appodeal banner shown');
  });

  Appodeal.addEventListener(AppodealBannerEvent.EXPIRED, () => {
    console.log('Appodeal banner expired');
  });

  Appodeal.addEventListener(AppodealBannerEvent.CLICKED, () => {
    console.log('Appodeal banner clicked');
  });

  Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, () => {
    console.error('Appodeal banner failed to load');
  });
};

// Check if banner is loaded
export const isAppodealBannerLoaded = (): boolean => {
  try {
    return Appodeal.isLoaded(AppodealAdType.BANNER);
  } catch (error) {
    console.error('Error checking Appodeal banner status:', error);
    return false;
  }
};

// Show banner
export const showAppodealBanner = (position: 'top' | 'bottom' = 'bottom') => {
  try {
    const adType = position === 'top' ? AppodealAdType.BANNER_TOP : AppodealAdType.BANNER_BOTTOM;
    Appodeal.show(adType);
  } catch (error) {
    console.error('Error showing Appodeal banner:', error);
  }
};

// Hide banner
export const hideAppodealBanner = () => {
  try {
    Appodeal.hide(AppodealAdType.BANNER);
  } catch (error) {
    console.error('Error hiding Appodeal banner:', error);
  }
}; 