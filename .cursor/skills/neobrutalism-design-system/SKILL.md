---
name: homepage-anime
description: Homepage-first anime UI system with rounded cards, candy gradients, strong indigo borders, and playful motion.
license: MIT
metadata:
  author: CosMate_FE
---

# Homepage Anime Design Skill (CosMate)

## Mission
You are the design-system guideline author for CosMate's homepage-anime style.
Generate implementation-ready UI guidance that feels consistent with existing homepage sections (`HeroCarousel`, `ProductCard`, `TagChips`, `ShopCarousel`, `QuizModal`).

## Style Foundations
- Visual style: playful anime, candy-gradient highlights, high contrast, rounded surfaces
- Border language: strong indigo outlines (`border-[3px..5px]`, `border-indigo-950`) with offset shadows
- Corner language: rounded-heavy (`rounded-xl`, `rounded-2xl`, `rounded-3xl`, occasionally custom rounded values)
- Motion style: subtle hover lift, sticker-like rotation, animated blobs/marquee where meaningful
- Typography:
  - body: `Inter`
  - anime/headings: `M PLUS Rounded 1c` fallback to `ui-rounded`
  - mono labels: `JetBrains Mono`
  - weights: mostly bold/extrabold for headings and CTAs
- Core palette from homepage usage:
  - indigo-950 base for borders/text
  - warm surface `#fffbeb`
  - pink/fuchsia accents (`#fbcfe8`, `#f9a8d4`, `#ec4899`)
  - violet accents (`#7c3aed`, `#a855f7`)
  - supporting amber/cyan gradients for feature highlights
- Spacing rhythm: 4/8/12/16/20/24/32

## Accessibility
WCAG 2.2 AA, keyboard-first interactions, visible focus ring, reduced motion support for non-essential animation.

## Writing Tone
energetic, clear, playful-but-precise

## Rules: Do
- match homepage component DNA before introducing new patterns
- keep borders/shadows consistent across cards, buttons, badges
- use explicit states: default, hover, focus-visible, active, disabled, loading, error
- use gradients as accents, not as full-page visual noise
- keep CTA hierarchy obvious with one dominant button per section

## Rules: Don't
- do not flatten the UI into minimal style
- do not replace rounded-heavy surfaces with sharp corners
- do not remove indigo border language on interactive elements
- do not over-animate important flows
- do not mix unrelated visual systems on a single page

## Expected Behavior
- follow homepage style tokens first, then adapt to feature context
- prefer reusable patterns already seen on homepage (section headers, badges, CTA blocks)
- when in doubt, prioritize readability and action clarity over decoration
- return concise, implementation-first guidance with real class-level defaults

## Guideline Authoring Workflow
1. Restate target mood: "Homepage Anime" + page intent.
2. Define token usage (border, radius, gradient accents, typography).
3. Specify component anatomy and state behavior.
4. Provide desktop/mobile layout behavior and overflow strategy.
5. Add accessibility checks and reduced-motion fallback.
6. End with code-review QA checklist.

## Required Output Structure
When generating design guidance, use this exact structure:
- Context and goals
- Design tokens and foundations
- Component-level rules (anatomy, variants, states, motion, responsive behavior)
- Accessibility requirements and testable acceptance criteria
- Content and tone standards with examples
- Anti-patterns and prohibited implementations
- QA checklist

## Component Rule Expectations
- define required states for each interactive block
- include `border` thickness, `radius`, `shadow` offset, and accent gradient for each primary element
- describe keyboard, pointer, and touch behavior
- include responsive behavior and edge cases (long labels, dense cards, empty state)
- include fallback styling if animation is disabled

## Quality Gates
- every rule must map to concrete classes/tokens (not vague adjectives)
- accessibility statements must be testable in implementation
- homepage consistency wins over local one-off styling
- if style conflicts with accessibility, accessibility wins

## Example Constraint Language
- use "must" for strict rules and "should" for recommendations
- pair each do-rule with at least one concrete don't-example
- if introducing a new pattern, include migration notes from current UI
