---
name: AIMS
colors:
  surface: '#fbf9f8'
  surface-dim: '#dbdad9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f5f3f3'
  surface-container: '#efeded'
  surface-container-high: '#e9e8e7'
  surface-container-highest: '#e4e2e2'
  on-surface: '#1b1c1c'
  on-surface-variant: '#3e4944'
  inverse-surface: '#303031'
  inverse-on-surface: '#f2f0f0'
  outline: '#6f7a74'
  outline-variant: '#bec9c3'
  surface-tint: '#016b54'
  primary: '#00513f'
  on-primary: '#ffffff'
  primary-container: '#006b54'
  on-primary-container: '#94e8cb'
  inverse-primary: '#82d7ba'
  secondary: '#006b54'
  on-secondary: '#ffffff'
  secondary-container: '#8bf3d0'
  on-secondary-container: '#007058'
  tertiary: '#474646'
  on-tertiary: '#ffffff'
  tertiary-container: '#5f5e5e'
  on-tertiary-container: '#dbd8d7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef3d6'
  primary-fixed-dim: '#82d7ba'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#00513f'
  secondary-fixed: '#8ef6d3'
  secondary-fixed-dim: '#71d9b8'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#00513e'
  tertiary-fixed: '#e5e2e1'
  tertiary-fixed-dim: '#c9c6c5'
  on-tertiary-fixed: '#1c1b1b'
  on-tertiary-fixed-variant: '#474646'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e2'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.2'
  title-md:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  section-gap: 80px
---

## Brand & Style

This design system is built for a professional, high-trust environment focused on agricultural stability and financial security. The aesthetic is **Modern Corporate**, blending the reliability of enterprise software with a fresh, organic "emerald" vitality. 

The visual narrative centers on clarity and growth. We use a high-contrast foundation (Black, White, Emerald) to ensure the interface feels authoritative yet innovative. The style utilizes **Glassmorphism** subtly for overlays and **Minimalism** for data-heavy layouts, ensuring that complex agricultural insurance data remains legible and approachable.

**Emotional Response:**
- **Security:** Through stable, structured layouts.
- **Growth:** Through the intentional use of vibrant emerald accents and "glow" effects.
- **Precision:** Through clean typography and generous white space.

## Colors

The palette is anchored by **Dark Emerald Green**, representing the core of agriculture and financial stability.

- **Primary (#006B54):** Used for primary actions, branding, and structural headers.
- **Accent (#00876A):** A lighter, more vibrant emerald used for interactive states, focus rings, and soft glow effects to indicate activity.
- **Neutral Stack:** We use a strict hierarchy of #1A1A1A for high-contrast headings and #666666 for supporting body text to maintain a sophisticated editorial feel.
- **Backgrounds:** Pure white is the standard for cards and page backgrounds to maximize the "clean" aesthetic, while the dark #0A0A0A is reserved for high-impact footer sections or navigation sidebars.

## Typography

The typography system uses a pairing of **Inter** for its incredible legibility in data-dense environments and **Geist** for technical labels and monospaced-style data points.

- **Headings:** Utilize tight letter-spacing and bold weights in Inter to create a strong visual anchor.
- **Body:** Standardized on a 16px base with a generous 1.6 line height to ensure long-form insurance documents are easy to digest.
- **Labels:** We use Geist for tags, badges, and small UI metadata to provide a precise, modern technical feel that distinguishes data from narrative text.

## Layout & Spacing

This design system follows a **Modern Fluid Grid** approach for landing pages and a **Fixed Centered Grid** for authentication and focused workflows.

- **Landing Pages:** Use a 12-column grid with a 1280px max-width. Sections should have significant vertical breathing room (80px+) to maintain the premium, "clean" feel.
- **Auth/Utility Pages:** Content is centered in a 480px or 640px container to reduce eye-strain and improve focus.
- **Spacing Rhythm:** Based on an 8px baseline. All margins and paddings should be multiples of 8 (e.g., 16, 24, 32, 48, 64).

## Elevation & Depth

Hierarchy is established through **Tonal Layers** and **Soft Shadows**. 

1.  **Level 0 (Base):** Pure White (#FFFFFF) or very light grey for the background.
2.  **Level 1 (Cards):** Raised with a subtle, diffused shadow: `0px 4px 20px rgba(0, 0, 0, 0.05)`.
3.  **Level 2 (Overlays/Dropdowns):** Use a slightly heavier shadow and a backdrop blur (12px) if the element is floating over content.
4.  **Emerald Glow:** Interactive elements (buttons, active inputs) may utilize a soft outer glow `0px 0px 12px rgba(0, 135, 106, 0.2)` instead of a traditional shadow to emphasize the brand's accent color.

## Shapes

The shape language is defined by a **High-Contrast Geometry**. While layout containers (cards) use a refined 16px radius, all interactive elements follow a **strict pill-shaped (fully rounded)** rule.

- **Actionable Elements:** Buttons, Inputs, and Tags must always use a 9999px (pill) border-radius.
- **Structural Elements:** Cards and containers use a `1rem` (16px) radius to maintain a sense of stability and professional structure without appearing "too" soft.

## Components

### Buttons
All buttons are pill-shaped.
- **Primary:** Background #006B54, Text #FFFFFF. Hover state: #00876A with a soft emerald glow.
- **Secondary:** Transparent background with a 1.5px border of #006B54.

### Input Fields
Pill-shaped containers.
- **Style:** White background, 1px border (#E5E5E5).
- **Focus State:** Border changes to #00876A with a 4px outer glow of `rgba(0, 135, 106, 0.1)`.

### Cards
- **Construction:** White background, 16px corner radius.
- **Signature Detail:** A 4px solid top-border using the Primary Emerald (#006B54) to provide instant brand recognition.
- **Shadow:** Subtle `0 4px 20px rgba(0,0,0,0.05)`.

### Chips & Badges
- **Style:** Pill-shaped, Geist font, uppercase.
- **Color:** Soft emerald background `rgba(0, 107, 84, 0.1)` with Dark Emerald text.

### Icons
- Use **Lucide** or **Feather** style icons.
- **Stroke Width:** 2px.
- **Color:** Always use #00876A for functional icons to draw the eye to interactive touchpoints.