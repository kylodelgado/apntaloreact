import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useResponsiveLayout } from '../hooks/useResponsiveLayout';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  style?: any;
}

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  style,
}) => {
  const { getContainerWidth, isTablet } = useResponsiveLayout();

  return (
    <View
      style={[
        styles.container,
        {
          width: getContainerWidth(),
          maxWidth: isTablet ? 800 : undefined,
          alignSelf: 'center',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
}); 