import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../styles/theme';

const { width } = Dimensions.get('window');
const PATTERN_SIZE = width / 8;

export const DominoPattern = () => {
  const renderDot = () => (
    <View style={styles.dot} />
  );

  const renderDomino = () => (
    <View style={styles.domino}>
      {renderDot()}
      {renderDot()}
      {renderDot()}
    </View>
  );

  const rows = Array(Math.ceil(Dimensions.get('window').height / PATTERN_SIZE))
    .fill(null)
    .map((_, i) => (
      <View key={i} style={styles.row}>
        {Array(4).fill(null).map((_, j) => (
          <View key={j} style={styles.dominoContainer}>
            {renderDomino()}
          </View>
        ))}
      </View>
    ));

  return (
    <View style={styles.container}>
      {rows}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.05,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: PATTERN_SIZE / 4,
  },
  dominoContainer: {
    width: PATTERN_SIZE,
    height: PATTERN_SIZE * 2,
    transform: [{ rotate: '45deg' }],
  },
  domino: {
    width: '100%',
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: PATTERN_SIZE / 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: PATTERN_SIZE / 8,
  },
  dot: {
    width: PATTERN_SIZE / 4,
    height: PATTERN_SIZE / 4,
    backgroundColor: COLORS.white,
    borderRadius: PATTERN_SIZE / 8,
  },
}); 