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
      <BannerAd />
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
    marginBottom: Platform.select({ ios: 50, android: 56 }), // Reduced margin to account for the negative margin in BannerAd
  },
}); 