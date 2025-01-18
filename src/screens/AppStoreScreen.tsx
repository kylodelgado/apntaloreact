import React from 'react';
import { ScrollView, Text, StyleSheet, View } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';

type Props = NativeStackScreenProps<RootStackParamList, 'AppStore'>;

export default function AppStoreScreen() {
  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>App Store Information</Text>
        
        <FrostedGlassCard style={styles.card}>
          <Text style={styles.lastUpdated}>Last Updated: March 18, 2024</Text>

          <Text style={styles.sectionTitle}>App Category</Text>
          <Text style={styles.text}>
            Sports / Games / Utilities
          </Text>

          <Text style={styles.sectionTitle}>Age Rating</Text>
          <Text style={styles.text}>
            4+ (No objectionable content)
          </Text>

          <Text style={styles.sectionTitle}>Data Collection</Text>
          <Text style={styles.text}>
            This app does not collect any user data. All game information is stored locally on your device.
          </Text>

          <Text style={styles.sectionTitle}>Privacy Practices</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• No data collection or tracking</Text>
            <Text style={styles.bulletPoint}>• No third-party analytics</Text>
            <Text style={styles.bulletPoint}>• No advertising</Text>
            <Text style={styles.bulletPoint}>• No user accounts or registration</Text>
          </View>

          <Text style={styles.sectionTitle}>Required Permissions</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bulletPoint}>• None - The app functions completely offline</Text>
          </View>

          <Text style={styles.sectionTitle}>In-App Purchases</Text>
          <Text style={styles.text}>
            This app does not contain any in-app purchases or subscriptions.
          </Text>

          <Text style={styles.sectionTitle}>Developer Information</Text>
          <Text style={styles.text}>
            Ardanco{'\n'}
            app@ardanco.com{'\n'}
            Dominican Republic
          </Text>

          <Text style={styles.sectionTitle}>Support</Text>
          <Text style={styles.text}>
            For support inquiries, please use the contact options in the Settings menu.
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
  text: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  bulletList: {
    marginTop: SPACING.xs,
  },
  bulletPoint: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginLeft: SPACING.sm,
  },
}); 