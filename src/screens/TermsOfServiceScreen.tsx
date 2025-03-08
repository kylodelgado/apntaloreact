import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen() {
  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Terms of Service</Text>
        
        <FrostedGlassCard style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: March 18, 2024</Text>

          <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
          <Text style={styles.text}>
            By downloading, installing, or using Domino Apunte! ("the App"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the App.
          </Text>

          <Text style={styles.sectionTitle}>2. App Description</Text>
          <Text style={styles.text}>
            Domino Apunte! is a score tracking application designed primarily for domino games. The App allows users to:{'\n'}
            • Track scores for team and individual games{'\n'}
            • Set custom game configurations{'\n'}
            • Save game history locally on their device
          </Text>

          <Text style={styles.sectionTitle}>3. User Rights and Restrictions</Text>
          <Text style={styles.subsectionTitle}>3.1 Users may:</Text>
          <Text style={styles.text}>
            • Use the App for personal, non-commercial purposes{'\n'}
            • Customize game settings and preferences{'\n'}
            • Store game data locally on their device
          </Text>

          <Text style={styles.subsectionTitle}>3.2 Users may not:</Text>
          <Text style={styles.text}>
            • Modify, reverse engineer, or attempt to extract the source code of the App{'\n'}
            • Use the App for any illegal purpose{'\n'}
            • Transfer their rights to use the App to another person{'\n'}
            • Use the App in any way that could damage, disable, or impair the App
          </Text>

          <Text style={styles.sectionTitle}>4. Data and Privacy</Text>
          <Text style={styles.subsectionTitle}>4.1 Local Data Storage</Text>
          <Text style={styles.text}>
            • All game data and settings are stored locally on your device{'\n'}
            • We do not collect, store, or transmit personal information{'\n'}
            • User preferences and game history remain on your device
          </Text>

          <Text style={styles.subsectionTitle}>4.2 Device Permissions</Text>
          <Text style={styles.text}>
            • The App may request access to device features such as haptic feedback{'\n'}
            • You can manage these permissions through your device settings
          </Text>

          <Text style={styles.sectionTitle}>5. Intellectual Property</Text>
          <Text style={styles.text}>
            The App, including its original content, features, and functionality, is owned by Ardanco 
            and protected by international copyright, trademark, and other intellectual property laws.
            The domino pattern designs and visual elements are proprietary to the App.
          </Text>

          <Text style={styles.sectionTitle}>6. Contact Information</Text>
          <Text style={styles.text}>
            For any questions about these Terms of Service, please contact us at:{'\n'}
            Email: app@ardanco.com{'\n'}
            Bug reports and feature requests can be submitted through the App's settings menu.
          </Text>

          <Text style={styles.sectionTitle}>7. Governing Law</Text>
          <Text style={styles.text}>
            These terms shall be governed by and construed in accordance with the laws of the Dominican Republic, 
            without regard to its conflict of law provisions.
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
    paddingBottom: SPACING.xl * 2,
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
  lastUpdated: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.text.secondary,
    marginBottom: SPACING.xl,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  subsectionTitle: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  text: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
}); 