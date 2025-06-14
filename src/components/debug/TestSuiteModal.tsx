import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  NativeModules,
} from 'react-native';
import { IronSource } from 'ironsource-mediation';
import { COLORS, FONTS, SHADOWS, SPACING } from '../../styles/theme';
import { useTheme } from '../../context/ThemeContext';

interface Props {
  visible: boolean;
  onClose: () => void;
}

export const TestSuiteModal: React.FC<Props> = ({ visible, onClose }) => {
  const { isDark } = useTheme();

  const launchTestSuite = async () => {
    try {
      if (Platform.OS === 'ios') {
        if (typeof (IronSource as any).launchTestSuite === 'function') {
          await (IronSource as any).launchTestSuite();
        } else if (NativeModules.IronSourceMediation && typeof NativeModules.IronSourceMediation.launchTestSuite === 'function') {
          await NativeModules.IronSourceMediation.launchTestSuite();
        } else {
          console.warn('launchTestSuite not available in IronSource module');
        }
      }
    } catch (error) {
      console.error('Error launching IronSource Test Suite:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={[styles.card, isDark && styles.cardDark]}>
          <Text style={[styles.title, isDark && styles.titleDark]}>Debug Tools</Text>

          <TouchableOpacity style={[styles.button, styles.launchButton]} onPress={launchTestSuite}>
            <Text style={styles.buttonText}>Launch IronSource Test Suite</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.closeButton]} onPress={onClose}>
            <Text style={styles.buttonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: '80%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SPACING.lg,
    alignItems: 'center',
    gap: SPACING.md,
    ...SHADOWS.medium,
  },
  cardDark: {
    backgroundColor: COLORS.background.dark,
  },
  title: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text.primary,
    marginBottom: SPACING.md,
  },
  titleDark: {
    color: COLORS.text.dark.primary,
  },
  button: {
    width: '100%',
    paddingVertical: SPACING.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  launchButton: {
    backgroundColor: COLORS.primary,
  },
  closeButton: {
    backgroundColor: COLORS.secondary,
  },
  buttonText: {
    ...FONTS.medium,
    color: COLORS.white,
    fontSize: 16,
  },
}); 