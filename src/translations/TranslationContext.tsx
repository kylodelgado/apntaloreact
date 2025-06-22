import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { en } from './en';
import { es } from './es';
import { NativeModules, Platform } from 'react-native';

type Language = 'en' | 'es';
type TranslationType = typeof en;

interface TranslationContextType {
  t: TranslationType;
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
}

const translations = {
  en,
  es,
};

const STORAGE_KEY = '@language';

const getDeviceLanguage = (): Language => {
  console.log('Getting device language...');
  
  try {
    let detectedLanguage = 'en';

    if (Platform.OS === 'ios') {
      // Check if SettingsManager is available before accessing it
      if (NativeModules.SettingsManager && NativeModules.SettingsManager.settings) {
        // Get device language settings
        const languages = NativeModules.SettingsManager.settings.AppleLanguages;
        const locale = NativeModules.SettingsManager.settings.AppleLocale;
        
        console.log('iOS Device Languages:', languages);
        console.log('iOS Device Locale:', locale);
        
        // First try to get language from AppleLanguages array
        if (languages && languages.length > 0) {
          const primaryLanguage = languages[0].toLowerCase();
          console.log('Primary language:', primaryLanguage);
          // We only support 'es' (Spanish) and 'en' (English)
          if (primaryLanguage.startsWith('es')) {
            detectedLanguage = 'es';
          }
        }
        
        // Fallback to locale if AppleLanguages doesn't give us what we need
        if (!detectedLanguage && locale) {
          const localeLanguage = locale.toLowerCase().split('_')[0];
          console.log('Locale language:', localeLanguage);
          if (localeLanguage === 'es') {
            detectedLanguage = 'es';
          }
        }
      } else {
        console.log('SettingsManager not available, defaulting to English');
      }
    }

    if (Platform.OS === 'android') {
      try {
        // First try I18nManager
        if (NativeModules.I18nManager && NativeModules.I18nManager.getConstants) {
          const locale = NativeModules.I18nManager.getConstants().localeIdentifier;
          console.log('Android Device Locale (I18nManager):', locale);
          
          if (locale) {
            const localeLanguage = locale.toLowerCase().split('_')[0];
            console.log('Android locale language:', localeLanguage);
            if (localeLanguage === 'es') {
              detectedLanguage = 'es';
            }
          }
        } else if (NativeModules.SettingsManager && NativeModules.SettingsManager.settings) {
          // Fallback to SettingsManager
          const settingsLocale = NativeModules.SettingsManager.settings.locale;
          console.log('Android Device Locale (SettingsManager):', settingsLocale);
          
          if (settingsLocale) {
            const localeLanguage = settingsLocale.toLowerCase().split('_')[0];
            console.log('Android locale language (SettingsManager):', localeLanguage);
            if (localeLanguage === 'es') {
              detectedLanguage = 'es';
            }
          }
        } else {
          console.log('No locale detection available on Android, defaulting to English');
        }
      } catch (error) {
        console.error('Error accessing Android locale:', error);
      }
    }

    console.log(`Device language detected: ${detectedLanguage} (Supporting: en, es)`);
    return detectedLanguage as Language;
  } catch (error) {
    console.error('Error detecting device language:', error);
    return 'en';
  }
};

export const TranslationContext = createContext<TranslationContextType>({
  t: en,
  language: 'en',
  setLanguage: async () => {},
});

export const TranslationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    const initLanguage = async () => {
      try {
        // First try to get saved language preference
        const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
        console.log('Saved language preference:', savedLanguage);

        if (savedLanguage === 'en' || savedLanguage === 'es') {
          // Use saved language preference if it exists
          console.log('Using saved language preference:', savedLanguage);
          setLanguageState(savedLanguage);
        } else {
          // If no saved preference, use device language
          const deviceLanguage = getDeviceLanguage();
          console.log('Using device language:', deviceLanguage);
          await AsyncStorage.setItem(STORAGE_KEY, deviceLanguage);
          setLanguageState(deviceLanguage);
        }
      } catch (error) {
        console.error('Error in language initialization:', error);
        // On error, try to use device language
        const deviceLanguage = getDeviceLanguage();
        console.log('Error occurred, defaulting to device language:', deviceLanguage);
        setLanguageState(deviceLanguage);
      }
    };

    initLanguage();
  }, []);

  const setLanguage = async (newLanguage: Language) => {
    try {
      console.log('Setting new language:', newLanguage);
      await AsyncStorage.setItem(STORAGE_KEY, newLanguage);
      setLanguageState(newLanguage);
    } catch (error) {
      console.error('Error saving language preference:', error);
      // If there's an error saving to storage, still update the state
      setLanguageState(newLanguage);
    }
  };

  const value = {
    t: translations[language],
    language,
    setLanguage,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (!context) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}; 