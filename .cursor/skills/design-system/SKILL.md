---
name: cosmate-design-system
description: >-
  Enforces CosMate_FE UI design tokens (src/index.css), @/components/ui
  primitives, Tailwind-first layout, and Ant Design rules for legacy vs new
  surfaces. Use when implementing or reviewing UI, tokens, buttons, forms,
  Ant usage boundaries, feature component placement, or PR checklist for
  design consistency in CosMate_FE.
disable-model-invocation: true
---
# CosMate Design System — SKILL v2.3.1

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

STRICTLY FORBIDDEN:
- Hardcoded hex (#xxxxxx)
- Inline color styles

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
- Use hex colors
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
- No hex colors
- No inline color styles
- Uses tokens correctly (only if styling is touched)

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
