import { Platform } from 'react-native';
import {
  LevelPlay,
  LevelPlayInitRequest,
  LevelPlayInitListener,
  AdFormat,
  LevelPlayConfiguration,
  LevelPlayInitError,
  LevelPlayBannerAdView,
  LevelPlayBannerAdViewListener,
  LevelPlayAdSize,
  LevelPlayAdInfo,
  LevelPlayAdError,
} from 'ironsource-mediation';
import { IRONSOURCE_IDS } from '../config/ads';

// Initialize IronSource LevelPlay
export const initIronSource = async (): Promise<boolean> => {
  return new Promise((resolve) => {
    const initListener: LevelPlayInitListener = {
      onInitSuccess: (configuration: LevelPlayConfiguration) => {
        console.log('IronSource initialized successfully:', configuration);
        resolve(true);
      },
      onInitFailed: (error: LevelPlayInitError) => {
        console.error('IronSource initialization failed:', error);
        resolve(false);
      },
    };

    // Initialize with banner format
    const initRequest: LevelPlayInitRequest = LevelPlayInitRequest.builder(IRONSOURCE_IDS.APP_KEY)
      .withLegacyAdFormats([AdFormat.BANNER])
      .build();

    LevelPlay.init(initRequest, initListener);
  });
};

// Banner ad listener
export const createBannerAdListener = (): LevelPlayBannerAdViewListener => {
  return {
    onAdLoaded: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad loaded:', adInfo);
    },
    onAdLoadFailed: (error: LevelPlayAdError) => {
      console.error('Banner ad failed to load:', error);
    },
    onAdClicked: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad clicked:', adInfo);
    },
    onAdScreenPresented: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad screen presented:', adInfo);
    },
    onAdScreenDismissed: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad screen dismissed:', adInfo);
    },
    onAdLeftApplication: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad left application:', adInfo);
    },
    onAdDisplayed: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad displayed:', adInfo);
    },
    onAdDisplayFailed: (adInfo: LevelPlayAdInfo, error: LevelPlayAdError) => {
      console.error('Banner ad display failed:', error);
    },
    onAdExpanded: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad expanded:', adInfo);
    },
    onAdCollapsed: (adInfo: LevelPlayAdInfo) => {
      console.log('Banner ad collapsed:', adInfo);
    },
  };
};

// Get banner ad size
export const getBannerAdSize = (): LevelPlayAdSize => {
  return LevelPlayAdSize.BANNER;
};

// Export constants for convenience
export const IronSourceConfig = IRONSOURCE_IDS; 