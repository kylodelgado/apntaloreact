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
            <View style={styles.dominoLine} />
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={styles.dot} />
              <View style={styles.dot} />
            </View>
          </View>
        </Animated.View>

        <Animated.Text
          style={[
            styles.title,
            { opacity: titleOpacity },
          ]}
        >
          ¡Apuntalo!
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
  },
  dominoLine: {
    height: 2,
    backgroundColor: COLORS.primary,
    marginVertical: DOMINO_SIZE / 4,
  },
  dotsContainer: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  dot: {
    width: DOMINO_SIZE / 6,
    height: DOMINO_SIZE / 6,
    borderRadius: DOMINO_SIZE / 12,
    backgroundColor: COLORS.primary,
  },
  title: {
    ...FONTS.title,
    fontSize: 48,
    color: COLORS.white,
    marginTop: 20,
  },
}); 