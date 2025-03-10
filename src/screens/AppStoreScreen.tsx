import React from 'react';
import { ScrollView, Text, StyleSheet, View, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RootStackParamList } from '../navigation/types';
import { COLORS, SPACING, FONTS, SHADOWS } from '../styles/theme';
import { GradientBackground } from '../components/GradientBackground';
import { DominoPattern } from '../components/DominoPattern';
import { FrostedGlassCard } from '../components/FrostedGlassCard';

type Props = NativeStackScreenProps<RootStackParamList, 'AppStore'>;

export default function AppStoreScreen({ navigation }: Props) {
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
          <Text style={styles.title}>App Store Information</Text>
        </View>
        
        <FrostedGlassCard style={styles.card}>
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
            AplicaDom{'\n'}
            app@aplicadom.com{'\n'}
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