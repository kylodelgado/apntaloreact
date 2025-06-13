import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { AdProvider, CURRENT_AD_PROVIDER } from '../../config/ads';

interface Props {
  onProviderChange?: (provider: AdProvider) => void;
}

export const AdProviderToggle: React.FC<Props> = ({ onProviderChange }) => {
  // This component is only for development/testing purposes
  if (!__DEV__) {
    return null;
  }

  const providers = [
    { key: AdProvider.IRONSOURCE, label: 'IronSource' },
    { key: AdProvider.GOOGLE_ADMOB, label: 'Google AdMob' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ad Provider (Dev Only)</Text>
      <Text style={styles.currentProvider}>Current: {CURRENT_AD_PROVIDER}</Text>
      <View style={styles.buttonContainer}>
        {providers.map((provider) => (
          <TouchableOpacity
            key={provider.key}
            style={[
              styles.button,
              CURRENT_AD_PROVIDER === provider.key && styles.activeButton,
            ]}
            onPress={() => onProviderChange?.(provider.key)}
          >
            <Text
              style={[
                styles.buttonText,
                CURRENT_AD_PROVIDER === provider.key && styles.activeButtonText,
              ]}
            >
              {provider.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={styles.note}>
        Note: Change CURRENT_AD_PROVIDER in src/config/ads.ts to switch providers
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  currentProvider: {
    fontSize: 14,
    marginBottom: 10,
    color: '#666',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  activeButton: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  activeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}); 