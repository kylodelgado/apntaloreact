import React, { useEffect } from 'react';
import { StyleSheet, View, Platform, Dimensions } from 'react-native';
import { AppodealBanner } from 'react-native-appodeal';
import { createAppodealBannerListener } from '../../services/AppodealService';

interface Props {
  adSize?: 'phone' | 'tablet';
}

export const AppodealBannerAd: React.FC<Props> = ({ adSize = 'phone' }) => {
  useEffect(() => {
    // Set up banner listeners when component mounts
    createAppodealBannerListener();
  }, []);

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.adWrapper}>
          <AppodealBanner
            style={{
              height: adSize === 'tablet' ? 90 : 50,
              width: '100%',
              backgroundColor: 'transparent',
              alignContent: 'stretch',
            }}
            adSize={adSize as 'phone' | 'tablet'}
            usesSmartSizing={Platform.OS === 'ios'} // iOS specific
            onAdLoaded={() => console.log('Appodeal Banner view loaded')}
            onAdExpired={() => console.log('Appodeal Banner view expired')}
            onAdClicked={() => console.log('Appodeal Banner view clicked')}
            onAdFailedToLoad={() => console.log('Appodeal Banner view failed to load')}
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