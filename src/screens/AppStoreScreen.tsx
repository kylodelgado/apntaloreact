import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { useTheme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AppStore'>;

export default function AppStoreScreen({ navigation }: Props) {
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
          ]}>App Store Information</Text>
        </View>
        
        <View style={styles.section}>
          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>App Category</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            Sports / Games / Utilities
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Age Rating</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            4+ (No objectionable content)
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Data Collection</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            This app does not collect any user data. All game information is stored locally on your device.
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Privacy Practices</Text>
          <View style={styles.bulletList}>
            <Text style={[
              styles.bulletPoint,
              isDark && styles.bulletPointDark
            ]}>• No data collection or tracking</Text>
            <Text style={[
              styles.bulletPoint,
              isDark && styles.bulletPointDark
            ]}>• No third-party analytics</Text>
            <Text style={[
              styles.bulletPoint,
              isDark && styles.bulletPointDark
            ]}>• No advertising</Text>
            <Text style={[
              styles.bulletPoint,
              isDark && styles.bulletPointDark
            ]}>• No user accounts or registration</Text>
          </View>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Required Permissions</Text>
          <View style={styles.bulletList}>
            <Text style={[
              styles.bulletPoint,
              isDark && styles.bulletPointDark
            ]}>• None - The app functions completely offline</Text>
          </View>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>In-App Purchases</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            This app does not contain any in-app purchases or subscriptions.
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Developer Information</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            AplicaDom{'\n'}
            app@aplicadom.com{'\n'}
            Dominican Republic
          </Text>

          <Text style={[
            styles.sectionTitle,
            isDark && styles.sectionTitleDark
          ]}>Support</Text>
          <Text style={[
            styles.text,
            isDark && styles.textDark
          ]}>
            For support inquiries, please use the contact options in the Settings menu.
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
    backgroundColor: COLORS.white + '80',
    borderRadius: 8,
    padding: SPACING.xs,
    marginRight: SPACING.md,
    ...SHADOWS.small,
  },
  backButtonDark: {
    backgroundColor: 'rgba(45, 55, 72, 0.5)',
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
  bulletPointDark: {
    color: COLORS.text.dark.primary,
  },
}); 