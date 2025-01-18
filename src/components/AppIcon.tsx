import * as React from 'react';
import { Svg, Rect, Circle, LinearGradient, Stop, Defs } from 'react-native-svg';
import { COLORS } from '../theme';

interface Props {
  size?: number;
}

// Define dot positions for 6|3 domino pattern
const leftDots = [
  { cx: 0.25, cy: 0.2 },
  { cx: 0.25, cy: 0.5 },
  { cx: 0.25, cy: 0.8 },
  { cx: 0.75, cy: 0.2 },
  { cx: 0.75, cy: 0.5 },
  { cx: 0.75, cy: 0.8 },
];

const rightDots = [
  { cx: 0.25, cy: 0.2 },
  { cx: 0.5, cy: 0.5 },
  { cx: 0.75, cy: 0.8 },
];

const AppIcon: React.FC<Props> = ({ size = 1024 }) => {
  const padding = size * 0.15; // Increased padding
  const dotRadius = size * 0.06; // Larger dots
  const adjustedSize = size - padding * 2;
  const cornerRadius = size * 0.15; // Rounder corners

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <LinearGradient id="bgGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={COLORS.primary} stopOpacity="1" />
          <Stop offset="1" stopColor="#0F2B6B" stopOpacity="1" />
        </LinearGradient>
        <LinearGradient id="dotGradient" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="1" />
          <Stop offset="1" stopColor="#E5E7EB" stopOpacity="1" />
        </LinearGradient>
      </Defs>

      {/* Background with shadow effect */}
      <Rect
        x={padding + size * 0.01}
        y={padding + size * 0.01}
        width={adjustedSize}
        height={adjustedSize}
        rx={cornerRadius}
        fill="#000000"
        opacity={0.3}
      />

      {/* Main domino tile */}
      <Rect
        x={padding}
        y={padding}
        width={adjustedSize}
        height={adjustedSize}
        rx={cornerRadius}
        fill="url(#bgGradient)"
      />

      {/* Dividing line with gradient */}
      <Rect
        x={size / 2 - size * 0.01}
        y={padding}
        width={size * 0.02}
        height={adjustedSize}
        fill="#FFFFFF"
        opacity={0.2}
      />

      {/* Left side dots */}
      {leftDots.map((dot, index) => (
        <Circle
          key={`left-${index}`}
          cx={padding + adjustedSize * dot.cx}
          cy={padding + adjustedSize * dot.cy}
          r={dotRadius}
          fill="url(#dotGradient)"
        />
      ))}

      {/* Right side dots */}
      {rightDots.map((dot, index) => (
        <Circle
          key={`right-${index}`}
          cx={padding + adjustedSize * (0.5 + dot.cx)}
          cy={padding + adjustedSize * dot.cy}
          r={dotRadius}
          fill="url(#dotGradient)"
        />
      ))}
    </Svg>
  );
};

export default AppIcon; 