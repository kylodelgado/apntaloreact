import React from 'react';
import { View, StyleSheet, Platform, Dimensions } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { BannerAd } from './ads/BannerAd';

interface AdLayoutProps {
  children: React.ReactNode;
}

const { width: screenWidth } = Dimensions.get('window');

export const AdLayout: React.FC<AdLayoutProps> = ({ children }) => {
  const route = useRoute();
  
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      <View style={styles.bannerContainer}>
        <BannerAd />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  bannerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: screenWidth,
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
}); 