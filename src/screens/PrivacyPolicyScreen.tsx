import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Platform } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'PrivacyPolicy'>;

export default function PrivacyPolicyScreen({ navigation }: Props) {
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
          ]}>Privacy Policy</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            Our app does not collect personal data. All game data is stored locally on your device.
            We do not use analytics or tracking services.
          </Text>
          
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Data Storage</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            • Game scores and settings are stored locally{'\n'}
            • No data is transmitted to external servers{'\n'}
            • You can clear all data through the Settings menu
          </Text>
          
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Permissions</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            The app only requests access to:{'\n'}
            • Haptic feedback for game interactions
          </Text>
          
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Contact</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            For questions about this privacy policy:{'\n'}
            app@ardanco.com
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
      android: 'rgba(255, 255, 255, 0.0)',
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