---
name: Blush Radiance
colors:
  surface: '#fff8f8'
  surface-dim: '#f6cfe2'
  surface-bright: '#fff8f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff0f5'
  surface-container: '#ffe8f1'
  surface-container-high: '#ffe0ee'
  surface-container-highest: '#ffd8ea'
  on-surface: '#2b1421'
  on-surface-variant: '#514346'
  inverse-surface: '#422937'
  inverse-on-surface: '#ffecf3'
  outline: '#837375'
  outline-variant: '#d5c2c4'
  surface-tint: '#81515b'
  primary: '#81515b'
  on-primary: '#ffffff'
  primary-container: '#f4b6c2'
  on-primary-container: '#74454f'
  inverse-primary: '#f4b6c2'
  secondary: '#874c67'
  on-secondary: '#ffffff'
  secondary-container: '#feb4d4'
  on-secondary-container: '#7b425d'
  tertiary: '#94445f'
  on-tertiary: '#ffffff'
  tertiary-container: '#ffb0c7'
  on-tertiary-container: '#853853'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffd9df'
  primary-fixed-dim: '#f4b6c2'
  on-primary-fixed: '#330f19'
  on-primary-fixed-variant: '#663a44'
  secondary-fixed: '#ffd8e6'
  secondary-fixed-dim: '#fbb1d1'
  on-secondary-fixed: '#370923'
  on-secondary-fixed-variant: '#6c354f'
  tertiary-fixed: '#ffd9e2'
  tertiary-fixed-dim: '#ffb1c7'
  on-tertiary-fixed: '#3e001c'
  on-tertiary-fixed-variant: '#772c48'
  background: '#fff8f8'
  on-background: '#2b1421'
  surface-variant: '#ffd8ea'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 34px
    fontWeight: '700'
    lineHeight: 42px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 20px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system expresses a refined, warm, and highly capable personal intelligence companion. Rooted in feminine sophistication, the visual philosophy balances gentle warmth with modern technical utility. The atmosphere avoids cold, robotic tropes in favor of an inviting, human-centric sanctuary that inspires calm and intuitive connection.

Key aesthetic pillars:
- **Luminous Softness:** Translucent, frosted glass surfaces paired with rose-tinted diffusion create an ethereal yet grounded depth.
- **Graceful Modernity:** Clean structural geometry grounded by playful, pill-like contours and friendly micro-interactions.
- **Editorial Touch:** High-contrast, plum-tinted typography set with precise kerning delivers effortless legibility without standard harsh black tones.

## Colors

The palette establishes an intimate, serene canvas dominated by luminous blush and rose tones, paired with deep plum for contrast and structure.

### Palette Architecture
- **Primary (`#F4B6C2`):** Blush pink. Used for primary interactive triggers, active highlights, and gentle gradient endpoints.
- **Secondary (`#E8A0BF`):** Soft rose. Powers secondary actions, selected states, and conversational accent surfaces.
- **Accent / Tertiary (`#C76D8A`):** Dusty rose. Reserved for focused emphasis, badges, interactive feedback states, and high-priority indicators.
- **Neutral Primary (`#402735`):** Deep plum. Replaces true black across all headlines, body copy, and primary icons, avoiding harsh contrast while preserving strict WCAG AAA readability on white surfaces.
- **Neutral Secondary (`#8A687B`):** Muted plum. For captions, helper copy, placeholders, and inactive icons.
- **Canvas Base (`#FFF7FA`):** The global viewport background, a delicate tinted off-white that prevents screen glare.
- **Surface (`#FFFFFF`):** Base layer for cards, floating sheets, and modals.
- **Borders & Dividers (`#F1DCE4`):** Whispering outlines that segment content without visual weight.

## Typography

Typographic hierarchy balances modern geometry with friendly humanism through **Plus Jakarta Sans**. 

- **Display & Headlines:** Tightly tracked headings (-0.02em to -0.03em) keep large text authoritative, grounded, and clean.
- **Body:** Generous line heights ensure frictionless reading within conversational assistant streams, message bubbles, and summaries.
- **Labels & Badges:** Distinct slightly tracked styles provide immediate legibility in compact pill capsules and metadata rows.

## Layout & Spacing

The layout is built around an airy 12-column responsive fluid grid designed to keep personal AI interactions focused and decluttered.

- **Desktop (1024px+):** Max-width containment at `1280px` centered with `2rem` horizontal margins and `1.5rem` gutters. Dual-pane view pairs persistent prompt sidebars with the main conversation thread.
- **Tablet (768px - 1023px):** 8-column layout with collapsing navigation drawers and adaptive `1.5rem` margins.
- **Mobile (Below 768px):** 4-column layout with pinned bottom input controls, single-column message streams, and `1rem` margins.
- **Rhythm:** Spacing follows an 8pt base grid for structured breathing room around prompt suggestions, messages, and floating action panels.

## Elevation & Depth

Visual hierarchy leverages ethereal glass layers and tinted, diffused ambient shadows rather than stark, heavy drops.

- **Level 0 (Flat):** Canvas background `#FFF7FA`.
- **Level 1 (Cards & Modules):** Pure white `#FFFFFF` surface accompanied by a soft rose-tinted shadow: `0 8px 24px -4px rgba(64, 39, 53, 0.04), 0 2px 6px -1px rgba(199, 109, 138, 0.06)`. Border is a crisp `1px solid #F1DCE4`.
- **Level 2 (Dropdowns & Popovers):** High-blur surface overlay: `background: rgba(255, 255, 255, 0.85); backdrop-filter: blur(16px);` paired with `0 16px 32px -6px rgba(64, 39, 53, 0.08)`.
- **Level 3 (Modals & Overlays):** Frosted ambient backing: `rgba(64, 39, 53, 0.25)` backdrop filter with elevated sheets casting `0 24px 48px -12px rgba(199, 109, 138, 0.16)`.

## Shapes

The interface embraces organic curvature. Core containers utilize generous `rounded-2xl` (1.25rem to 1.5rem) corners to establish a soft, tactile presence. Secondary badges, chips, tags, and conversational prompts adopt full pill-shaped curves (`rounded-full`) to cultivate warmth, playfulness, and fluid micro-actions.

## Components

### Buttons
- **Primary:** Background in `#F4B6C2` transitioning to `#E8A0BF` on hover; text in `#402735` (semi-bold); rounded `rounded-full` or `rounded-xl`; padding `0.75rem 1.5rem`; subtle active scale down to `0.98`.
- **Secondary / Soft:** Background `#FFF7FA`; border `1px solid #F1DCE4`; text `#402735`; hover background `#FCE8EF`.
- **Accent:** Background `#C76D8A`; text `#FFFFFF`; hover background `#B85E7B`.

### Badges & Chips
- Fully pill-shaped (`border-radius: 9999px`).
- Background tint `rgba(244, 182, 194, 0.25)` with text in `#C76D8A`.
- Interactive prompt suggestion chips feature a gentle hover stroke `#C76D8A` and text shift to deep plum.

### Cards & Assistant Bubble Stream
- **User Message:** Deep plum text on a soft blush-pink pill-card (`#F4B6C2`), aligned right.
- **AI Response:** `#FFFFFF` surface container with `rounded-2xl` corners, `1px solid #F1DCE4` stroke, plum typography, and a delicate left-edge rose accent dot.
- **Content Cards:** Clean white surfaces elevated with Level 1 rose-tinted shadows, `1.5rem` internal padding, and clean section breaks via `#F1DCE4`.

### Input Fields & Prompt Bar
- Floating command pill or `rounded-2xl` container with frosted glass (`rgba(255, 255, 255, 0.9)` + blur).
- Default border `1.5px solid #F1DCE4`; focused border `1.5px solid #C76D8A` accompanied by an ambient glow (`box-shadow: 0 0 0 4px rgba(244, 182, 194, 0.35)`).
- Placeholder copy rendered in muted plum `#8A687B`.

### Selection Controls
- **Checkboxes & Radios:** Soft `rounded-md` (checkbox) or circular (radio) with border `#E8A0BF`. Checked states fill with `#C76D8A` featuring clean white tick icons.