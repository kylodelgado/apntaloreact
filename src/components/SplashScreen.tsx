import React, { useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { COLORS, FONTS } from '../styles/theme';

const { width } = Dimensions.get('window');
const DOMINO_SIZE = width * 0.2;

export const SplashScreen = () => {
  const dominoRotate = new Animated.Value(0);
  const titleOpacity = new Animated.Value(0);
  const dominoScale = new Animated.Value(0.5);

  useEffect(() => {
    Animated.sequence([
      // First show the domino with rotation
      Animated.parallel([
        Animated.spring(dominoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(dominoRotate, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      // Then fade in the title
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = dominoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  // Helper function to render a 6-dot pattern
  const renderSixDots = () => (
    <View style={styles.dotsContainer}>
      <View style={styles.dotRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.dotRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
      <View style={styles.dotRow}>
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={COLORS.gradient.primary}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      
      <View style={styles.content}>
        <Animated.View
          style={[
            styles.dominoContainer,
            {
              transform: [
                { rotate: spin },
                { scale: dominoScale },
              ],
            },
          ]}
        >
          <View style={styles.domino}>
            {/* Top half */}
            {renderSixDots()}
            {/* Dividing line */}
            <View style={styles.dominoLine} />
            {/* Bottom half */}
            {renderSixDots()}
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: titleOpacity },
          ]}
        >
          Domino Apunte!
        </Animated.Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dominoContainer: {
    width: DOMINO_SIZE,
    height: DOMINO_SIZE * 2,
    marginBottom: 20,
  },
  domino: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: DOMINO_SIZE / 8,
    padding: DOMINO_SIZE / 8,
    justifyContent: 'space-between',
    // Add shadow for 3D effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  dominoLine: {
    height: 1,
    backgroundColor: COLORS.primary,
    opacity: 0.2,
    marginVertical: 2,
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    paddingVertical: 4,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dot: {
    width: DOMINO_SIZE / 8,
    height: DOMINO_SIZE / 8,
    borderRadius: DOMINO_SIZE / 16,
    backgroundColor: COLORS.primary,
    // Add inner shadow effect
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  title: {
    ...FONTS.title,
    fontSize: 48,
    color: COLORS.white,
    marginTop: 20,
  },
}); 