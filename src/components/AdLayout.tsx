import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';

interface AdLayoutProps {
  children: React.ReactNode;
}

export const AdLayout: React.FC<AdLayoutProps> = ({ children }) => {
  const route = useRoute();
  
  // No longer needed for ads, but keeping the component structure
  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {children}
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
}); 