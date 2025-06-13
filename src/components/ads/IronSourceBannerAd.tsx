import React, { useCallback } from 'react';
import { StyleSheet, View, Platform, Dimensions, LayoutChangeEvent } from 'react-native';
import {
  LevelPlayBannerAdView,
  LevelPlayAdSize,
} from 'ironsource-mediation';
import {
  IronSourceConfig,
  createBannerAdListener,
  getBannerAdSize,
} from '../../services/IronSourceService';

interface Props {
  size?: LevelPlayAdSize;
}

export const IronSourceBannerAd: React.FC<Props> = ({ size = getBannerAdSize() }) => {
  // Load ad when the component is laid out
  const loadAd = useCallback(() => {
    console.log('Loading IronSource banner ad');
    // The banner ad will load automatically when rendered
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.adWrapper}>
          <LevelPlayBannerAdView
            adUnitId={IronSourceConfig.BANNER}
            adSize={size}
            placementName="DefaultBanner"
            listener={createBannerAdListener()}
            style={{
              width: size.width,
              height: size.height,
              alignSelf: 'center',
            }}
            onLayout={(_: LayoutChangeEvent) => loadAd()}
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