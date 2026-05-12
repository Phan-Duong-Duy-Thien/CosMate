---
name: cosmate-design-system
description: >-
  Enforces CosMate_FE UI design tokens (src/index.css), @/components/ui
  primitives, Tailwind-first layout, and Ant Design rules for legacy vs new
  surfaces. Use when implementing or reviewing UI, tokens, buttons, forms,
  Ant usage boundaries, feature component placement, pink vs primary accents,
  home-anime / cosplayer marketing shell (neobrutal) rules, or PR checklist
  for design consistency in CosMate_FE.
disable-model-invocation: true
---
# CosMate Design System — SKILL v2.4.0

## Objective

Establish and enforce a unified, scalable UI Design System across the CosMate project **without blocking current development**.

This system balances:
- Consistency (long-term goal)
- Practicality (current codebase reality)

---

## Core Principle

> Stop UI inconsistency from growing, while gradually refactoring legacy code.

---

## Source of Truth

### Design Tokens

Defined in:
src/index.css

Includes:
- :root variables
- @theme inline

Examples:
- --primary
- --background
- --foreground
- --muted

MUST use via Tailwind classes:

bg-primary  
text-foreground  
text-muted-foreground  
border-border  

NOTE:
- Only use classes mapped from `src/index.css` (`@theme` + `:root`)
- Do not invent class names

### Brand pink — CosMate emotional theme

CosMate pairs **`primary` (indigo / violet)** for default interactive emphasis with **pink family tokens** (`cosmate-pink`, `cosmate-soft-pink`, `cosmate-lavender-*`, `cosmate-mauve`, …) as the **emotional / marketing identity** of the product.

When refactoring or building UI:

- Pages and flows that are **policy, guidelines, onboarding hero, marketing**, or any surface that was **pink-first by design**: MUST keep **pink accents** using only mapped Tailwind classes (e.g. `text-cosmate-pink`, `bg-cosmate-soft-pink/…`, `border-cosmate-pink/…`, gradients composed from these tokens). MUST NOT replace those accents wholesale with `text-primary` / `bg-primary` / `border-primary` in a way that **drops the pink brand** and reads as “generic default theme”.
- Technical CTAs on neutral dashboards may still use `@/components/ui/button` defaults where product convention uses `primary`.
- Still **FORBIDDEN** by default: hardcoded hex, non-token color class names, inline color styles (except the narrow animation/dynamic exceptions in this skill). **Cosplayer `home-anime` shell:** see [dedicated section](#cosplayer--home-anime-marketing-shell) for transitional rules.

Reference: `src/features/general/pages/GuidelinesRulesPage.tsx` (`/guidelines-rules`); cosplayer order history `src/features/profile/pages/PurchaseHistoryPage.tsx` (`/profile/purchase-history`).

---

## Cosplayer / home-anime marketing shell

Many cosplayer-facing routes share a **playful neobrutal + pink/lavender marketing** look (thick outlines, offset shadows, soft gradients). The wrapper class **`home-anime`** appears on pages such as:

- `src/features/general/pages/HomePage.tsx` (`/`)
- `src/features/costume-rental/pages/CostumeListPage.tsx`, `CostumeDetailPage.tsx` (`/costumes`, `/costumes/:id`)
- `WishlistPage`, `NotificationsPage`, parts of `Photographer` / `Service` listings, `QuizModal`, etc.

This is **legacy-by-design debt** relative to strict “tokens only” rules. Use this section to **stop drift** and **converge** without blocking shipping.

### Approved semantics (until tokens land in `index.css`)

- **Neo outline (“mực viền”)**: `border-indigo-950` (and opacity variants like `border-indigo-950/20`) is an **accepted semantic** for this shell. Prefer it consistently for card/hero outlines. Long-term, map to a single CSS variable (e.g. `--cosmate-neo-ink`) in `src/index.css` and Tailwind `@theme` when added.
- **Offset shadows**: Patterns like `shadow-[12px_12px_0_0_rgba(30,27,75,0.33)]` are **allowed only inside this shell** while migrating. When touching styling, **do not invent new arbitrary RGBA families**; reuse the same indigo-ink family or consolidate into shared utilities in `index.css`.

### Page backgrounds (reduce drift)

Prefer one of these **documented** approaches for new or refactored cosplayer pages:

1. **Gradient page wash** (good default for full-height cosplayer flows):  
   `bg-[linear-gradient(180deg,#fff7fb_0%,#fdf2f8_45%,#f8fafc_100%)]` — already used on e.g. Wishlist / Notifications. When refactoring, replace hex stops with **`cosmate-soft-pink` / `cosmate-page` / `background`-family tokens** if equivalent stops exist or are added to `@theme`.
2. **Transparent shell**: `home-anime` + `bg-transparent` when the **parent layout** supplies the wash (list pages).
3. **Home hero base**: `bg-[#fff7fb]` on `HomePage` — **do not copy to new pages**; new surfaces should use (1) or tokens.

### Color & gradients inside the shell

- **MUST** keep pink / lavender **brand personality**; do not flatten to generic `primary`-only chrome.
- **SHOULD** prefer `cosmate-pink`, `cosmate-soft-pink`, `cosmate-lavender-*`, `cosmate-mauve`, `cosmate-ink` over raw Tailwind `pink-200` / `fuchsia-400` / ad-hoc hex **when editing or adding UI** in these files.
- Decorative blobs (e.g. `bg-fuchsia-400/40`) are **migration debt** — do not spread to unrelated features; prefer token-based soft blobs when refactoring.

### Motion

- Avoid inline `<style>` keyframes in pages when adding new animation; **prefer** `@keyframes` in `src/index.css` (or a single feature CSS entry) with a one-line comment for purpose.

### Buttons on these routes

These areas still use **`@/shared/components/Button`** (migration target): e.g. `HomePage`, `CostumeListPage`, `SortBar`, `FilterSidebar`, parts of costume cards. When editing:

- **Prefer** swapping to `@/components/ui/button` if variants align with existing CosMate button recipes (`cosmate`, `cosmateOutline`, etc.).
- **Do not** extend `shared/Button` or add parallel button primitives.

### Transitional rule vs “no hex”

- **New UI outside** this shell: hex and non-token palette shortcuts remain **forbidden** per [Styling Rules](#styling-rules).
- **Inside** `home-anime` surfaces: **do not add new hardcoded hex** without a plan to tokenize; when changing existing lines, **replace hex / one-off palette with design tokens** where feasible.

---

## UI Primitives

Canonical:
@/components/ui/*

Temporary:
@/shared/components/Button

Rules:
- MUST prioritize @/components/ui/*
- MUST NOT create new primitives outside this folder
- shared/Button is temporary
- DO NOT extend shared/Button
- DO NOT duplicate primitives into features

---

## Architecture (UI Scope Only)

Rule:
- Pages MUST NOT call HTTP directly
- Data access MUST go through hooks

---

## Ant Design Usage Strategy

### 1. Legacy vs New Code

#### Legacy (existing files)

- Allowed to use Ant components freely (existing patterns), including:
  Modal, Drawer, Input, Select, Tabs, Tag, Tooltip, Popconfirm,
  Steps, Descriptions, List, Avatar, Image, Statistic, Progress,
  Skeleton, Space, Divider, InputNumber, Checkbox, Menu, Dropdown,
  Layout, Result, Switch, Badge, etc.

Rules:
- Treat as migration debt
- When editing legacy files:
  - DO NOT introduce new UI using Row/Col/Card/Typography
  - Only modify or reuse existing patterns already present in that file

---

#### New UI Surfaces (NEW files or newly introduced UI in a file)

Applies to:
- New files
- New sections/components added to existing files
- Files already migrated to Tailwind-first approach

Definition:
- "Tailwind-first" = file primarily uses Tailwind + `@/components/ui/*` instead of Ant layout/components (decided by team convention or after refactor)

Allowed Ant components:

- Table
- Form
- DatePicker
- Upload
- Modal
- Drawer
- Input
- Select
- Spin
- Tabs
- Tag
- Tooltip
- Popconfirm
- Alert
- Empty
- Pagination
- Steps (for flows/wizards)
- message
- notification

Clarification:
- Editing a legacy file DOES NOT automatically require migrating all its Ant usage to this list
- This list applies ONLY to newly introduced UI

Recommendation:
- When possible, extract new UI into separate files to clearly apply New UI rules

---

### 2. Conditional Allowance Rule

If an Ant component is NOT listed above:

- Allowed ONLY when:
  - Editing a legacy file that already uses it

- NOT allowed when:
  - Creating new UI

- If required in new UI:
  → Must be explicitly approved and added to this skill

---

### 3. Forbidden in New UI

Do NOT introduce new usage of:

- Row
- Col
- Card
- Typography

These are replaced by Tailwind layout.

---

### 4. Layout Rules

- Layout MUST use Tailwind
- Ant layout = legacy only

---

## Button System

Canonical:
@/components/ui/button

Rules:
- MUST use for all CTAs
- MUST NOT create new button implementations

---

### Ant Button Exception

Allowed ONLY when:

- Inside Ant Form
- Used as submit button

Example:

```tsx
import { Button, Form } from "antd"

<Form>
  <Button htmlType="submit">Submit</Button>
</Form>
```

Optional preference:
- Prefer `@/components/ui/button` if styling is already compatible with Ant Form

---

## Styling Rules

### 1. Color

MUST use design tokens:

bg-primary  
text-foreground  
text-muted-foreground  

Avoid:
bg-purple-500  
text-pink-300  

STRICTLY FORBIDDEN (default):
- Hardcoded hex (#xxxxxx)
- Inline color styles

**Exception:** [Cosplayer / home-anime marketing shell](#cosplayer--home-anime-marketing-shell) — transitional rules apply; still avoid introducing **new** hex when tokens or existing patterns suffice.

---

### 2. Spacing

Use Tailwind scale:

mt-4 p-6 gap-2  

Avoid:
style={{ marginTop: 13 }}

---

### 3. Inline Styles

SHOULD NOT use inline styles.

Allowed ONLY if:
- animation
- dynamic calculation (calc, resize, drag)
- third-party constraints

MUST include a short comment explaining why.

---

## Component Location Rules

Forbidden:
features/.../components/ui/*

Required:
@/components/ui/*

---

## AI (Cursor) Rules

### General

When generating UI:

MUST:
- Use @/components/ui/*
- Use token-based Tailwind classes
- Follow Ant usage rules

MUST NOT:
- Use hex colors (except per [home-anime shell rules](#cosplayer--home-anime-marketing-shell) — prefer tokens when touching those files)
- Create new primitives
- Duplicate UI into feature folders

---

### Legacy vs New Behavior

- When creating NEW UI:
  → Follow New UI Surfaces rules strictly

- When editing LEGACY files:
  → Keep existing Ant usage
  → DO NOT introduce new Row/Col/Card/Typography usage
  → DO NOT expand layout patterns beyond what already exists in that file

---

## PR Checklist (Mandatory)

### UI System
- Uses @/components/ui/*
- No duplicated primitives
- Button usage is correct

### Color & Styling
- No **new** hex outside `home-anime` cosplayer shell; inside shell, prefer tokens when editing ([Cosplayer / home-anime](#cosplayer--home-anime-marketing-shell))
- No inline color styles (unless justified in [Inline Styles](#3-inline-styles))
- Uses tokens correctly (only if styling is touched)
- Pink-first / marketing surfaces keep `cosmate-pink` / `cosmate-soft-pink` (etc.) accents; do not collapse them to `primary`-only
- Neo shell: consistent `border-indigo-950` / shared shadow vocabulary; no one-off outline colors

### Ant Usage
- Only allowed components used in new UI
- No new Row/Col/Card/Typography
- Legacy Ant not expanded beyond existing patterns (per Legacy rules)

### Architecture
- No HTTP calls in components
- Pages use hooks for data

### Exceptions
- Inline styles justified with comments
- Legacy Ant usage unchanged or reduced

---

## Migration Strategy

### Phase 1 (Now)
- Stop new inconsistency
- Enforce rules on new/touched UI
- Converge `home-anime` surfaces toward tokens + `@/components/ui/button` when files are touched ([Cosplayer / home-anime](#cosplayer--home-anime-marketing-shell))

### Phase 2
- Merge shared/Button → ui/button
- Align Ant theme with tokens

### Phase 3
- Gradually remove Ant layout
- Standardize primitives

---

## Summary

This system ensures:

- Single source of truth
- Controlled Ant usage
- Safe gradual migration

If code:
- follows primitives
- uses tokens
- respects legacy boundaries

=> UI remains consistent.

Otherwise:
=> PR should be rejected or revised.
