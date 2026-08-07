---
name: Marczelloo Portfolio
description: An evidence-first developer portfolio in a restrained dark-violet visual system.
colors:
  bg-900: "#090912"
  bg-800: "#0d0d18"
  bg-700: "#151522"
  surface-900: "#10101c"
  surface-800: "#171726"
  surface-700: "#202033"
  primary-300: "#cbbcff"
  primary-400: "#b49cff"
  primary-500: "#9a7af0"
  primary-600: "#795bc7"
  primary-700: "#5d449b"
  text-base: "#f3f1fa"
  text-soft: "#c6c2d4"
  text-mute: "#898498"
  border-subtle: "#272638"
  border-strong: "#3d3953"
  accent-ink: "#15111f"
  error: "#ff9a9a"
typography:
  display:
    fontFamily: "Sora, Manrope, sans-serif"
    fontSize: "clamp(4rem, 8vw, 6rem)"
    fontWeight: 600
    lineHeight: 0.88
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Sora, Manrope, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.1
    letterSpacing: "-0.05em"
  title:
    fontFamily: "Sora, Manrope, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.035em"
  body:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
    letterSpacing: "normal"
  label:
    fontFamily: "Manrope, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "normal"
rounded:
  nav-item: "9px"
  control: "10px"
  nav-shell: "14px"
  surface: "18px"
  pill: "999px"
spacing:
  control-gap: "0.5rem"
  control-x: "1rem"
  surface-sm: "1.5rem"
  surface-md: "2rem"
  section-gutter-mobile: "1rem"
  section-gutter-desktop: "1.5rem"
  section-block: "6rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-400}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.primary-300}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.surface-900}"
    textColor: "{colors.text-base}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-800}"
    textColor: "{colors.text-base}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 20px"
    height: "48px"
  input-field:
    backgroundColor: "{colors.bg-900}"
    textColor: "{colors.text-base}"
    typography: "{typography.body}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
    height: "48px"
  nav-shell:
    backgroundColor: "{colors.bg-900}"
    textColor: "{colors.text-mute}"
    typography: "{typography.label}"
    rounded: "{rounded.nav-shell}"
    padding: "6px"
    height: "58px"
  nav-item-active:
    backgroundColor: "{colors.primary-400}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.nav-item}"
    padding: "0 16px"
    height: "44px"
  project-selector-active:
    backgroundColor: "{colors.primary-400}"
    textColor: "{colors.accent-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "12px 16px"
  surface-card:
    backgroundColor: "{colors.surface-900}"
    textColor: "{colors.text-base}"
    rounded: "{rounded.surface}"
    padding: "24px"
  social-chip:
    backgroundColor: "{colors.bg-900}"
    textColor: "{colors.text-soft}"
    typography: "{typography.label}"
    rounded: "{rounded.control}"
    padding: "8px 14px"
    height: "44px"
---

# Design System: Marczelloo Portfolio

## Overview

**Creative North Star: "The Violet Proof Desk"**

The Violet Proof Desk is a dark digital portfolio arranged like a focused review surface: evidence is large, navigation is immediate, and interface chrome stays quiet. Near-black violet layers preserve the Marczelloo identity while one lavender accent marks the current chapter, primary action, or small proof point.

The system feels technical, restrained, and direct rather than ornamental. Sora gives names and claims a compact display presence; Manrope keeps supporting facts readable. On desktop, each portfolio chapter occupies a full viewport and snaps into place. On mobile, the same content becomes a natural document with horizontally scrollable selectors where necessary.

**Key Characteristics:**
- Near-black violet canvas with low-contrast tonal layering.
- One lavender accent reserved for state, action, and evidence markers.
- Sora display type paired with Manrope body text.
- Eighteen-pixel content surfaces and ten-pixel interactive controls.
- Full-viewport desktop chapters with natural scrolling, natural mobile flow, and persistent bottom navigation.
- Authored entrances and short content-state transitions with reduced-motion fallbacks.

## Colors

The palette is a cool violet-black field with a single lavender action scale and lilac-tinted text neutrals.

### Primary
- **Proof Lavender** (`primary-400`, #b49cff): active navigation, primary buttons, selected project tabs, and restrained avatar accents.
- **Soft Lavender** (`primary-300`, #cbbcff): supporting proof labels, icons, statistics, and primary hover states.
- **Signal Violet** (`primary-500`, #9a7af0): hover borders, focus rings at reduced opacity, and horizontal scrollbar emphasis.
- **Structural Violet** (`primary-600`, #795bc7): scrollbars and restrained violet borders.
- **Deep Violet** (`primary-700`, #5d449b): low-opacity fills and underlines that tint surfaces without becoming a second accent.

### Tertiary
- **Soft Error Red** (`error`, #ff9a9a): contact-form failure text only; it is semantic feedback, not a decorative accent.

### Neutral
- **Night Canvas** (`bg-900`, #090912): page background, field background, navigation glass base, and the darkest content field.
- **Inset Night** (`bg-800`, #0d0d18): project-media wells and slightly raised background regions.
- **Raised Night** (`bg-700`, #151522): the lightest global background step.
- **Quiet Surface** (`surface-900`, #10101c): default bordered cards and secondary controls.
- **Active Surface** (`surface-800`, #171726): selected timeline rows and surface hover states.
- **High Surface** (`surface-700`, #202033): the brightest retained surface step.
- **Proof White** (`text-base`, #f3f1fa): headings, active labels, and high-priority copy.
- **Reading Lilac** (`text-soft`, #c6c2d4): body copy and secondary control labels.
- **Muted Lilac** (`text-mute`, #898498): metadata, unselected navigation, tags, and footer copy.
- **Subtle Violet Line** (`border-subtle`, #272638): internal dividers and card outlines.
- **Strong Violet Line** (`border-strong`, #3d3953): controls, navigation shell, and prominent surface edges.
- **Accent Ink** (`accent-ink`, #15111f): dark text placed on lavender fills.

### Named Rules

**The One Lavender Rule.** Lavender is the only chromatic action voice; use it for the current state, the primary action, or a small evidence marker, never as broad decorative coverage.

**The Night-on-Night Rule.** Separate most regions with a one-step tonal shift and a violet-gray border before reaching for a stronger color.

## Typography

**Display Font:** Sora for chapter headings; Manrope ExtraBold for the Hero wordmark  
**Body Font:** Manrope (with system-ui and sans-serif fallbacks)

**Character:** Sora is compact and geometric, giving evidence-led chapter headings a technical editorial force. The Hero wordmark uses Manrope ExtraBold in uppercase for a broader, more direct silhouette closer to the original Marczelloo identity. Manrope also carries every explanatory sentence, label, and control with neutral clarity.

### Hierarchy
- **Display** (Manrope 800, `clamp(4rem, 10vw, 8.25rem)`, 0.84 line-height, -0.04em tracking): the uppercase Marczelloo Hero wordmark only.
- **Headline** (600, 2.25rem at mobile, 3rem at small screens, up to 3.75rem at large screens, approximately 1.1 line-height): chapter claims and major section headings.
- **Title** (600, 1.5rem to 2.25rem, approximately 1.25 line-height, -0.035em tracking): project titles and Journey panel headings.
- **Body** (400, 1rem with selected 1.125rem and 1.25rem leads, 1.625 line-height): explanations and proof summaries, usually constrained to 36-48rem.
- **Label** (600, 0.75rem to 0.875rem, compact line-height): navigation, metadata, tags, dates, and button copy.

### Named Rules

**The Two-Face Rule.** Use Manrope ExtraBold only for the Hero wordmark and Sora for chapter headings and evidence titles. Do not introduce a third font.

**The Proof Before Flourish Rule.** Headlines may be large, but supporting facts remain sentence case, plainly worded, and easy to scan.

## Layout

The portfolio uses a centered chapter shell. At desktop width (1024px and above), the scroll container is exactly one dynamic viewport high and each section is at least one dynamic viewport high. Wheel, trackpad, Page, Arrow, Home, and End input resolves to whole-chapter navigation: one gesture advances by exactly one neighboring section, while direct navigation may still jump to any chapter. The main scrollbar is visually hidden and reduced-motion preferences replace smooth travel with an immediate transition. The shell is `min(100% - 3rem, 88rem)` with block padding between 5rem and 7rem. Hero uses a centered editorial stack with a circular portrait above the wordmark; Journey and Contact use 12-column grids; Craft uses a 17rem project index beside a flexible evidence panel. Contact metadata is pinned to the lower outer edges on desktop so the primary contact pair remains vertically centered alongside the bottom navigation.

Below 1024px, scroll snap and viewport locking are removed. Sections return to natural height and visible overflow, while the shell becomes `min(100% - 2rem, 48rem)` with 6rem block padding. The Craft selector turns into a horizontal snap row; content cards stack; the bottom navigation remains fixed above the safe-area inset. At 640px, control padding, text sizes, and card padding step up.

Spacing follows repeated 0.5rem, 0.75rem, 1rem, 1.5rem, and 2rem intervals. Large content separations use 2.25rem to 3rem, while section breathing room is deliberately much larger. Copy blocks stay constrained even when the canvas is wide.

**The Chapter-to-Document Rule.** Preserve the full-page chapter scale on desktop without forcing snap; below 1024px, let the portfolio read as one naturally scrolling document.

## Elevation & Depth

Depth is mostly structural: near-black tonal steps, one-pixel violet-gray borders, clipping, and nested panels do the work. Standard surfaces use a diffuse violet-black ambient shadow (`0 24px 70px -42px rgb(42 31 75 / 0.7)`), while the Journey panel adds two offset, translucent backing cards. The page canvas also carries one quiet violet radial glow near the upper-right; it is atmospheric, not a second focal point.

### Shadow Vocabulary
- **Surface Ambient** (`0 24px 70px -42px rgb(42 31 75 / 0.7)`): standard card depth without a floating-dashboard effect.
- **Journey Stack** (two offset bordered layers at 40% and 70% surface opacity): communicates a changing record set behind the active entry.

### Named Rules

**The Tonal-First Rule.** Establish depth with neighboring dark surfaces and borders; keep the single ambient shadow diffuse and subordinate.

## Shapes

The form language is softly technical rather than pill-heavy. Primary content surfaces use an 18px radius, the navigation shell uses 14px, standard interactive controls use 10px, and navigation items use 9px. Fully rounded geometry is reserved for scrollbar thumbs. One-pixel borders define the majority of silhouettes, and image wells clip to the containing 18px surface.

**The Two-Radius Rule.** Use 18px for substantial containers and 10px for interactive controls; the 14px/9px navigation pair is the only recurring exception.

## Components

### Buttons
- **Shape:** softly rounded control (10px) with a minimum height of 44px or 48px.
- **Primary:** Proof Lavender fill with Accent Ink text, semibold Manrope copy, and 12px by 20px padding for primary CTAs; compact instances use 10px by 16px.
- **Hover / Focus:** hover lightens to Soft Lavender; press translates down by 1px. Keyboard focus uses a 2px Proof Lavender outline with a 4px offset.
- **Secondary:** Quiet Surface or transparent dark fill with a Strong Violet Line border; hover shifts to Active Surface and a Signal Violet border.

### Chips
- **Style:** social-link chips use a transparent Night Canvas fill, Strong Violet Line border, Soft Lilac text, and 10px corners.
- **State:** hover raises text to Proof White, tints the background to Quiet Surface, and turns the border Signal Violet.

### Cards / Containers
- **Corner Style:** substantial surfaces use 18px corners.
- **Background:** Quiet Surface at 86% opacity over the Night Canvas; project-media wells use Inset Night.
- **Shadow Strategy:** one Surface Ambient shadow; Journey alone uses the stacked backing-card signature.
- **Border:** one-pixel Subtle Violet Line, strengthened only where interaction or contrast requires it.
- **Internal Padding:** 24px by default, stepping to 32px or 40px on larger layouts.

### Inputs / Fields
- **Style:** Night Canvas fill, Strong Violet Line border, 10px corners, 48px minimum height, and 12px by 16px internal padding.
- **Focus:** border shifts to Proof Lavender and adds a 2px Signal Violet ring at 25% opacity; the global offset outline remains the keyboard-visible fallback.
- **Error / Disabled:** errors use Soft Error Red copy below the form; the submitting button keeps its shape but reduces opacity to 65% and shows a wait cursor.

### Navigation

The fixed bottom navigation is a 58px-high, 14px-radius dark glass shell with a Strong Violet Line border and backdrop blur. Inactive items are muted semibold labels; the active item receives a 9px-radius Proof Lavender plate with Accent Ink text. The active plate glides over 300ms with the authored easing, and all items maintain a 44px minimum target height. During a multi-chapter jump, the requested destination owns the active state until it reaches the viewport center; intermediate chapters never steal the indicator.

### CV Surface

The browser CV is an editorial extension of the portfolio rather than a simulated sheet of paper: it uses the Night Canvas, Quiet Surface, Proof Lavender section indexing, and the same Sora/Manrope hierarchy. Experience and projects form the primary reading column; skills, education, and languages form a narrower supporting rail. Print switches the same semantic content to a compact black-on-white two-column A4 layout, removes application chrome, and keeps the entire document on one page.

### Project and Journey Selectors

Selectors behave like evidence indexes rather than tabs with decorative chrome. The active project receives a solid Proof Lavender plate; unselected projects stay muted and reveal a quiet surface and border on hover. Journey rows use Active Surface for the selected record and transition the evidence panel with a 380ms opacity, vertical, and slight-rotation change. Project evidence uses a 400ms clipped reveal. Both honor reduced-motion preferences.

### Authored Entrances

Hero copy enters over 680ms with a 24px rise; the circular portrait arrives over 620ms with a small scale and vertical shift. In-view section content generally enters over 450-650ms. The shared easing is `cubic-bezier(0.16, 1, 0.3, 1)`. Motion explains arrival or state change and is removed or simplified when reduced motion is requested.

## Do's and Don'ts

### Do:
- **Do** keep recruiter-facing evidence, project imagery, dates, roles, and contributions visually ahead of ornamental details.
- **Do** use Proof Lavender for one active state or primary action at a time, with Soft Lavender for small supporting labels.
- **Do** preserve the 18px surface and 10px control relationship across new portfolio components.
- **Do** keep desktop chapters viewport-scaled while allowing natural scroll, and let the same content flow naturally below 1024px.
- **Do** use the shared `cubic-bezier(0.16, 1, 0.3, 1)` easing and provide reduced-motion behavior for authored transitions.

### Don't:
- **Don't** introduce competing accent hues, broad gradients, or large violet-filled regions that overpower the evidence.
- **Don't** turn every label or technology name into a pill; metadata is usually plain semibold text.
- **Don't** add heavy black drop shadows or glossy elevation; use tonal layers, borders, and the single diffuse ambient shadow.
- **Don't** use Sora for paragraphs or loosen its display tracking into generic geometric type.
- **Don't** force viewport-height sections or mandatory scroll snap onto mobile layouts.
