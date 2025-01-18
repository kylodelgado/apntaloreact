const { renderToString } = require('react-dom/server');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { AppIcon } = require('../src/components/AppIcon');

// Define iOS icon sizes
const IOS_SIZES = {
  'Icon-20@2x.png': 40,
  'Icon-20@3x.png': 60,
  'Icon-29@2x.png': 58,
  'Icon-29@3x.png': 87,
  'Icon-40@2x.png': 80,
  'Icon-40@3x.png': 120,
  'Icon-60@2x.png': 120,
  'Icon-60@3x.png': 180,
  'Icon-76.png': 76,
  'Icon-76@2x.png': 152,
  'Icon-83.5@2x.png': 167,
  'Icon-1024.png': 1024,
};

// Define Android icon sizes
const ANDROID_SIZES = {
  'mipmap-mdpi/ic_launcher.png': 48,
  'mipmap-hdpi/ic_launcher.png': 72,
  'mipmap-xhdpi/ic_launcher.png': 96,
  'mipmap-xxhdpi/ic_launcher.png': 144,
  'mipmap-xxxhdpi/ic_launcher.png': 192,
  'playstore-icon.png': 512,
};

async function generateIcon(svgString, size, outputPath) {
  // Create directory if it doesn't exist
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Convert SVG to PNG with specified size
  await sharp(Buffer.from(svgString))
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`Generated: ${outputPath}`);
}

async function generateIcons() {
  // Generate iOS icons
  const iosPath = path.join(__dirname, '../ios/apntaloreact/Images.xcassets/AppIcon.appiconset');
  for (const [filename, size] of Object.entries(IOS_SIZES)) {
    const svgString = renderToString(AppIcon({ size }));
    await generateIcon(svgString, size, path.join(iosPath, filename));
  }

  // Generate Android icons
  const androidPath = path.join(__dirname, '../android/app/src/main/res');
  for (const [filename, size] of Object.entries(ANDROID_SIZES)) {
    const svgString = renderToString(AppIcon({ size }));
    await generateIcon(svgString, size, path.join(androidPath, filename));
  }
}

generateIcons().catch(console.error); 