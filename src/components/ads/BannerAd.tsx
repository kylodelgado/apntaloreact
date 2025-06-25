import React from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS, USE_APPODEAL } from '../../config/ads';
import { AppodealBannerAd } from './AppodealBannerAd';

interface Props {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  // If Appodeal is enabled, use Appodeal banner ad
  if (USE_APPODEAL && Platform.OS === 'android') {
    return <AppodealBannerAd />;
  }

  // Otherwise, use AdMob banner ad (fallback)
  if (!AD_UNIT_IDS.BANNER) return null;

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.adWrapper}>
          <RNBannerAd
            unitId={AD_UNIT_IDS.BANNER}
            size={size}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    backgroundColor: 'transparent',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'hidden',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    paddingTop: Platform.select({ ios: 8, android: 4 }),
    paddingBottom: 0,
    marginBottom: -1,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOpacity: 0,
    shadowRadius: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  adWrapper: {
    width: Dimensions.get('window').width + 1,
    backgroundColor: 'transparent',
  }
}); 