import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen({ navigation }: Props) {
  return (
    <GradientBackground safeAreaEdges={['top', 'bottom']}>
      <DominoPattern variant="setup" opacity={0.05} />
      
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Terms of Service</Text>
        </View>
        
        <FrostedGlassCard style={styles.card}>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: SPACING.xs,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    flex: 1,
    marginRight: 40, // To offset the back button width and keep title centered
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