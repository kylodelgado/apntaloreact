import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useColorScheme, AppState } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: ThemeMode;
  isDark: boolean;
  setTheme: (theme: ThemeMode) => void;
  isThemeReady: boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'system',
  isDark: false,
  setTheme: () => {},
  isThemeReady: false,
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [theme, setThemeState] = useState<ThemeMode>('system');
  const [isThemeReady, setIsThemeReady] = useState(false);
  const appState = useRef(AppState.currentState);

  // Load theme on initial mount
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system')) {
          setThemeState(savedTheme);
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      } finally {
        // Mark theme as ready regardless of success/failure
        setIsThemeReady(true);
      }
    };
    
    loadTheme();
  }, []);

  // Add AppState listener to ensure theme is preserved on resume
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      // Only handle transitions from background to active
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // No need to reload theme or show loading indicators
        // React Native preserves the state
      }
      
      // Update the AppState ref
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    AsyncStorage.setItem('theme', newTheme);
  };

  const isDark = theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, isThemeReady }}>
      {children}
    </ThemeContext.Provider>
  );
}; 