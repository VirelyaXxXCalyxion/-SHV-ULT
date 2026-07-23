/**
 * Image Watermarking Script for Ashvault
 * Adds visual watermarks and EXIF metadata to all images
 *
 * Usage: node scripts/watermark-images.js
 */

import sharp from 'sharp';
import { readdir, mkdir } from 'fs/promises';
import { join, extname, basename } from 'path';
import { existsSync } from 'fs';

// Configuration
const CONFIG = {
  watermarkText: '© 2025-2026 Nyxion & Virelya | ashvault.ink',
  watermarkOpacity: 0.3,
  fontSize: 24,
  fontColor: '#ffffff',
  position: 'southeast', // corner position
  padding: 20,
  backupOriginals: true,
  imageDirectories: [
    'public/images/relics',
    'public/images/scrolls',
    'public/images/artifacts',
    'public/images/relics-sealed',
    'public/images/labyrinth/operating-systems'
  ],
  supportedFormats: ['.png', '.jpg', '.jpeg', '.webp']
};

// EXIF metadata to embed
const EXIF_METADATA = {
  copyright: '© 2025-2026 Nyxion & Virelya. All Rights Reserved.',
  creator: 'Nyxion & Virelya',
  rights: 'All Rights Reserved',
  source: 'https://ashvault.ink',
  description: 'Original content from Ashvault'
};

const targetFile = process.env.ASHVAULT_IMAGE?.trim();

/**
 * Create SVG watermark text
 */
function createWatermarkSVG(text, width, height) {
  const fontSize = CONFIG.fontSize;
  const padding = CONFIG.padding;

  // Calculate text position based on image dimensions
  let x = width - padding;
  let y = height - padding;

  // Escape XML special characters
  const escapedText = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');

  const svg = `
    <svg width="${width}" height="${height}">
      <style>
        .watermark {
          fill: ${CONFIG.fontColor};
          opacity: ${CONFIG.watermarkOpacity};
          font-family: Arial, sans-serif;
          font-size: ${fontSize}px;
          font-weight: 600;
        }
      </style>
      <text x="${x}" y="${y}" text-anchor="end" class="watermark">${escapedText}</text>
    </svg>
  `;

  return Buffer.from(svg);
}

/**
 * Add watermark to a single image
 */
async function watermarkImage(imagePath, outputPath) {
  try {
    const image = sharp(imagePath);
    const metadata = await image.metadata();

    // Create watermark SVG
    const watermarkSVG = createWatermarkSVG(
      CONFIG.watermarkText,
      metadata.width,
      metadata.height
    );

    // Composite watermark onto image
    await image
      .composite([{
        input: watermarkSVG,
        blend: 'over'
      }])
      .withMetadata({
        exif: {
          IFD0: {
            Copyright: EXIF_METADATA.copyright,
            Artist: EXIF_METADATA.creator,
          }
        }
      })
      .toFile(outputPath);

    return true;
  } catch (error) {
    console.error(`Error watermarking ${imagePath}:`, error.message);
    return false;
  }
}

/**
 * Process all images in a directory
 */
async function processDirectory(dirPath) {
  const fullPath = join(process.cwd(), dirPath);

  if (!existsSync(fullPath)) {
    console.log(`⚠️  Directory not found: ${dirPath}`);
    return { processed: 0, failed: 0, skipped: 0 };
  }

  console.log(`\n📁 Processing: ${dirPath}`);

  const files = await readdir(fullPath);
  let processed = 0;
  let failed = 0;
  let skipped = 0;

  // Create backup directory if needed
  if (CONFIG.backupOriginals) {
    const backupDir = join(fullPath, 'originals');
    if (!existsSync(backupDir)) {
      await mkdir(backupDir, { recursive: true });
    }
  }

  for (const file of files) {
    const ext = extname(file).toLowerCase();

    if (!CONFIG.supportedFormats.includes(ext)) {
      continue;
    }

    if (targetFile && file !== targetFile) {
      continue;
    }

    const filePath = join(fullPath, file);
    const fileName = basename(file, ext);

    // Skip if already watermarked
    if (fileName.includes('-watermarked')) {
      skipped++;
      continue;
    }

    // Create watermarked version
    const watermarkedPath = join(fullPath, `${fileName}-watermarked${ext}`);

    console.log(`  ✨ Watermarking: ${file}`);
    const success = await watermarkImage(filePath, watermarkedPath);

    if (success) {
      processed++;
      console.log(`  ✅ Created: ${fileName}-watermarked${ext}`);

      // Optionally backup original
      if (CONFIG.backupOriginals) {
        const backupPath = join(fullPath, 'originals', file);
        await sharp(filePath).toFile(backupPath);
      }
    } else {
      failed++;
    }
  }

  return { processed, failed, skipped };
}

/**
 * Main execution
 */
async function main() {
  console.log('🎨 Ashvault Image Watermarking Tool');
  console.log('=====================================\n');
  console.log(`Watermark Text: "${CONFIG.watermarkText}"`);
  console.log(`Opacity: ${CONFIG.watermarkOpacity}`);
  console.log(`Position: ${CONFIG.position}\n`);
  if (targetFile) console.log(`Target file: ${targetFile}\n`);

  let totalProcessed = 0;
  let totalFailed = 0;
  let totalSkipped = 0;

  for (const dir of CONFIG.imageDirectories) {
    const stats = await processDirectory(dir);
    totalProcessed += stats.processed;
    totalFailed += stats.failed;
    totalSkipped += stats.skipped;
  }

  console.log('\n=====================================');
  console.log('📊 Summary:');
  console.log(`  ✅ Processed: ${totalProcessed}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log(`  ⏭️  Skipped: ${totalSkipped}`);
  console.log('\n✨ Watermarking complete!');

  if (CONFIG.backupOriginals) {
    console.log('\n💾 Original images backed up to "originals" folders');
  }
}

// Run the script
main().catch(console.error);
