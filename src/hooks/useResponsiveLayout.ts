import { useWindowDimensions } from 'react-native';

export const useResponsiveLayout = () => {
  const { width, height } = useWindowDimensions();
  
  const isTablet = width >= 768; // Standard tablet breakpoint
  const isLandscape = width > height;

  // Calculate responsive dimensions
  const getResponsiveDimension = (
    defaultSize: number,
    tabletMultiplier = 1.3
  ) => {
    return isTablet ? defaultSize * tabletMultiplier : defaultSize;
  };

  // Calculate responsive spacing
  const getResponsiveSpacing = (
    defaultSpacing: number,
    tabletMultiplier = 1.5
  ) => {
    return isTablet ? defaultSpacing * tabletMultiplier : defaultSpacing;
  };

  // Get responsive font size
  const getResponsiveFontSize = (
    defaultSize: number,
    tabletMultiplier = 1.2
  ) => {
    return isTablet ? defaultSize * tabletMultiplier : defaultSize;
  };

  // Get responsive layout values
  const getContainerWidth = () => {
    if (isTablet) {
      return isLandscape ? '50%' : '75%';
    }
    return '100%';
  };

  return {
    isTablet,
    isLandscape,
    getResponsiveDimension,
    getResponsiveSpacing,
    getResponsiveFontSize,
    getContainerWidth,
    screenWidth: width,
    screenHeight: height,
  };
}; 