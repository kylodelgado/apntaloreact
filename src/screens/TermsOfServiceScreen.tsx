import React from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { GradientBackground } from '../components/GradientBackground';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen() {
  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <View style={styles.container}>
        <WebView 
          source={{ uri: 'https://aplicadom.com/terms-of-service' }}
          style={styles.webview}
        />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
}); 