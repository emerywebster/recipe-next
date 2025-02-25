#!/usr/bin/env node

/**
 * This script generates PNG icons from an SVG source for PWA support.
 *
 * To use this script:
 * 1. Install sharp: npm install --save-dev sharp
 * 2. Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const SIZES = [192, 512];
const SOURCE_SVG = path.join(__dirname, '../public/icons/icon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/icons');

async function generateIcons() {
  console.log('Generating PWA icons...');

  if (!fs.existsSync(SOURCE_SVG)) {
    console.error(`Source SVG not found: ${SOURCE_SVG}`);
    process.exit(1);
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const svgBuffer = fs.readFileSync(SOURCE_SVG);

  // Generate regular icons
  for (const size of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, `icon-${size}x${size}.png`);
    await sharp(svgBuffer).resize(size, size).png().toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }

  // Generate maskable icons (with padding for safe area)
  for (const size of SIZES) {
    // Add 10% padding for maskable icons
    const padding = Math.floor(size * 0.1);
    const outputPath = path.join(OUTPUT_DIR, `icon-maskable-${size}x${size}.png`);

    await sharp(svgBuffer)
      .resize(size - padding * 2, size - padding * 2)
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: { r: 79, g: 70, b: 229, alpha: 1 }, // #4f46e5
      })
      .png()
      .toFile(outputPath);
    console.log(`Generated: ${outputPath}`);
  }

  console.log('Icon generation complete!');
}

generateIcons().catch((err) => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
