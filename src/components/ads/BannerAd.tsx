import React, { useRef, useCallback } from 'react';
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
  AdProvider, 
  CURRENT_AD_PROVIDER, 
  ADMOB_AD_UNIT_IDS, 
  IRONSOURCE_CONFIG 
} from '../../config/ads';

interface Props {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  const bannerAdViewRef = useRef<LevelPlayBannerAdViewMethods>(null);

  // IronSource Banner Ad Listener
  const ironSourceListener: LevelPlayBannerAdViewListener = {
    onAdLoaded: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner loaded:', adInfo);
    },
    onAdLoadFailed: (error: LevelPlayAdError) => {
      console.log('IronSource Banner load failed:', error);
    },
    onAdDisplayed: (adInfo: LevelPlayAdInfo) => {
      console.log('IronSource Banner displayed:', adInfo);
    },
    onAdDisplayFailed: (adInfo: LevelPlayAdInfo, error: LevelPlayAdError) => {
      console.log('IronSource Banner display failed:', error);
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
          width: adSize.width,
          height: adSize.height,
          alignSelf: 'center'
        }}
        onLayout={loadIronSourceAd}
      />
    );
  };

  // Render based on current provider
  const renderBanner = () => {
    switch (CURRENT_AD_PROVIDER) {
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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    marginTop: 8,
  },
}); 