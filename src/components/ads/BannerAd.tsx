import React from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AD_UNIT_IDS } from '../../config/ads';

interface Props {
  size?: BannerAdSize;
}

export const BannerAd: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  if (!AD_UNIT_IDS.BANNER) return null;

  return (
    <View style={styles.container}>
      <RNBannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
      />
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