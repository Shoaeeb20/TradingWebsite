# Favicon Setup Instructions

## Required Files

Create these favicon files and place them in the `/public` folder:

### 1. favicon.ico (16x16, 32x32, 48x48)
- Standard browser favicon
- Place at: `/public/favicon.ico`

### 2. icon.png (32x32)
- Modern browsers
- Place at: `/public/icon.png`

### 3. apple-icon.png (180x180)
- iOS home screen icon
- Place at: `/public/apple-icon.png`

### 4. icon-192.png (192x192)
- Android home screen
- Place at: `/public/icon-192.png`

### 5. icon-512.png (512x512)
- High-res Android
- Place at: `/public/icon-512.png`

### 6. og-image.png (1200x630)
- Social media preview
- Place at: `/public/og-image.png`

## How to Create Favicons

### Option 1: Use Favicon Generator (Easiest)

1. Go to https://realfavicongenerator.net/
2. Upload a square logo/icon (512x512 recommended)
3. Customize settings
4. Download the package
5. Extract and place files in `/public` folder

### Option 2: Use Figma/Canva

1. Create a 512x512 design with:
   - 📊 Chart icon
   - 🇮🇳 Indian flag colors (saffron, white, green)
   - Or "PT" text with gradient
2. Export as PNG
3. Use https://favicon.io/ to generate all sizes

### Option 3: Simple Emoji Favicon

1. Go to https://favicon.io/emoji-favicons/
2. Search for "📊" or "📈"
3. Download and place in `/public`

## Recommended Design

**Colors:**
- Primary: #2563eb (Blue)
- Accent: #4f46e5 (Indigo)
- Background: White or gradient

**Icon Ideas:**
- 📊 Chart going up
- 🇮🇳 + 📈 (India + Trading)
- "PT" letters with gradient
- Rupee symbol (₹) with chart

## Quick Test

After adding files, test at:
- Browser tab: Should show favicon
- Bookmark: Should show icon
- Share on social: Should show og-image

## Current Status

✅ SEO metadata configured
✅ Manifest.json created
✅ Robots.txt created
✅ Sitemap generated
⏳ Favicon files needed (create and add to /public)
