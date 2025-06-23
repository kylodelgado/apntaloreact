import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BannerAd } from './ads/BannerAd';

interface AdLayoutProps {
  children: React.ReactNode;
}

export const AdLayout: React.FC<AdLayoutProps> = ({ children }) => {
  const route = useRoute();
  const insets = useSafeAreaInsets();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={[
        styles.adContainer,
        {
          paddingBottom: Math.max(insets.bottom, 0),
        }
      ]}>
        <BannerAd />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  adContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
}); 