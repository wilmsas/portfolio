# Dark Mode Implementation Guide

This document describes the dark mode implementation in the portfolio site, with a focus on the Design Skills Matrix.

## Overview

The site now supports three theme modes:
- **Light mode**: Clean white backgrounds with dark text
- **Dark mode**: Dark navy backgrounds (`oklch(0.18 0.02 250)`) with light text
- **System**: Automatically matches the user's OS preference

## Theme Infrastructure

### ThemeProvider
Located in `components/ThemeProvider.tsx`, this wraps the entire application and provides theme context using `next-themes`.

```tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange={false}
>
  <SiteShell>{children}</SiteShell>
</ThemeProvider>
```

### ThemeToggle
A toggle component (`components/ThemeToggle.tsx`) allows users to manually switch between light/dark/system modes.

### CSS Variables Structure

The theme uses CSS custom properties defined in `app/globals.css`:

1. **`:root`** - Light mode variables (default)
2. **`.dark`** - Dark mode variables
3. **`@theme`** - Tailwind theme mapping

**Important**: The order matters! `:root` and `.dark` must come BEFORE `@theme` to ensure variables are available when Tailwind processes them.

## Color System

### Light Mode
- Background: `oklch(1 0 0)` (white)
- Foreground: `oklch(0.145 0 0)` (near black)
- Card: `oklch(1 0 0)` (white)
- Border: `oklch(0.922 0 0)` (light gray)

### Dark Mode
- Background: `oklch(0.18 0.02 250)` (dark navy)
- Foreground: `oklch(0.985 0 0)` (near white)
- Card: `oklch(0.22 0.02 250)` (slightly lighter navy)
- Border: `oklch(1 0 0 / 10%)` (white at 10% opacity)

## Using Theme Tokens

### In Components

Always use Tailwind theme tokens instead of hardcoded colors:

```tsx
// ✅ Good
<div className="bg-card text-foreground border-border">

// ❌ Bad
<div className="bg-white dark:bg-slate-800 text-black dark:text-white">
```

### In SVG Charts

For SVG elements that don't support Tailwind classes, use the `useTheme()` hook:

```tsx
import { useTheme } from "next-themes";

function MyChart() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <svg>
      <text fill={isDark ? "rgba(255,255,255,0.9)" : "rgb(40,40,40)"}>
        Label
      </text>
    </svg>
  );
}
```

## Skills Matrix Visualizations

### Chart Improvements

The `ProficiencyVisualized` component received significant enhancements:

1. **Size**: Increased from 520px to 700px (35% larger)
2. **Radial dimensions**:
   - Radar: maxR increased from 200 to 280
   - Polar: innerR 70→90, outerR 200→280
3. **Typography**: Competency labels increased from 12px to 14px
4. **Toggle buttons**: Larger touch targets (px-5, py-2, text-sm)

### Theme-Aware Rendering

Both radar and polar charts adapt to the theme:

**Light Mode:**
- Grid rings: `rgb(200,200,200)`
- Labels: `rgb(40,40,40)`
- Background segments: `rgb(240,240,240)` (polar only)

**Dark Mode:**
- Grid rings: `rgba(255,255,255,0.1)`
- Labels: `rgba(255,255,255,0.9)`
- Background segments: Hidden (polar only)

### Polar Chart Radial Separators

The polar chart now includes radial separator lines to clearly divide competency segments, matching the color and visibility of the circular grid rings.

## Transitions

Smooth transitions are enabled for theme changes:

```css
* {
  transition-property: background-color, border-color, color, fill, stroke;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
```

This creates a polished experience when switching between themes.

## Development Guidelines

### Adding New Components

1. **Use theme tokens**: Always prefer `bg-card`, `text-foreground`, etc.
2. **Test both themes**: Verify your component in light and dark modes
3. **Check contrast**: Ensure text meets WCAG AA standards in both themes
4. **Avoid hardcoded colors**: Use the design system colors

### Debugging Dark Mode

If dark mode isn't working:

1. Check that `suppressHydrationWarning` is on the `<html>` tag
2. Verify `ThemeProvider` wraps your app
3. Ensure CSS variables are defined in `:root` and `.dark`
4. Confirm `@theme` comes AFTER variable definitions in globals.css
5. Use browser DevTools to inspect which CSS variables are applying

### Common Patterns

**Conditional rendering based on theme:**
```tsx
const { resolvedTheme } = useTheme();
const isDark = resolvedTheme === "dark";

return isDark ? <DarkComponent /> : <LightComponent />;
```

**Conditional inline styles:**
```tsx
<element
  fill={isDark ? "rgba(255,255,255,0.9)" : "rgb(40,40,40)"}
  stroke={isDark ? "rgba(255,255,255,0.1)" : "rgb(200,200,200)"}
/>
```

## Browser Support

Dark mode works in all modern browsers that support:
- CSS custom properties
- `prefers-color-scheme` media query
- JavaScript `matchMedia` API

## Accessibility

- **Contrast ratios**: All text meets WCAG AA standards (4.5:1 for normal text, 3:1 for large text)
- **Respects user preferences**: System theme mode honors OS settings
- **Smooth transitions**: Disabled on first load to prevent flash, enabled afterward
- **Focus indicators**: Visible in both light and dark modes

## References

- [next-themes documentation](https://github.com/pacocoursey/next-themes)
- [Tailwind CSS v4 theme configuration](https://tailwindcss.com/docs/theme)
- [OKLCH color space](https://oklch.com/)
- [shadcn/ui theming](https://ui.shadcn.com/docs/theming)
