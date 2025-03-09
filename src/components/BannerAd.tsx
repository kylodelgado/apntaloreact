import React, { useState } from 'react';
import { Platform } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize, TestIds } from 'react-native-google-mobile-ads';

const adUnitIds = {
  ios: 'ca-app-pub-5105447899809010/5030988911',
  android: 'ca-app-pub-5105447899809010/8843075568',
  // Use test IDs for development
  iosTest: TestIds.BANNER,
  androidTest: TestIds.BANNER,
};

interface BannerAdProps {
  useTestId?: boolean;
}

export const BannerAd: React.FC<BannerAdProps> = ({ useTestId = __DEV__ }) => {
  const [error, setError] = useState<string | null>(null);

  const adUnitId = Platform.select({
    ios: useTestId ? adUnitIds.iosTest : adUnitIds.ios,
    android: useTestId ? adUnitIds.androidTest : adUnitIds.android,
    default: TestIds.BANNER,
  });

  if (error) {
    console.warn('Ad Error:', error);
    return null;
  }

  return (
    <RNBannerAd
      unitId={adUnitId}
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdFailedToLoad={(error) => {
        setError(error.message);
        console.warn('Ad failed to load:', error);
      }}
    />
  );
}; 