import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { COLORS } from '../styles/theme';

const { width, height } = Dimensions.get('window');
const PATTERN_SIZE = width / 8;

type DotPositions = {
  [key: number]: number[];
};

// Dot positions for numbers 0-6
const dotPositions: DotPositions = {
  0: [],
  1: [4],
  2: [2, 6],
  3: [2, 4, 6],
  4: [0, 2, 6, 8],
  5: [0, 2, 4, 6, 8],
  6: [0, 2, 3, 5, 6, 8]
};

type DominoVariant = {
  top: number;
  bottom: number;
};

// Predefined domino combinations for different screens
const DOMINO_VARIANTS = {
  home: { top: 6, bottom: 6 },      // Double six for home
  setup: { top: 5, bottom: 4 },     // High scoring combination for setup
  gameplay: { top: 6, bottom: 3 },  // Original pattern
  gameOver: { top: 1, bottom: 0 },  // Low scoring combination for game over
};

type Props = {
  variant?: keyof typeof DOMINO_VARIANTS;
  customDomino?: DominoVariant;
  opacity?: number;
};

export const DominoPattern: React.FC<Props> = ({ 
  variant = 'gameplay',
  customDomino,
  opacity = 0.05 
}) => {
  const dominoPattern = customDomino || DOMINO_VARIANTS[variant];

  const renderDots = (number: number) => {
    const positions = dotPositions[number] || [];
    const dots = Array(9).fill(null);
    
    return (
      <View style={styles.dotsContainer}>
        {dots.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              positions.includes(index) ? styles.visibleDot : styles.invisibleDot
            ]}
          />
        ))}
      </View>
    );
  };

  const renderDomino = () => (
    <View style={styles.domino}>
      <View style={styles.dominoHalf}>
        {renderDots(dominoPattern.top)}
      </View>
      <View style={styles.dominoLine} />
      <View style={styles.dominoHalf}>
        {renderDots(dominoPattern.bottom)}
      </View>
    </View>
  );

  // Calculate rows to cover the entire screen height including safe areas
  const rows = Array(Math.ceil((height + 100) / PATTERN_SIZE))
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
    <View style={[styles.container, { opacity }]}>
      {rows}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
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
    justifyContent: 'space-between',
    padding: PATTERN_SIZE / 8,
  },
  dominoHalf: {
    flex: 1,
    justifyContent: 'center',
  },
  dominoLine: {
    height: 1,
    backgroundColor: COLORS.white,
    marginVertical: PATTERN_SIZE / 16,
  },
  dotsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: {
    width: PATTERN_SIZE / 6,
    height: PATTERN_SIZE / 6,
    margin: PATTERN_SIZE / 24,
    borderRadius: PATTERN_SIZE / 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  visibleDot: {
    backgroundColor: COLORS.white,
    elevation: 3,
  },
  invisibleDot: {
    backgroundColor: 'transparent',
    elevation: 0,
  },
}); 