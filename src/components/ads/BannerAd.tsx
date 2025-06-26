import React, { useState, useCallback, memo, useEffect, useRef } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { BannerAd as RNBannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { AppodealBanner } from 'react-native-appodeal';
import { AD_UNIT_IDS, USE_APPODEAL } from '../../config/ads';

interface Props {
  size?: BannerAdSize;
}

const { width: screenWidth } = Dimensions.get('window');

const BannerAdComponent: React.FC<Props> = ({ size = BannerAdSize.ANCHORED_ADAPTIVE_BANNER }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const handleAdLoaded = useCallback(() => {
    if (!mountedRef.current) return;
    setIsLoaded(true);
    setHasError(false);
    setIsInitialized(true);
    console.log('Banner ad loaded successfully');
  }, []);

  const handleAdFailedToLoad = useCallback((error?: any) => {
    if (!mountedRef.current) return;
    setIsLoaded(false);
    setHasError(true);
    setIsInitialized(true);
    console.log('Banner ad failed to load:', error);
  }, []);

  const handleAdClicked = useCallback(() => {
    console.log('Banner ad clicked');
  }, []);

  const handleAdExpired = useCallback(() => {
    if (!mountedRef.current) return;
    setIsLoaded(false);
    console.log('Banner ad expired');
  }, []);

  // If Appodeal is enabled, use Appodeal banner ad
  if (USE_APPODEAL && Platform.OS === 'android') {
    return (
      <View style={[
        styles.container, 
        !isLoaded && styles.containerLoading,
        !isInitialized && styles.containerInitializing
      ]}>
        <AppodealBanner
          adSize="phone" // 320x50 banner
          style={styles.appodealBanner}
          onAdLoaded={handleAdLoaded}
          onAdFailedToLoad={handleAdFailedToLoad}
          onAdClicked={handleAdClicked}
          onAdExpired={handleAdExpired}
        />
      </View>
    );
  }

  // Otherwise, use AdMob banner ad (fallback)
  if (!AD_UNIT_IDS.BANNER) return null;

  return (
    <View style={[
      styles.container, 
      !isLoaded && styles.containerLoading,
      !isInitialized && styles.containerInitializing
    ]}>
      <RNBannerAd
        unitId={AD_UNIT_IDS.BANNER}
        size={size}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdLoaded={handleAdLoaded}
        onAdFailedToLoad={handleAdFailedToLoad}
      />
    </View>
  );
};

// Memoize the component to prevent unnecessary re-renders
export const BannerAd = memo(BannerAdComponent);

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
    minHeight: 50, // Ensure consistent height even when loading
  },
  containerLoading: {
    opacity: 0.8, // Slightly fade while loading to reduce blinking
  },
  containerInitializing: {
    opacity: 0.3, // More fade during initial load
  },
  appodealBanner: {
    height: 50, // Standard banner height
    width: screenWidth,
    backgroundColor: 'transparent',
  },
}); 