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

### Neutral (Grays)
The neutral color palette provides a full range of grays for text, backgrounds, and UI elements.

- **neutral-900**: `#1A1A1A` - Text primary (darkest)
- **neutral-800**: `#2E2E2E` - Dark background (dark mode cards)
- **neutral-700**: `#4A4F55` - Dark gray (dark mode borders)
- **neutral-600**: `#8F9AA1` - Medium gray (muted text)
- **neutral-500**: `#C9D0DB` - Light medium gray
- **neutral-400**: `#E5E8EC` - Light gray (borders, dividers)
- **neutral-200**: `#F7F9FC` - Very light gray (backgrounds)
- **neutral-100**: `#FFFFFF` - White

**Usage:**
```tsx
<p className="text-neutral-900">Primary text</p>
<p className="text-neutral-600">Secondary text</p>
<div className="bg-neutral-200 border border-neutral-400">Light background</div>
<div className="divide-y divide-neutral-400">Divider</div>
```

### Semantic Colors

#### Success (Green)
Used for success states, confirmations, and positive actions.

- **success-900**: `#38C172` - Main success color
- **success-100**: `#E9F8F0` - Light success background

**Usage:**
```tsx
<div className="bg-success-100 text-success-900 border border-success-900 rounded-lg p-4">
  <p>✓ Operation completed successfully</p>
</div>
```

#### Warning (Yellow/Orange)
Used for warnings, alerts, and cautionary states.

- **warning-900**: `#FFB649` - Main warning color
- **warning-100**: `#FFF3DC` - Light warning background

**Usage:**
```tsx
<div className="bg-warning-100 text-warning-900 border border-warning-900 rounded-lg p-4">
  <p>⚠ Please review your information</p>
</div>
```

#### Error (Red)
Used for errors, destructive actions, and critical states.

- **error-900**: `#E44F4F` - Main error color
- **error-100**: `#FDECEC` - Light error background

**Usage:**
```tsx
<div className="bg-error-100 text-error-900 border border-error-900 rounded-lg p-4">
  <p>✕ An error occurred</p>
</div>

// Destructive button
<button className="bg-destructive text-destructive-foreground">
  Delete Account
</button>
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

// Neutral colors
<p className="text-neutral-900">Primary text</p>
<p className="text-neutral-600">Secondary text</p>
<div className="bg-neutral-200">Light background</div>
<div className="border-neutral-400">Border</div>

// Semantic colors
<div className="bg-success-100 text-success-900">Success state</div>
<div className="bg-warning-100 text-warning-900">Warning state</div>
<div className="bg-error-100 text-error-900">Error state</div>

// UI colors (auto-adapt to light/dark mode)
<div className="bg-primary text-primary-foreground">Primary button</div>
<div className="bg-secondary text-secondary-foreground">Secondary element</div>
<div className="bg-destructive text-destructive-foreground">Destructive action</div>
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
// Success
<div className="bg-success-100 text-success-900 border border-success-900 rounded-lg p-4">
  ✓ Operation completed successfully
</div>

// Warning
<div className="bg-warning-100 text-warning-900 border border-warning-900 rounded-lg p-4">
  ⚠ Please review your information
</div>

// Error
<div className="bg-error-100 text-error-900 border border-error-900 rounded-lg p-4">
  ✕ An error occurred
</div>

// Info (using secondary blue)
<div className="bg-secondary-100 text-secondary-900 border border-secondary-900 rounded-lg p-4">
  ℹ Information message
</div>
```

## Typography

The design system uses **Geist** from Google Fonts as the primary typeface, providing a modern and professional look.

### Font Family

- **Font Sans**: Geist (default for all text)
- **Font Mono**: Geist Mono (for code and monospace content)

The fonts are loaded via `next/font/google` and applied globally through CSS variables:
- `--font-geist-sans`
- `--font-geist-mono`

### Text Styles

The design system provides consistent text styles for all typography needs:

#### Headings

**H1 - Main Heading**
- Size: 48px
- Line Height: Auto
- Font Weight: 700 (Bold)

```tsx
<h1>Main Heading</h1>
// or
<p className="text-h1">Main Heading</p>
```

**H2 - Section Heading**
- Size: 24px
- Line Height: 160% (38.4px)
- Font Weight: 700 (Bold)

```tsx
<h2>Section Heading</h2>
// or
<p className="text-h2">Section Heading</p>
```

**H3 - Subsection Heading**
- Size: 20px
- Line Height: Auto
- Font Weight: 700 (Bold)

```tsx
<h3>Subsection Heading</h3>
// or
<p className="text-h3">Subsection Heading</p>
```

#### Body Text

**Bold Text**
- Size: 16px
- Line Height: 160% (25.6px)
- Font Weight: 700 (Bold)

```tsx
<p className="text-bold">Bold emphasis text</p>
```

**Body Text (Default)**
- Size: 16px
- Line Height: 160% (25.6px)
- Font Weight: 400 (Regular)

```tsx
<p className="text-body">Regular body text</p>
// or just
<p>Regular body text</p>
```

#### Small Text

**Small Bold**
- Size: 14px
- Line Height: 140% (19.6px)
- Font Weight: 700 (Bold)

```tsx
<p className="text-sm-bold">Small bold text</p>
```

**Small Body**
- Size: 14px
- Line Height: 140% (19.6px)
- Font Weight: 400 (Regular)

```tsx
<p className="text-sm-body">Small body text</p>
```

### Typography Usage Examples

```tsx
// Page header
<div>
  <h1>Welcome to ABA Access</h1>
  <p className="text-body text-muted-foreground">
    Manage your healthcare packages with ease
  </p>
</div>

// Card with different text styles
<div className="bg-card p-6 rounded-lg">
  <h2>Your Packages</h2>
  <p className="text-bold text-foreground">Premium Healthcare Plan</p>
  <p className="text-body text-muted-foreground">
    Access to over 100 healthcare facilities
  </p>
  <p className="text-sm-body text-neutral-600">
    Valid until December 2025
  </p>
</div>

// Button with text styles
<button className="bg-primary text-primary-foreground">
  <span className="text-bold">Get Started</span>
</button>
```

### Typography Components

The design system provides pre-built typography components for consistent text rendering:

```tsx
import { H1, H2, H3, Text, Muted, Small, Lead } from "@/components/ui/typography";

// Headings
<H1>Main Page Heading</H1>
<H2>Section Heading</H2>
<H3>Subsection Heading</H3>

// Text with variants
<Text>Default body text (16px, 160%, regular)</Text>
<Text variant="bold">Bold body text (16px, 160%, bold)</Text>
<Text variant="small">Small text (14px, 140%, regular)</Text>
<Text variant="small-bold">Small bold text (14px, 140%, bold)</Text>

// Polymorphic rendering
<Text as="span">Rendered as span</Text>
<Text as="div">Rendered as div</Text>

// Specialized variants
<Muted>Secondary descriptive text (muted foreground)</Muted>
<Small>Helper text or captions (small + muted)</Small>
<Lead>Introductory paragraph (bold + muted)</Lead>

// Override with className
<H1 className="text-primary-900">Colored heading</H1>
<Text className="text-center">Centered text</Text>
```

**Component Features:**
- Automatic style application from design system
- Support for `className` prop to override or extend styles
- Polymorphic `as` prop for semantic HTML flexibility
- Full TypeScript support with proper types
- Consistent with light/dark mode color tokens

**Additional Components:**
```tsx
import { InlineCode, Blockquote, List, OrderedList } from "@/components/ui/typography";

<InlineCode>const code = "example";</InlineCode>
<Blockquote>Inspirational quote about healthcare</Blockquote>
<List>
  <li>List item 1</li>
  <li>List item 2</li>
</List>
<OrderedList>
  <li>First step</li>
  <li>Second step</li>
</OrderedList>
```

### Typography Best Practices

1. **Use typography components**: Prefer `<H1>`, `<Text>`, etc. components over raw HTML for consistent styling
2. **Use semantic HTML**: Components render semantic tags (h1, h2, h3, p) for accessibility
3. **Maintain hierarchy**: Use heading levels in order (H1 → H2 → H3) for proper document structure
4. **Polymorphic when needed**: Use `as` prop only when semantic HTML differs from visual styling
5. **Combine with color tokens**: Components use design system colors, override with `className` when needed
6. **Line height for readability**: Body text uses 160% line height for optimal readability
7. **Use Muted and Small**: Leverage specialized components for secondary text instead of manual styling

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
4. **Use semantic colors for states**:
   - Use `success-*` colors for positive feedback
   - Use `warning-*` colors for cautions and alerts
   - Use `error-*` colors for errors and destructive actions
   - Use `destructive` UI token for delete/remove buttons (auto-adapts to theme)
5. **Use neutral colors consistently**:
   - `neutral-900` for primary text
   - `neutral-600` for secondary/muted text
   - `neutral-400` for borders and dividers
   - `neutral-200` for subtle backgrounds
6. **Light backgrounds**: Use primary-100, secondary-100, and semantic-100 colors for subtle status backgrounds
7. **Maintain contrast**: Ensure text has sufficient contrast against backgrounds (WCAG AA minimum)
8. **Avoid mixing direct and semantic colors**: Either use direct colors (primary-900) or semantic tokens (bg-primary), not both in the same component

## Customization

To modify colors, edit `app/globals.css`:

1. **Brand colors**: Update the hex values in the `@theme inline` section
2. **UI colors**: Update the OKLCH values in `:root` and `.dark` sections
3. **Rebuild**: Run `npm run build` to regenerate styles

## shadcn/ui Integration

All shadcn/ui components automatically use the design system colors. No additional configuration needed.

Components like Button, Card, Badge, etc. will use the primary green for primary variants and adapt to light/dark modes automatically.
