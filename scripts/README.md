# Ashvault Content Protection Tools

This directory contains scripts for protecting Ashvault's original content through watermarking and metadata embedding.

## 🛡️ Protection Layers

Ashvault content is protected through multiple layers:

### 1. **EXIF Metadata Embedding**
Invisible copyright information embedded in image files.

**Script:** `add-exif-metadata.js`

**What it does:**
- Adds copyright, creator, and attribution metadata to image files
- Metadata persists even when images are downloaded
- Readable by image viewers and metadata tools

**Metadata added:**
- Copyright: © 2025 Nyxion & Virelya. All Rights Reserved.
- Artist/Creator: Nyxion & Virelya
- Source: https://ashvault.ink
- Rights: All Rights Reserved
- Usage Terms: Unauthorized use prohibited

**Usage:**
```bash
npm run add-exif
```

### 2. **Visual Watermarking**
Semi-transparent text overlays on images.

**Script:** `watermark-images.js`

**What it does:**
- Adds visible watermark text to corner of images
- Creates watermarked versions with `-watermarked` suffix
- Backs up originals to `originals/` folders
- Preserves EXIF metadata in watermarked versions

**Watermark settings:**
- Text: "© 2025 Nyxion & Virelya | ashvault.ink"
- Position: Southeast (bottom-right)
- Opacity: 30%
- Font size: 24px

**Usage:**
```bash
npm run watermark
```

### 3. **Combined Protection**
Run both scripts in sequence for complete protection.

**Usage:**
```bash
npm run protect-images
```

## 📁 Directories Processed

Both scripts process images in:
- `public/images/relics/`
- `public/images/scrolls/`
- `public/images/artifacts/`
- `public/images/relics-sealed/`

## 🎨 Supported Formats

- PNG (.png)
- JPEG (.jpg, .jpeg)
- WebP (.webp)

## 🔧 Configuration

### Watermark Configuration
Edit `CONFIG` object in `watermark-images.js`:

```javascript
const CONFIG = {
  watermarkText: '© 2025 Nyxion & Virelya | ashvault.ink',
  watermarkOpacity: 0.3,
  fontSize: 24,
  fontColor: '#ffffff',
  position: 'southeast',
  padding: 20,
  backupOriginals: true,
  // ...
};
```

### EXIF Metadata Configuration
Edit `CONFIG.metadata` in `add-exif-metadata.js`:

```javascript
metadata: {
  Copyright: '© 2025 Nyxion & Virelya. All Rights Reserved.',
  Artist: 'Nyxion & Virelya',
  // ...
}
```

## 📊 Output Examples

### Before Protection:
```
public/images/relics/
  ├── pulse-stone.png (no metadata, no watermark)
```

### After Protection:
```
public/images/relics/
  ├── pulse-stone.png (with EXIF metadata)
  ├── pulse-stone-watermarked.png (metadata + visual watermark)
  └── originals/
      └── pulse-stone.png (backup)
```

## 🚀 Workflow

When adding new images to Ashvault:

1. Add original images to appropriate directory
2. Run protection scripts:
   ```bash
   npm run protect-images
   ```
3. Update content references to use watermarked versions (optional)
4. Commit both original and watermarked versions

## ⚠️ Important Notes

- **Backup originals:** Scripts create backups in `originals/` folders
- **Watermarked versions:** Have `-watermarked` suffix for easy identification
- **EXIF metadata:** Added to both original and watermarked versions
- **Reversible:** Original files are always preserved

## 🔍 Verifying Protection

### Check EXIF Metadata:
```bash
# Using exiftool
exiftool public/images/relics/pulse-stone.png

# Look for:
# Copyright: © 2025 Nyxion & Virelya. All Rights Reserved.
# Artist: Nyxion & Virelya
```

### Check Watermark:
Open any `-watermarked.png` file and look for semi-transparent text in the bottom-right corner.

## 📝 Additional Protection Layers

Beyond these scripts, Ashvault is protected through:

1. **LICENSE File:** Formal copyright declaration in repository root
2. **Copyright Footer:** Displayed on all pages via `CopyrightFooter.astro` component
3. **Content Schemas:** Copyright and license fields in all content collections
4. **HTML Comments:** Hidden ownership metadata in layouts

## 🆘 Troubleshooting

### "xmlParseEntityRef" errors:
- Fixed! Special characters in watermark text are now properly escaped

### Images not processing:
- Check file extensions match supported formats
- Ensure image directories exist
- Verify images aren't corrupt

### EXIF metadata not showing:
- Some image viewers don't display all metadata
- Use `exiftool` for comprehensive metadata viewing

## 📚 Dependencies

- **sharp**: High-performance image processing
- **exiftool-vendored**: EXIF metadata embedding

Both installed automatically via `npm install`.

---

**Created for:** Ashvault Content Protection
**Authors:** Nyxion & Virelya
**Last Updated:** 2025-01-01
