import React, { useRef, useCallback, useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { 
  LevelPlayBannerAdView, 
  LevelPlayAdSize, 
  LevelPlayBannerAdViewListener,
  LevelPlayBannerAdViewMethods,
  LevelPlayAdInfo,
  LevelPlayAdError
} from 'ironsource-mediation';
import { 
  Appodeal,
  AppodealAdType,
  AppodealBannerEvent,
  AppodealBanner
} from 'react-native-appodeal';
import { 
  AdProvider, 
  CURRENT_AD_PROVIDER, 
  ADMOB_AD_UNIT_IDS, 
  IRONSOURCE_CONFIG,
  APPODEAL_CONFIG
} from '../../config/ads';

interface Props {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  const bannerAdViewRef = useRef<LevelPlayBannerAdViewMethods>(null);
  const [isAdLoaded, setIsAdLoaded] = useState(false);

  // Appodeal Banner Event Listeners
  useEffect(() => {
    if (CURRENT_AD_PROVIDER === AdProvider.APPODEAL) {
      const onBannerLoaded = () => {
        console.log('Appodeal Banner loaded');
        setIsAdLoaded(true);
      };

      const onBannerFailedToLoad = () => {
        console.log('Appodeal Banner failed to load');
        setIsAdLoaded(false);
      };

      const onBannerShown = () => {
        console.log('Appodeal Banner shown');
      };

      const onBannerClicked = () => {
        console.log('Appodeal Banner clicked');
      };

      const onBannerExpired = () => {
        console.log('Appodeal Banner expired');
        setIsAdLoaded(false);
      };

      // Add Appodeal banner event listeners
      Appodeal.addEventListener(AppodealBannerEvent.LOADED, onBannerLoaded);
      Appodeal.addEventListener(AppodealBannerEvent.FAILED_TO_LOAD, onBannerFailedToLoad);
      Appodeal.addEventListener(AppodealBannerEvent.SHOWN, onBannerShown);
      Appodeal.addEventListener(AppodealBannerEvent.CLICKED, onBannerClicked);
      Appodeal.addEventListener(AppodealBannerEvent.EXPIRED, onBannerExpired);

      // Cleanup function
      return () => {
        Appodeal.removeEventListener(AppodealBannerEvent.LOADED, onBannerLoaded);
        Appodeal.removeEventListener(AppodealBannerEvent.FAILED_TO_LOAD, onBannerFailedToLoad);
        Appodeal.removeEventListener(AppodealBannerEvent.SHOWN, onBannerShown);
        Appodeal.removeEventListener(AppodealBannerEvent.CLICKED, onBannerClicked);
        Appodeal.removeEventListener(AppodealBannerEvent.EXPIRED, onBannerExpired);
      };
    }
  }, []);

  // IronSource Banner Ad Listener
  const ironSourceListener: LevelPlayBannerAdViewListener = {
    onAdLoaded: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner loaded:', adInfo);
      setIsAdLoaded(true);
    },
    onAdLoadFailed: (error: LevelPlayAdError) => {
      console.log('IronSource Banner load failed:', error);
      setIsAdLoaded(false);
    },
    onAdDisplayed: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner displayed:', adInfo);
    },
    onAdDisplayFailed: (adInfo: LevelPlayAdInfo, error: LevelPlayAdError) => {
      console.log('IronSource Banner display failed:', error);
      setIsAdLoaded(false);
    },
    onAdClicked: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner clicked:', adInfo);
    },
    onAdExpanded: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner expanded:', adInfo);
    },
    onAdCollapsed: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner collapsed:', adInfo);
    },
    onAdLeftApplication: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner left application:', adInfo);
    },
  };

  // Load IronSource ad
  const loadIronSourceAd = useCallback(() => {
    bannerAdViewRef.current?.loadAd();
  }, []);

  // Render Google AdMob Banner
  const renderAdMobBanner = () => {
    if (!ADMOB_AD_UNIT_IDS.BANNER) return null;

    return (
      <RNBannerAd
        unitId={ADMOB_AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
    );
  };

  // Render IronSource Banner
  const renderIronSourceBanner = () => {
    const adSize = LevelPlayAdSize.BANNER;
    
    return (
      <LevelPlayBannerAdView
        ref={bannerAdViewRef}
        adUnitId={IRONSOURCE_CONFIG.BANNER_AD_UNIT_ID}
        adSize={adSize}
        placementName={IRONSOURCE_CONFIG.PLACEMENT_NAME}
        listener={ironSourceListener}
        style={{
          width: '100%',
          height: adSize.height,
        }}
        onLayout={loadIronSourceAd}
      />
    );
  };

  // Render Appodeal Banner
  const renderAppodealBanner = () => {
    return (
      <AppodealBanner
        adSize="phone" // 320x50 banner
        style={{
          width: '100%',
          height: 50,
          backgroundColor: 'transparent',
        }}
        onAdLoaded={() => {
          console.log('AppodealBanner loaded');
          setIsAdLoaded(true);
        }}
        onAdFailedToLoad={() => {
          console.log('AppodealBanner failed to load');
          setIsAdLoaded(false);
        }}
        onAdClicked={() => {
          console.log('AppodealBanner clicked');
        }}
        onAdExpired={() => {
          console.log('AppodealBanner expired');
          setIsAdLoaded(false);
        }}
      />
    );
  };

  // Render based on current provider
  const renderBanner = () => {
    switch (CURRENT_AD_PROVIDER) {
      case AdProvider.APPODEAL:
        return renderAppodealBanner();
      case AdProvider.IRONSOURCE:
        return renderIronSourceBanner();
      case AdProvider.GOOGLE_ADMOB:
      default:
        return renderAdMobBanner();
    }
  };

  return (
    <View style={styles.container}>
      {renderBanner()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    backgroundColor: 'transparent',
  },
}); 