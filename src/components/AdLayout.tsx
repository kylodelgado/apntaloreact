import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BannerAd } from './ads/BannerAd';

interface AdLayoutProps {
  children: React.ReactNode;
}

export const AdLayout: React.FC<AdLayoutProps> = ({ children }) => {
  const route = useRoute();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.adContainer}>
        <BannerAd />
      </View>
      <View style={styles.bottomPadding} />
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
    width: '100%',
    backgroundColor: 'transparent',
    paddingBottom: 8,
  },
  bottomPadding: {
    height: Platform.select({ ios: 20, android: 12 }),
  },
}); 