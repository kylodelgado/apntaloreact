import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export default function PrivacyPolicyScreen() {
  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Privacy Policy</Text>
        
        <FrostedGlassCard style={styles.card}>
          <Text style={styles.text}>
            Our app does not collect personal data. All game data is stored locally on your device.
            We do not use analytics or tracking services.
          </Text>
          
          <Text style={styles.sectionTitle}>Data Storage</Text>
          <Text style={styles.text}>
            • Game scores and settings are stored locally{'\n'}
            • No data is transmitted to external servers{'\n'}
            • You can clear all data through the Settings menu
          </Text>
          
          <Text style={styles.sectionTitle}>Permissions</Text>
          <Text style={styles.text}>
            The app only requests access to:{'\n'}
            • Haptic feedback for game interactions
          </Text>
          
          <Text style={styles.sectionTitle}>Contact</Text>
          <Text style={styles.text}>
            For questions about this privacy policy:{'\n'}
            app@ardanco.com
          </Text>
        </FrostedGlassCard>
      </ScrollView>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: SPACING.lg,
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    marginBottom: SPACING.xl,
    textAlign: 'center',
  },
  card: {
    padding: SPACING.lg,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  text: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
}); 