import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BannerAd } from './BannerAd';
import { useRoute } from '@react-navigation/native';

interface AdLayoutProps {
  children: React.ReactNode;
}

export const AdLayout: React.FC<AdLayoutProps> = ({ children }) => {
  const route = useRoute();
  
  // Don't show ads on the splash screen
  const shouldShowAd = route.name !== 'Splash';

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
      </View>
      {shouldShowAd && <BannerAd />}
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
}); 