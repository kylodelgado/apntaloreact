<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
  <!-- Background with rounded corners -->
  <defs>
    <!-- Gradients -->
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2C3E50"/>
      <stop offset="100%" style="stop-color:#1E2A3B"/>
    </linearGradient>
    <linearGradient id="tileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#f8fafc"/>
      <stop offset="100%" style="stop-color:#e2e8f0"/>
    </linearGradient>
    <!-- Drop shadow for the tile -->
    <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="15"/>
      <feOffset dx="0" dy="10"/>
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.3"/>
      </feComponentTransfer>
      <feMerge>
        <feMergeNode/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <!-- Inner shadow for dots -->
    <filter id="innerShadow">
      <feGaussianBlur in="SourceAlpha" stdDeviation="2"/>
      <feOffset dx="0" dy="1"/>
      <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.5 0"/>
    </filter>
  </defs>

  <!-- App background -->
  <rect width="1024" height="1024" fill="url(#bgGradient)" rx="200" ry="200"/>
  
  <!-- Domino tile with gradient and shadow -->
  <rect x="212" y="262" width="600" height="500" fill="url(#tileGradient)" rx="40" ry="40" filter="url(#dropShadow)"/>
  
  <!-- Left edge highlight -->
  <rect x="212" y="262" width="10" height="500" fill="white" rx="40" ry="40" opacity="0.5"/>
  
  <!-- Right edge shadow -->
  <rect x="802" y="262" width="10" height="500" fill="black" rx="40" ry="40" opacity="0.05"/>
  
  <!-- Dividing line with shadow -->
  <line x1="512" y1="262" x2="512" y2="762" stroke="#2C3E50" stroke-width="2" opacity="0.2"/>
  
  <!-- Left side dots (6) with inner shadow -->
  <circle cx="312" cy="322" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="412" cy="322" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="312" cy="422" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="412" cy="422" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="312" cy="522" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="412" cy="522" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  
  <!-- Right side dots (6) with inner shadow -->
  <circle cx="612" cy="322" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="712" cy="322" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="612" cy="422" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="712" cy="422" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="612" cy="522" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  <circle cx="712" cy="522" r="35" fill="#2C3E50" filter="url(#innerShadow)"/>
  
  <!-- Score text with modern style -->
  <text x="512" y="900" fill="#ECF0F1" font-family="Inter, Arial" font-size="120" text-anchor="middle" font-weight="bold" letter-spacing="2">SCORE</text>
</svg>