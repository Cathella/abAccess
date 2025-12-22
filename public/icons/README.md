# PWA Icons - Placeholder Icons Needed

This folder contains icons for the Progressive Web App. Currently, placeholder icons are needed.

## Required Icons

### Standard PWA Icons

These icons should feature the ABA Access logo (Activity icon in a green rounded square with "ABA Access" text or just the icon for smaller sizes).

- **icon-72x72.png** - 72x72px - Small icon
- **icon-96x96.png** - 96x96px - Small icon
- **icon-128x128.png** - 128x128px - Medium icon
- **icon-144x144.png** - 144x144px - Medium icon
- **icon-152x152.png** - 152x152px - Medium icon
- **icon-192x192.png** - 192x192px - Standard PWA icon
- **icon-384x384.png** - 384x384px - Large icon
- **icon-512x512.png** - 512x512px - Large PWA icon

### Maskable Icons

Maskable icons need extra padding (safe zone) around the main icon to ensure it displays correctly when the OS applies a mask (circle, squircle, etc.).

- **icon-192x192-maskable.png** - 192x192px with safe zone padding
- **icon-512x512-maskable.png** - 512x512px with safe zone padding

The safe zone should be approximately 40% padding on all sides. The icon should be centered and not extend beyond the safe zone.

### Apple Touch Icon

- **apple-touch-icon.png** - 180x180px - iOS home screen icon
  - Should have NO transparency (iOS doesn't support it)
  - Should have rounded corners pre-applied (iOS will NOT round it automatically in some contexts)

### Apple Splash Screens

Launch screens for various iOS device sizes with ABA Access branding:

- **apple-splash-2048-2732.png** - iPad Pro 12.9" (2048x2732px)
- **apple-splash-1668-2388.png** - iPad Pro 11" (1668x2388px)
- **apple-splash-1536-2048.png** - iPad (1536x2048px)
- **apple-splash-1242-2688.png** - iPhone 11 Pro Max, XS Max (1242x2688px)
- **apple-splash-1125-2436.png** - iPhone 11 Pro, X, XS (1125x2436px)
- **apple-splash-828-1792.png** - iPhone 11, XR (828x1792px)
- **apple-splash-750-1334.png** - iPhone 8, 7, 6 (750x1334px)

## Design Guidelines

### Colors
- Primary Green: `#32C28A`
- Background: White `#FFFFFF`
- Icon Background: Primary Green with white Activity icon

### Icon Design
1. Use the Activity icon from lucide-react
2. Place in a rounded square (border-radius: ~20% of size)
3. Primary green background (#32C28A)
4. White icon
5. For larger icons (512x512), can include "ABA Access" text below

### Maskable Icon Design
1. Create the standard icon design
2. Add 40% padding on all sides
3. Center the icon content
4. Ensure critical content stays within the safe zone
5. Background should be white or primary green

### Splash Screen Design
1. Center the large ABA Access logo
2. White background
3. Optional: Add tagline "Affordable healthcare for your family" below logo
4. Keep design simple and clean

## Tools for Generation

You can use these tools to generate icons:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [Real Favicon Generator](https://realfavicongenerator.net/)
- [Maskable.app](https://maskable.app/) - For testing maskable icons

## Temporary Placeholders

For development, you can use solid colored squares:
- 192x192px green (#32C28A) square
- 512x512px green (#32C28A) square
- Same for maskable versions
- 180x180px green square for Apple touch icon

These will work but won't look professional. Replace with proper branded icons before launch.
