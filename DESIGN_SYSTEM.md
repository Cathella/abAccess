# ABA Access Design System

## Overview
This document describes the design system for ABA Access, a healthcare application built with Next.js, Tailwind CSS v4, and shadcn/ui.

## Color Palette

### Brand Colors

#### Primary (Green)
The primary green color represents health, growth, and wellness.

- **primary-900**: `#32C28A` - Main primary color (default)
- **primary-800**: `#3ACD93` - Lighter variant
- **primary-700**: `#56D8A8` - Lightest variant
- **primary-100**: `#DFF7EE` - Light background

**Usage:**
```tsx
// Using Tailwind classes
<button className="bg-primary-900 text-white">Primary Button</button>
<div className="bg-primary-100 text-primary-900">Light background</div>

// Using CSS variables
<button className="bg-primary">Primary Button</button>
```

#### Secondary (Blue)
The secondary blue color represents trust, reliability, and professionalism.

- **secondary-900**: `#3A8DFF` - Main secondary color
- **secondary-100**: `#E8F2FF` - Light background

**Usage:**
```tsx
<button className="bg-secondary-900 text-white">Secondary Button</button>
<div className="bg-secondary-100 text-secondary-900">Info card</div>
```

### UI Colors

The design system uses shadcn/ui color tokens that adapt to light and dark modes:

- **background** - Page background
- **foreground** - Main text color
- **card** - Card backgrounds
- **primary** - Primary brand color (uses green #32C28A)
- **secondary** - Secondary UI elements
- **muted** - Muted/disabled elements
- **accent** - Accent highlights
- **destructive** - Error/destructive actions
- **border** - Border colors
- **input** - Input field borders
- **ring** - Focus ring color (uses primary green)

## Using the Color System

### Tailwind Classes

```tsx
// Brand colors
<div className="bg-primary-900">Primary green</div>
<div className="bg-primary-800">Lighter green</div>
<div className="bg-primary-700">Lightest green</div>
<div className="bg-primary-100">Light background</div>

<div className="bg-secondary-900">Secondary blue</div>
<div className="bg-secondary-100">Light blue background</div>

// UI colors (auto-adapt to light/dark mode)
<div className="bg-primary text-primary-foreground">Primary button</div>
<div className="bg-secondary text-secondary-foreground">Secondary element</div>
<div className="border-border">Border</div>
<div className="text-muted-foreground">Muted text</div>
```

### Component Examples

#### Buttons
```tsx
// Primary button
<button className="bg-primary hover:bg-primary-800 text-primary-foreground">
  Click me
</button>

// Secondary button
<button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground">
  Secondary
</button>
```

#### Cards
```tsx
<div className="bg-card border-border text-card-foreground rounded-lg p-4">
  <h3 className="text-foreground">Card Title</h3>
  <p className="text-muted-foreground">Card description</p>
</div>
```

#### Status Indicators
```tsx
// Success (using primary green)
<div className="bg-primary-100 text-primary-900 border-primary-700">
  Success message
</div>

// Info (using secondary blue)
<div className="bg-secondary-100 text-secondary-900 border-secondary-900">
  Info message
</div>
```

## Dark Mode

The color system automatically adapts to dark mode. All colors are defined for both light and dark themes in `app/globals.css`.

To toggle dark mode:
```tsx
import { useTheme } from "next-themes"

function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
      Toggle theme
    </button>
  )
}
```

## Typography

The design system uses Geist Sans and Geist Mono fonts (loaded via next/font/google).

- **Font Sans**: Geist Sans (default body font)
- **Font Mono**: Geist Mono (code and monospace)

**Usage:**
```tsx
<p className="font-sans">Regular text</p>
<code className="font-mono">Code snippet</code>
```

## Border Radius

Consistent border radius tokens:

- **radius-sm**: Small radius
- **radius-md**: Medium radius
- **radius-lg**: Large radius (default)
- **radius-xl**: Extra large
- **radius-2xl**: 2X large
- **radius-3xl**: 3X large
- **radius-4xl**: 4X large

**Usage:**
```tsx
<div className="rounded-lg">Default rounded</div>
<div className="rounded-xl">Extra rounded</div>
```

## Best Practices

1. **Use semantic color names**: Prefer `bg-primary` over `bg-primary-900` when using the main brand color
2. **Respect light/dark mode**: Use the UI color tokens (primary, secondary, etc.) that auto-adapt
3. **Use brand colors for accents**: Use primary-900 for main CTAs, secondary-900 for secondary actions
4. **Light backgrounds**: Use primary-100 and secondary-100 for subtle backgrounds
5. **Maintain contrast**: Ensure text has sufficient contrast against backgrounds

## Customization

To modify colors, edit `app/globals.css`:

1. **Brand colors**: Update the hex values in the `@theme inline` section
2. **UI colors**: Update the OKLCH values in `:root` and `.dark` sections
3. **Rebuild**: Run `npm run build` to regenerate styles

## shadcn/ui Integration

All shadcn/ui components automatically use the design system colors. No additional configuration needed.

Components like Button, Card, Badge, etc. will use the primary green for primary variants and adapt to light/dark modes automatically.
