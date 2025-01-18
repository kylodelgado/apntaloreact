import * as React from 'react';

interface Props {
  size?: number;
}

// Define dot positions for 4|5 domino pattern
const leftDots = [
  { cx: 312, cy: 362 },
  { cx: 412, cy: 362 },
  { cx: 312, cy: 462 },
  { cx: 412, cy: 462 },
];

const rightDots = [
  { cx: 612, cy: 362 },
  { cx: 712, cy: 362 },
  { cx: 662, cy: 462 },
  { cx: 612, cy: 562 },
  { cx: 712, cy: 562 },
];

const AppIconNode: React.FC<Props> = ({ size = 1024 }) => {
  // Calculate scale factor for different sizes
  const scale = size / 1024;
  const scaleCoord = (n: number) => n * scale;

  return (
    <svg width={size} height={size} viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
      {/* Background */}
      <rect width="1024" height="1024" fill="#2C3E50" rx="200" ry="200"/>
      
      {/* Domino tile */}
      <rect x="212" y="262" width="600" height="500" fill="#ECF0F1" rx="40" ry="40"/>
      
      {/* Dividing line */}
      <line x1="512" y1="262" x2="512" y2="762" stroke="#2C3E50" strokeWidth="10"/>
      
      {/* Left side dots (4) */}
      {leftDots.map((dot, index) => (
        <circle
          key={`left-${index}`}
          cx={dot.cx}
          cy={dot.cy}
          r="40"
          fill="#2C3E50"
        />
      ))}
      
      {/* Right side dots (5) */}
      {rightDots.map((dot, index) => (
        <circle
          key={`right-${index}`}
          cx={dot.cx}
          cy={dot.cy}
          r="40"
          fill="#2C3E50"
        />
      ))}
      
      {/* Score text */}
      <text 
        x="512" 
        y="900" 
        fill="#ECF0F1" 
        fontFamily="Arial" 
        fontSize="120" 
        textAnchor="middle" 
        fontWeight="bold"
      >
        SCORE
      </text>
    </svg>
  );
};

export default AppIconNode; 