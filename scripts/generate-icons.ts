import { renderToString } from 'react-dom/server';
import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import AppIconNode from './AppIconNode';
import * as React from 'react';

// Define icon sizes for iOS
const IOS_SIZES = {
  'AppIcon-20@2x.png': 40,
  'AppIcon-20@3x.png': 60,
  'AppIcon-29@2x.png': 58,
  'AppIcon-29@3x.png': 87,
  'AppIcon-40@2x.png': 80,
  'AppIcon-40@3x.png': 120,
  'AppIcon-60@2x.png': 120,
  'AppIcon-60@3x.png': 180,
  'AppIcon-76.png': 76,
  'AppIcon-76@2x.png': 152,
  'AppIcon-83.5@2x.png': 167,
  'AppIcon-1024.png': 1024,
} as const;

// Define icon sizes for Android
const ANDROID_SIZES = {
  'mipmap-mdpi/ic_launcher.png': 48,
  'mipmap-hdpi/ic_launcher.png': 72,
  'mipmap-xhdpi/ic_launcher.png': 96,
  'mipmap-xxhdpi/ic_launcher.png': 144,
  'mipmap-xxxhdpi/ic_launcher.png': 192,
  'playstore-icon.png': 512,
} as const;

async function generateIcon(svgString: string, size: number, outputPath: string): Promise<void> {
  // Create directory if it doesn't exist
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Convert SVG to PNG using sharp
  await sharp(Buffer.from(svgString))
    .resize(size, size)
    .png()
    .toFile(outputPath);

  console.log(`Generated: ${outputPath}`);
}

async function generateIcons(): Promise<void> {
  // Generate iOS icons
  for (const [filename, size] of Object.entries(IOS_SIZES)) {
    const svgString = renderToString(React.createElement(AppIconNode, { size }));
    const outputPath = path.join('ios', 'apntaloreact', 'Images.xcassets', 'AppIcon.appiconset', filename);
    await generateIcon(svgString, size, outputPath);
  }

  // Generate Android icons
  for (const [filename, size] of Object.entries(ANDROID_SIZES)) {
    const svgString = renderToString(React.createElement(AppIconNode, { size }));
    const outputPath = path.join('android', 'app', 'src', 'main', 'res', filename);
    await generateIcon(svgString, size, outputPath);
  }
}

// Run the icon generation
generateIcons().catch(console.error); 