/**
 * PWA Icon Generator Script
 * 
 * This script helps generate PWA icons from the icon.svg file.
 * 
 * OPTION 1: Use an online tool (Recommended - Easiest)
 * =====================================================
 * 1. Visit: https://realfavicongenerator.net/
 * 2. Upload: public/icon.svg
 * 3. Configure settings and generate
 * 4. Download and extract to public/ folder
 * 
 * OPTION 2: Use this Node.js script (Requires sharp library)
 * ==========================================================
 * Run: node scripts/generate-icons.js
 */

const fs = require('fs');
const path = require('path');

const sizes = [192, 256, 384, 512];
const iconSizes = {
  'icon-192x192.png': 192,
  'icon-256x256.png': 256,
  'icon-384x384.png': 384,
  'icon-512x512.png': 512,
  'apple-touch-icon.png': 180,
};

console.log('PWA Icon Generator');
console.log('==================\n');

// Check if sharp is installed
try {
  require.resolve('sharp');
  generateWithSharp();
} catch (e) {
  console.log('⚠️  Sharp library not found.');
  console.log('\nTo generate icons automatically, install sharp:');
  console.log('  npm install --save-dev sharp');
  console.log('\nOr use online tool (easier):');
  console.log('  1. Visit: https://realfavicongenerator.net/');
  console.log('  2. Upload: public/icon.svg');
  console.log('  3. Download and extract icons to public/ folder\n');
  process.exit(1);
}

async function generateWithSharp() {
  const sharp = require('sharp');
  const svgPath = path.join(__dirname, '../public/icon.svg');
  const publicDir = path.join(__dirname, '../public');

  console.log('Generating PWA icons from icon.svg...\n');

  try {
    const svgBuffer = fs.readFileSync(svgPath);

    for (const [filename, size] of Object.entries(iconSizes)) {
      const outputPath = path.join(publicDir, filename);
      
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);
      
      console.log(`✅ Generated: ${filename} (${size}x${size})`);
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('\nNext steps:');
    console.log('  1. Run: npm run build');
    console.log('  2. Test PWA at: https://aiubfiles.app');
    console.log('  3. Check installability in Chrome DevTools > Application > Manifest\n');

  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    console.log('\nFalling back to online tool method:');
    console.log('  1. Visit: https://realfavicongenerator.net/');
    console.log('  2. Upload: public/icon.svg');
    console.log('  3. Download and extract icons to public/ folder\n');
    process.exit(1);
  }
}
