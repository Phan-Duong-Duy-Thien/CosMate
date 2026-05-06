---
name: Homepage Anime
colors:
  primary: "#FBCFE8"
  secondary: "#A855F7"
  indigoBase: "#1E1B4B"
  surfaceWarm: "#FFFBEB"
  surfacePink: "#FCE7F3"
  surfaceBlue: "#DBEAFE"
  ctaPink: "#EC4899"
  ctaFuchsia: "#C026D3"
  ctaCyan: "#22D3EE"
  ctaTeal: "#14B8A6"
  success: "#16A34A"
  warning: "#F59E0B"
  danger: "#DC2626"
  surface: "#FFFBEB"
  text: "#1E1B4B"
  neutral: "#FFFFFF"
typography:
  h1:
    fontFamily: "M PLUS Rounded 1c"
    fontSize: 2.4rem
    fontWeight: 800
  h2:
    fontFamily: "M PLUS Rounded 1c"
    fontSize: 1.75rem
    fontWeight: 800
  body-md:
    fontFamily: "Inter"
    fontSize: 0.9375rem
    fontWeight: 500
  label-caps:
    fontFamily: "JetBrains Mono"
    fontSize: 0.8125rem
  sourceScale: "12/13/15/17/21/28/38"
  weights: "100, 200, 300, 400, 500, 600, 700, 800, 900"
rounded:
  sm: 12px
  md: 16px
  lg: 24px
  xl: 28px
border:
  strong: "3px"
  hero: "4px"
  sticker: "5px"
shadow:
  card: "8px 8px 0 0 rgba(30,27,75,0.55)"
  cardHover: "12px 12px 0 0 rgba(236,72,153,0.45)"
  cta: "6px 6px 0 0 #1e1b4b"
spacing:
  sm: 4px
  md: 8px
  sourceScale: "4/8/12/16/20/24/32"
---

## Overview

Anime-forward homepage style with rounded geometry, bold indigo outlines, candy gradients, and playful card depth.

## Style Foundations

- **Visual style:** anime, playful, high-contrast, rounded-heavy
- **Typography scale:** 12/13/15/17/21/28/38
- **Typography fonts:** heading=M PLUS Rounded 1c, body=Inter, mono=JetBrains Mono
- **Typography weights:** default body 500, heading/CTA 700-800
- **Color language:** indigo borders + warm/pink surfaces + gradient accents
- **Corner language:** minimum rounded-xl for cards/buttons, rounded-2xl/3xl for major sections
- **Spacing scale:** 4/8/12/16/20/24/32

## Colors

- **Indigo Base (#1E1B4B):** Primary border/text anchor for homepage-style UI.
- **Surface Warm (#FFFBEB):** Default warm card/background surface.
- **Surface Pink (#FCE7F3):** Secondary soft anime surface.
- **Surface Blue (#DBEAFE):** Tertiary cool surface for layered gradients.
- **Primary Pink (#FBCFE8):** Friendly highlight blocks.
- **Secondary Violet (#A855F7):** Supporting accent and contrast partner.
- **CTA Pink/Fuchsia (#EC4899/#C026D3):** Primary action gradients.
- **CTA Cyan/Teal (#22D3EE/#14B8A6):** Alternative action gradients.
- **Success (#16A34A):** Positive feedback.
- **Warning (#F59E0B):** Caution state.
- **Danger (#DC2626):** Error/destructive state.

## Component Styling Rules

- **Cards:** must use `border-[3px..5px] border-indigo-950`, warm/gradient surfaces, and offset shadow.
- **Buttons:** must keep strong border + rounded-xl and include clear hover/active states.
- **Section headings:** should use icon badge + gradient title text + supportive description card.
- **Badges/chips:** should look like stickers (thick border, compact radius, strong fill).
- **Media blocks:** should include layered overlay gradients when text sits on imagery.

## Motion Rules

- Use subtle hover lift (`-translate-y-0.5` or `-translate-y-1`) and stronger hover shadow.
- Optional playful effects: tiny rotate on avatars/stickers, marquee only for overflow labels.
- Respect reduced motion preference: disable non-essential animations.

## Accessibility Rules

- Maintain WCAG 2.2 AA contrast for text and controls.
- All interactive components must have visible focus states.
- Motion must never block readability or interactions.

## QA Checklist

- Borders are consistently indigo and visually balanced across sections.
- Corner radius is rounded-heavy and consistent with homepage components.
- CTA hierarchy is clear (one dominant action per section).
- Hover/focus/active/disabled states are all visible and testable.
- Mobile layout preserves readability without cramped spacing.
