/**
 * EXIF Metadata Embedding Script for Ashvault
 * Adds copyright and attribution metadata to images without visual modification
 *
 * Usage: node scripts/add-exif-metadata.js
 */

import { exiftool } from 'exiftool-vendored';
import { readdir } from 'fs/promises';
import { join, extname } from 'path';
import { existsSync } from 'fs';

// Configuration
const CONFIG = {
  imageDirectories: [
    'public/images/relics',
    'public/images/scrolls',
    'public/images/artifacts',
    'public/images/relics-sealed'
  ],
  supportedFormats: ['.png', '.jpg', '.jpeg', '.webp'],
  metadata: {
    Copyright: '© 2025 Nyxion & Virelya. All Rights Reserved.',
    Artist: 'Nyxion & Virelya',
    Creator: 'Nyxion & Virelya',
    Rights: 'All Rights Reserved',
    WebStatement: 'https://ashvault.ink',
    Source: 'https://ashvault.ink',
    Credit: 'Ashvault',
    UsageTerms: 'All Rights Reserved - Unauthorized use prohibited',
    AttributionURL: 'https://ashvault.ink',
    Comment: 'Original content from Ashvault. © 2025 Nyxion & Virelya.',
  }
};

/**
 * Add EXIF metadata to a single image
 */
async function addMetadataToImage(imagePath) {
  try {
    await exiftool.write(imagePath, CONFIG.metadata, {
      writeArgs: ['-overwrite_original']
    });
    return true;
  } catch (error) {
    console.error(`Error adding metadata to ${imagePath}:`, error.message);
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
    return { processed: 0, failed: 0 };
  }

  console.log(`\n📁 Processing: ${dirPath}`);

  const files = await readdir(fullPath);
  let processed = 0;
  let failed = 0;

  for (const file of files) {
    const ext = extname(file).toLowerCase();

    if (!CONFIG.supportedFormats.includes(ext)) {
      continue;
    }

    // Skip the originals directory
    if (file === 'originals') {
      continue;
    }

    const filePath = join(fullPath, file);

    console.log(`  🏷️  Adding metadata: ${file}`);
    const success = await addMetadataToImage(filePath);

    if (success) {
      processed++;
      console.log(`  ✅ Updated: ${file}`);
    } else {
      failed++;
    }
  }

  return { processed, failed };
}

/**
 * Main execution
 */
async function main() {
  console.log('🏷️  Ashvault EXIF Metadata Tool');
  console.log('=====================================\n');
  console.log('Adding metadata:');
  console.log(`  Copyright: ${CONFIG.metadata.Copyright}`);
  console.log(`  Artist: ${CONFIG.metadata.Artist}`);
  console.log(`  Source: ${CONFIG.metadata.Source}\n`);

  let totalProcessed = 0;
  let totalFailed = 0;

  for (const dir of CONFIG.imageDirectories) {
    const stats = await processDirectory(dir);
    totalProcessed += stats.processed;
    totalFailed += stats.failed;
  }

  console.log('\n=====================================');
  console.log('📊 Summary:');
  console.log(`  ✅ Processed: ${totalProcessed}`);
  console.log(`  ❌ Failed: ${totalFailed}`);
  console.log('\n✨ EXIF metadata embedding complete!');

  // Close exiftool process
  await exiftool.end();
}

// Run the script
main().catch(async (error) => {
  console.error('Fatal error:', error);
  await exiftool.end();
  process.exit(1);
});
