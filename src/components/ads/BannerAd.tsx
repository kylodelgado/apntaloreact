import React from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AppodealBanner } from 'react-native-appodeal';
import { AD_UNIT_IDS, USE_APPODEAL } from '../../config/ads';

interface Props {
  size?: BannerAdSize;
}

const { width: screenWidth } = Dimensions.get('window');

export const BannerAd: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  // If Appodeal is enabled, use Appodeal banner ad
  if (USE_APPODEAL && Platform.OS === 'android') {
    return (
      <View style={styles.container}>
        <AppodealBanner
          adSize="phone" // 320x50 banner
          style={styles.appodealBanner}
          onAdLoaded={() => console.log('AppodealBanner loaded')}
          onAdFailedToLoad={() => console.log('AppodealBanner failed to load')}
          onAdClicked={() => console.log('AppodealBanner clicked')}
          onAdExpired={() => console.log('AppodealBanner expired')}
        />
      </View>
    );
  }

  // Otherwise, use AdMob banner ad (fallback)
  if (!AD_UNIT_IDS.BANNER) return null;

  return (
    <View style={styles.container}>
      <RNBannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={() => console.log('AdMob Banner loaded')}
        onAdFailedToLoad={(error) => console.log('AdMob Banner failed to load:', error)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    flex: 0,
    paddingBottom: Platform.select({
      android: 15, // Add padding for navigation pill area
      ios: 0,
    }),
  },
  appodealBanner: {
    height: 50, // Standard banner height
    width: screenWidth,
    backgroundColor: 'transparent',
  },
}); 