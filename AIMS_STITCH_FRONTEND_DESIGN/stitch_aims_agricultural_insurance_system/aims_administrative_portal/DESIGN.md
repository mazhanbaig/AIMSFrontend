---
name: AIMS Administrative Portal
colors:
  surface: '#101412'
  surface-dim: '#101412'
  surface-bright: '#363a38'
  surface-container-lowest: '#0b0f0d'
  surface-container-low: '#181d1b'
  surface-container: '#1c211e'
  surface-container-high: '#262b29'
  surface-container-highest: '#313633'
  on-surface: '#e0e3e0'
  on-surface-variant: '#bec9c3'
  inverse-surface: '#e0e3e0'
  inverse-on-surface: '#2d312f'
  outline: '#88938e'
  outline-variant: '#3e4944'
  surface-tint: '#82d7ba'
  primary: '#82d7ba'
  on-primary: '#00382b'
  primary-container: '#006b54'
  on-primary-container: '#94e8cb'
  inverse-primary: '#016b54'
  secondary: '#c9c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c6c6c7'
  on-tertiary: '#2f3131'
  tertiary-container: '#5c5e5e'
  on-tertiary-container: '#d7d7d8'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9ef3d6'
  primary-fixed-dim: '#82d7ba'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#00513f'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c9c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e2e2e2'
  tertiary-fixed-dim: '#c6c6c7'
  on-tertiary-fixed: '#1a1c1c'
  on-tertiary-fixed-variant: '#454747'
  background: '#101412'
  on-background: '#e0e3e0'
  surface-variant: '#313633'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  code-sm:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 32px
  gutter: 24px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style

The design system for the AIMS Dashboard is built on a foundation of "Elite Precision." It serves administrative and staff management functions where clarity of data meets a high-end, executive aesthetic. The personality is professional, authoritative, and technologically advanced.

The visual style is a fusion of **Minimalism** and **Modern Corporate**, elevated by subtle **Glassmorphism** and "Emerald Glow" accents. High-contrast surfaces (Deep Black and Pure White) are softened by rhythmic spacing and pill-shaped interactive elements. The emotional response should be one of absolute control, security, and refined efficiency.

## Colors

The palette is strictly constrained to reinforce institutional authority and focus.

- **Primary (Dark Emerald):** Used for primary actions, active states, and brand-driven highlights.
- **Secondary (Obsidian Black):** The primary background color for the dark mode interface, creating a canvas for high-contrast data visualization.
- **Tertiary (Pure White):** Reserved for primary typography and high-emphasis icons to ensure maximum readability against the dark background.
- **Accent Glow:** A decorative emerald shadow/glow used sparingly to denote focus or elevated status.
- **Neutral/Borders:** Subtle greys are used for structural outlines to maintain a minimal footprint.

## Typography

This design system utilizes a tiered typography strategy to separate branding from utility:

1.  **Hanken Grotesk (Headlines):** High-precision, modern sans-serif for titles and display metrics.
2.  **Inter (Body):** The workhorse for administrative data, providing neutral and highly legible text for staff records.
3.  **Geist (Labels/Data):** A technical, developer-friendly font used for metadata, staff IDs, and status labels to evoke a sense of system-level accuracy.

Scale contrast is intentional; large headers provide clear section anchoring, while body text remains compact to allow for dense information density in management views.

## Layout & Spacing

The layout follows a **Fixed Grid** philosophy for desktop dashboards to ensure data columns remain predictable and scannable. 

- **Desktop:** 12-column grid with 24px gutters. Sidebars are fixed at 280px to allow the main content area to breathe.
- **Tablet:** 8-column grid with 16px gutters.
- **Mobile:** Single column with 16px side margins.

A rigorous 4px baseline grid governs all vertical rhythm. Content blocks should use "stack" variables (8, 16, 32px) to separate information logically, ensuring the interface feels airy despite the dark color palette.

## Elevation & Depth

In the dark obsidian environment of this design system, depth is communicated through **Tonal Layers** and **Subtle Glows** rather than traditional heavy shadows.

- **Level 0 (Base):** #0A0A0A (Black) - The primary background.
- **Level 1 (Cards):** #141414 - A slightly lighter obsidian for surface containers.
- **Level 2 (Popovers/Modals):** #1F1F1F - Higher contrast for floating elements.

**Emerald Glow:** Active elements or primary cards may feature a `1px` inner border of #006B54 or an outer soft glow (spread: 20px, opacity: 15%) to signify importance. This "light-source" effect mimics high-end hardware interfaces.

## Shapes

The shape language is a deliberate study in contrast:

- **Pill-Shaped (Strict):** All interactive elements including buttons, input fields, badges, and chips must use the maximum border radius (9999px). This provides a friendly, modern touch to the otherwise rigid administrative data.
- **Structural Radii:** Content containers and cards utilize a **16px** rounded corner. This creates a distinct visual hierarchy between "containers" (softer rectangles) and "actions" (pills).
- **Selection Indicators:** Tab highlights or selection bars should also utilize pill-shaped endings.

## Components

- **Buttons:** Primary buttons are #006B54 with White text. Secondary buttons are outlined with #1F1F1F and White text. All are strictly pill-shaped.
- **Staff Badges:** Use a pill-shaped background. Active staff use a Dark Emerald background with White text; inactive staff use a subtle grey outline.
- **Input Fields:** Dark background (#141414) with a 1px #1F1F1F border. On focus, the border transitions to #006B54 with a subtle emerald outer glow. Shapes are strictly pill-shaped.
- **Cards:** Background color #141414, 16px corner radius, and a subtle #1F1F1F border.
- **Lists:** Staff management lists should use horizontal dividers of 1px thickness in #1F1F1F, with ample padding (16px) between rows to maintain the minimal aesthetic.
- **Staff Avatars:** Always circular to complement the pill-shaped UI elements.