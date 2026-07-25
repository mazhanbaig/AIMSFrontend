---
name: AIMS Dashboard
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#3e4944'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#6f7a74'
  outline-variant: '#bec9c3'
  surface-tint: '#016b54'
  primary: '#00513f'
  on-primary: '#ffffff'
  primary-container: '#006b54'
  on-primary-container: '#94e8cb'
  inverse-primary: '#82d7ba'
  secondary: '#855300'
  on-secondary: '#ffffff'
  secondary-container: '#fea619'
  on-secondary-container: '#684000'
  tertiary: '#920028'
  on-tertiary: '#ffffff'
  tertiary-container: '#be0037'
  on-tertiary-container: '#ffcccd'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#9ef3d6'
  primary-fixed-dim: '#82d7ba'
  on-primary-fixed: '#002118'
  on-primary-fixed-variant: '#00513f'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#ffdada'
  tertiary-fixed-dim: '#ffb3b6'
  on-tertiary-fixed: '#40000c'
  on-tertiary-fixed-variant: '#920028'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 14px
rounded:
  sm: 0.5rem
  DEFAULT: 1rem
  md: 1.5rem
  lg: 2rem
  xl: 3rem
  full: 9999px
spacing:
  sidebar-width: 240px
  header-height: 64px
  container-padding: 2rem
  gutter: 1.5rem
  stack-sm: 0.5rem
  stack-md: 1rem
---

## Brand & Style
The design system for the dashboard experience is centered on efficiency, clarity, and a premium administrative feel. It targets professional users who require high-density information presented with surgical precision. The style is **Corporate Modern** with a focus on high-clarity functional areas and distinct surface layering.

By utilizing a neutral, low-contrast background against high-contrast interactive elements, the UI directs focus toward data and primary actions. The aesthetic is clean and systematic, ensuring that the heavy use of "pill" shapes for interactions provides a friendly, approachable touch to an otherwise rigorous professional environment.

## Colors
The color strategy employs a core **Dark Emerald Green** for primary actions and brand identity. The background uses a specific cool-gray (#F9FAFB) to provide a non-distracting canvas that allows white card surfaces to "pop" via elevation and contrast.

- **Primary (#006B54):** Used for primary buttons, active states, and brand-critical icons.
- **Success/Warning/Error:** Mapped to Emerald (#10B981), Amber (#F59E0B), and Rose (#E11D48) respectively. These should be used for status badges, utilizing a 10% opacity background of the same hue for "soft" indicators.
- **Neutral:** A systematic scale of grays handles borders, secondary text, and iconography to maintain a balanced visual hierarchy.

## Typography
This design system pairs **Geist** for headlines and UI labels with **Inter** for body text and data entry. Geist provides a technical, precise character for navigation and headers, while Inter ensures maximum legibility for long-form content and data grids.

For the dashboard context, use `label-sm` for table headers and section overviews to create clear visual separation. `headline-lg` is reserved for page titles within the header or top of the content area.

## Layout & Spacing
The layout follows a **Fixed-Fluid hybrid model**. 

- **Sidebar:** Fixed at 240px. On collapse, it reduces to 64px, showing only icons. It remains fixed to the left viewport edge.
- **Header:** Fixed at 64px height, spanning the width of the viewport minus the sidebar width.
- **Main Content:** A fluid area using a 12-column grid. On desktop, side margins are 32px (2rem). On mobile, margins reduce to 16px (1rem).
- **Spacing Rhythm:** Based on an 8px scale. Use 16px (stack-md) for vertical spacing between most components and 24px (gutter) for horizontal separation between cards.

## Elevation & Depth
Depth is created through **Tonal Layering** and **Ambient Shadows**. 

1.  **Level 0 (Background):** #F9FAFB.
2.  **Level 1 (Cards/Sidebar):** White (#FFFFFF) with a 1px border (#E5E7EB) and a very soft, diffused shadow (0px 1px 3px rgba(0,0,0,0.05)).
3.  **Level 2 (Dropdowns/Modals):** White (#FFFFFF) with a more pronounced shadow (0px 10px 15px -3px rgba(0,0,0,0.1)) to indicate focus.

Avoid heavy black shadows; instead, use low-opacity neutral tints to maintain the clean, "Airy" feel of the dashboard.

## Shapes
The shape language is a defining characteristic of the design system, utilizing a high-contrast rounding strategy:

- **Interactive Elements:** All buttons, input fields, tags, and badges must use a **Pill-style (fully rounded)** radius. This creates a distinct "capsule" look for every touchpoint.
- **Structural Containers:** Cards and primary content containers use a **16px** radius. This ensures the structural layout feels sturdy and organized, providing a frame for the more fluid pill-shaped elements inside.
- **Selection Indicators:** Use a 4px radius for subtle indicators like sidebar active-state markers.

## Components
- **Buttons:** Primary buttons are #006B54 with white text, fully pill-shaped. Secondary buttons use a subtle gray border with the primary color for text.
- **Inputs:** Search bars and form fields use the pill shape with a 1px #E5E7EB border. Focus states should use a 2px primary color ring.
- **Cards:** Must have a white background, 16px rounded corners, and a subtle border. Use cards to group related data sets or form sections.
- **Badges/Tags:** Fully pill-shaped. For status (Success/Error), use a light tinted background with dark saturated text.
- **Sidebar Nav:** Items should have a pill-shaped hover/active state background that does not touch the edge of the sidebar (inset by 8px).
- **Data Tables:** Use a flat style inside cards. Rows should have a subtle hover effect (#F9FAFB) and no vertical borders between columns.