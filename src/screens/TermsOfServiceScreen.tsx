import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'TermsOfService'>;

export default function TermsOfServiceScreen({ navigation }: Props) {
  const { isDark } = useTheme();

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
            style={[
              styles.backButton,
              isDark && styles.backButtonDark
            ]}
            onPress={() => navigation.goBack()}
          >
            <Icon name="chevron-left" size={32} color={isDark ? COLORS.text.dark.primary : COLORS.primary} />
          </TouchableOpacity>
          <Text style={[
            styles.title,
            isDark && styles.titleDark
          ]}>Terms of Service</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>1. Acceptance of Terms</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            By downloading, installing, or using Domino Apunte! ("the App"), you agree to be bound by these Terms of Service. 
            If you do not agree to these terms, please do not use the App.
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>2. App Description</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            Domino Apunte! is a score tracking application designed primarily for domino games. The App allows users to:{'\n'}
            • Track scores for team and individual games{'\n'}
            • Set custom game configurations{'\n'}
            • Save game history locally on their device
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>3. User Rights and Restrictions</Text>
          <Text style={[
            styles.subsectionTitle,
            isDark && styles.subsectionTitleDark
          ]}>3.1 Users may:</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            • Use the App for personal, non-commercial purposes{'\n'}
            • Customize game settings and preferences{'\n'}
            • Store game data locally on their device
          </Text>

          <Text style={[
            styles.subsectionTitle,
            isDark && styles.subsectionTitleDark
          ]}>3.2 Users may not:</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            • Modify, reverse engineer, or attempt to extract the source code of the App{'\n'}
            • Use the App for any illegal purpose{'\n'}
            • Transfer their rights to use the App to another person{'\n'}
            • Use the App in any way that could damage, disable, or impair the App
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>4. Data and Privacy</Text>
          <Text style={[
            styles.subsectionTitle,
            isDark && styles.subsectionTitleDark
          ]}>4.1 Local Data Storage</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            • All game data and settings are stored locally on your device{'\n'}
            • We do not collect, store, or transmit personal information{'\n'}
            • User preferences and game history remain on your device
          </Text>

          <Text style={[
            styles.subsectionTitle,
            isDark && styles.subsectionTitleDark
          ]}>4.2 Device Permissions</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            • The App may request access to device features such as haptic feedback{'\n'}
            • You can manage these permissions through your device settings
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>5. Intellectual Property</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            The App, including its original content, features, and functionality, is owned by Ardanco 
            and protected by international copyright, trademark, and other intellectual property laws.
            The domino pattern designs and visual elements are proprietary to the App.
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>6. Contact Information</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            For any questions about these Terms of Service, please contact us at:{'\n'}
            Email: app@ardanco.com{'\n'}
            Bug reports and feature requests can be submitted through the App's settings menu.
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>7. Governing Law</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            These terms shall be governed by and construed in accordance with the laws of the Dominican Republic, 
            without regard to its conflict of law provisions.
          </Text>
        </View>
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
    backgroundColor: Platform.select({
      ios: COLORS.white + '80',
      android: 'rgba(255, 255, 255, 0.9)',
    }),
    borderRadius: 8,
    padding: SPACING.xs,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  backButtonDark: {
    backgroundColor: Platform.select({
      ios: 'rgba(45, 55, 72, 0.5)',
      android: 'rgba(45, 55, 72, 0.7)',
    }),
  },
  title: {
    ...FONTS.title,
    fontSize: 32,
    color: COLORS.primary,
    flex: 1,
    marginRight: 40,
  },
  titleDark: {
    color: COLORS.text.dark.primary,
  },
  section: {
    marginBottom: SPACING.lg,
    paddingHorizontal: SPACING.md,
  },
  sectionTitle: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
    marginTop: SPACING.lg,
    marginBottom: SPACING.sm,
  },
  sectionTitleDark: {
    color: COLORS.text.dark.primary,
  },
  subsectionTitle: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.text.primary,
    marginTop: SPACING.md,
    marginBottom: SPACING.xs,
  },
  subsectionTitleDark: {
    color: COLORS.text.dark.primary,
  },
  text: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
  },
  textDark: {
    color: COLORS.text.dark.primary,
  },
}); 