# VibeWave — Master Design Prompt
> Dark minimalist music streaming platform  
> Visual philosophy: Superhuman-grade confidence applied to a dark canvas

---

## Role
You are a senior UI/UX designer and frontend architect specializing in modern dark minimalist music streaming platforms. You apply luxury-product design thinking (precision, restraint, confidence) to every decision — not decorative, but purposeful. Every pixel earns its place.

---

## Canvas / Screen Specification (Strict)
- Aspect Ratio: 16:9
- Resolution: 1920 × 1080 (Full HD)
- Desktop-first layout
- 12-column grid system
- Max content width: 1440px (centered)
- Sidebar + content must fit without horizontal overflow

---

## Design Intent
The interface should feel **invisible, calm, and non-distracting** — optimized for users who listen to music while working. Music should start instantly with minimal interaction.

> **Superhuman Principle applied here:** "Maximum confidence through minimum decoration." Every section either earns the user's attention or gets out of the way. No element is merely decorative.

---

## Task
Design a high-fidelity, modern, dark minimalist web UI for **VibeWave** — a music streaming platform focused on:
- Background listening
- AI-powered personalization
- Minimal interaction cost

---

## Output Requirements (Strict)
- High-fidelity UI (NOT wireframes)
- Pixel-precise layout with spacing and hierarchy
- Use realistic content (real song names, artists, playlists)
- No lorem ipsum
- Maintain consistent component system across all pages
- Show clear visual hierarchy
- Use reusable components (Header, Sidebar, Card, Player)

---

## Brand & Visual System

### Identity
- Brand Name: **VibeWave**
- Tagline: *"Music that works with you"*

### Color Palette

> **Superhuman Principle applied:** Use extreme color restraint. One accent color maximum. Depth through opacity layers and warm-tinted neutrals — not multiple hues. Avoid pure blacks; use warm-dark surfaces instead.

#### Core Surfaces
| Role | Hex | Usage |
|---|---|---|
| Deep Background | `#170F23` | Page canvas — the darkest layer |
| Warm Surface | `#1F162E` | Cards, sidebar — warm-dark, not pure black |
| Elevated Surface | `#2A1F3D` | Hover states, modals, popped elements |
| Subtle Divider | `#3A2D52` | Section separators, borders — replaces heavy lines |

#### Text
| Role | Value | Usage |
|---|---|---|
| Primary Text | `rgba(255,255,255,0.95)` | Headings and key content on dark surfaces |
| Secondary Text | `rgba(255,255,255,0.65)` | Metadata, labels, supporting copy |
| Muted Text | `rgba(255,255,255,0.35)` | Placeholder, disabled, timestamps — **decorative/non-essential only** (WCAG exempt); never use for interactive or informational text |

> **Why:** Opacity-based whites (not flat #fff) create depth layering on dark backgrounds — the same principle Superhuman uses with translucent whites on their dark hero.

#### Accent — Single Color Rule
| Role | Hex | Usage |
|---|---|---|
| **VibeWave Purple** | `#9B4DE0` | The only accent. Used sparingly: active states, progress bars, focus rings, CTAs |
| Purple Glow (hover) | `rgba(155,77,224,0.15)` | Subtle hover glow — never a solid fill |
| Purple Dim | `rgba(155,77,224,0.08)` | Active background states |

> **Superhuman Principle applied:** Lavender Glow (`#cbb7fb`) is their single accent. VibeWave Purple (`#9B4DE0`) is ours. It's the **only** color departure from the neutral dark palette. Do not introduce any other accent colors (no teal, no orange, no red).

### Typography

> **Superhuman Principle applied:** Typography IS the design. Use non-standard weights and aggressive line-height compression on display text. Generous 1.5 line-height on body text creates deliberate tension between "compressed power" and "breathing room."

#### Font Stack
- **Headings:** Montserrat (weight 700 for display, 600 for section heads)
- **Body / UI:** Inter (weight 400 standard, 500 for emphasis)

#### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Display Hero | Montserrat | 56px | 700 | **0.96** | -1.2px |
| Section Display | Montserrat | 40px | 700 | **0.96** | -0.8px |
| Section Heading | Montserrat | 28px | 600 | 1.10 | -0.5px |
| Card Title | Montserrat | 18px | 600 | 1.14 | -0.3px |
| Body Heading | Inter | 16px | 500 | 1.25 | 0px |
| Body | Inter | 15px | 400 | **1.50** | 0px |
| Caption / Label | Inter | 13px | 500 | 1.20 | 0.2px |
| Micro Label | Inter | 11px | 600 | 1.50 | 0.5px |

> **Key rule:** Display text at 0.96 line-height creates dense, architectural headline blocks. Body text at 1.50 is deliberately generous. Never apply tight line-height to reading text.

### Spacing System

> **Superhuman Principle applied:** "Confident emptiness" — whitespace signals premium quality. Sections breathe. Use progressive density: hero spacious → content denser → CTA breathes again.

- Base unit: **8px**
- Scale: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80px
- Section spacing: **48–64px** vertical
- Card gap: 16–20px
- Inner card padding: 16px
- Between related elements: 8–12px

### Border Radius — Binary System

> **Superhuman Principle applied:** Only two radius values in the entire system. Radical simplicity. No micro-rounding (2px), no pill shapes (999px).

| Size | Value | Where |
|---|---|---|
| Small | `8px` | Buttons, badges, inputs, small chips |
| Large | `16px` | Cards, modals, dropdowns, player container |

### Depth & Elevation

> **Superhuman Principle applied:** Depth through borders and opacity layers — not heavy box-shadows. Shadows are used surgically, never decoratively.

| Level | Treatment | Use |
|---|---|---|
| Flat | No shadow | Main content surfaces |
| Border | `1px solid rgba(255,255,255,0.08)` | Card edges, subtle containment |
| Warm Border | `1px solid #3A2D52` | Section dividers, component edges |
| Glow | `0 0 0 2px rgba(155,77,224,0.4)` | Focus ring for accessibility |
| Elevated | `0 8px 32px rgba(0,0,0,0.4)` | Modals, popovers — used rarely |

> **Do NOT use:** Multiple nested shadows, colorful drop shadows, heavy gradients on surfaces. One shadow type per elevation level.

---

## Style Philosophy (Consolidated)

> These are the "do's and don'ts" distilled from Superhuman's design system, translated for VibeWave's dark context:

### Do
- Use opacity-based whites (`rgba(255,255,255,0.95/0.65/0.35)`) — never flat `#ffffff` for text
- Compress display headlines to `0.96` line-height — the density is intentional and architectural
- Use `#9B4DE0` purple as the **only** accent — it's the singular color departure
- Use `1px solid rgba(255,255,255,0.08)` borders to create containment — not box-shadows
- Apply negative letter-spacing on headings (`-0.5px` to `-1.2px`) — body text stays at `0px`
- Let generous whitespace (48–64px between sections) signal premium quality
- Use `8px` and `16px` border-radius only — the binary system is deliberate
- Convey hover states through **glow and opacity shifts** — not dramatic color transformations
- Warm surface tints (`#1F162E`, `#2A1F3D`) — never pure `#000000` for surfaces

### Don't
- Introduce additional accent colors (no teal, no orange, no secondary purple)
- Use heavy gradients on content surfaces — only acceptable on the hero section
- Apply `box-shadow` decoratively — only for elevation (modals, popovers)
- Use pill-shaped buttons (`border-radius: 999px`) — system uses `8px` maximum
- Mix multiple shadow layers on the same component
- Use tight line-height on body text — reserve 0.96 for display only
- Add unnecessary decorative icons, illustrations, or visual noise
- Use `#000000` pure black for any surface — always use warm-dark tints

---

## Visual Hierarchy (Strict Priority)
1. Continue Listening (MOST important — largest, highest contrast)
2. Made For You (AI playlists — prominent but secondary)
3. Quick Picks
4. Trending (least emphasis — visually lighter, smaller type)

> **Superhuman Principle applied:** "Progressive density" — most important content is spacious and dominant, lower-priority content gets smaller type + lower opacity, not hidden but clearly subordinate.

---

## Layout Rules (Strict)

### Header (fixed, always visible)
- Left: VibeWave logo
- Center: Wide search bar with AI suggestions dropdown
- Right: User avatar → Profile + Settings dropdown
- Background: `#170F23` with `1px solid rgba(255,255,255,0.06)` bottom border
- No extra icons — maximum restraint

### Sidebar (collapsible)
- Navigation: Home / Your Vibe / Library / Charts
- Clean icon + label — icons disappear on collapse, labels fade
- Subtle collapse: width transition, no flash
- Background: `#1F162E`
- Active item: `rgba(155,77,224,0.08)` background + left border `3px solid #9B4DE0`

### Main Content
- Max 4 sections per page
- Large spacing (48–64px) between sections
- Avoid clutter completely
- > **Superhuman Principle:** "Progressive density" — hero spacious → content areas denser → CTA section breathes again

### Bottom Player (fixed, always visible)
- Album art + track info (title + artist)
- Progress bar (accent purple fill)
- Playback controls (centered)
- Queue button (right)
- Lyrics preview toggle
- Background: `#1F162E`, top border `1px solid rgba(255,255,255,0.06)`

### Full Player Mode
- Trigger: click on player
- **Close button: × icon (top-right, always visible, min 44×44px tap target) — supports both click and `Esc` key**
- Full-screen lyrics (synced, scrolling)
- Animated waveform
- Background: blurred album art as atmospheric layer (opacity 0.15 max)

---

## Components (Strict Consistency)

### Cards
- Aspect ratio: 1:1
- Border-radius: `16px`
- Background: `#1F162E`
- Border: `1px solid rgba(255,255,255,0.06)`
- Max 2-line title (ellipsis overflow)
- Hover: scale `1.03` + fade-in play button overlay + purple glow `rgba(155,77,224,0.15)`
- Active: scale `0.97` + `rgba(155,77,224,0.08)` background

### Window / Overlay Dismiss (Required on all modal surfaces)
- **Every modal, drawer, popover, and full-screen overlay MUST have a visible × dismiss button**
- Position: top-right corner, `20px` inset from edge
- Size: minimum `44×44px` tap target (icon itself may be 20px)
- Style: `rgba(255,255,255,0.35)` icon, hover → `rgba(255,255,255,0.80)`
- Keyboard: `Esc` always closes the topmost overlay
- Click-outside: clicking the backdrop also dismisses (except destructive confirmations)


- Primary CTA: `#9B4DE0` fill, white text, `8px` radius
- Secondary: `rgba(255,255,255,0.08)` fill, white text, `8px` radius
- Ghost: transparent, `1px solid rgba(255,255,255,0.2)` border, `8px` radius
- Hover: opacity shift `0.85` — no dramatic color change
- Active: scale `0.97`
- Focus: `0 0 0 2px rgba(155,77,224,0.6)` outline (accessible)

### Inputs / Search
- Background: `#2A1F3D`
- Border: `1px solid rgba(255,255,255,0.1)`
- Focus border: `1px solid #9B4DE0`
- Placeholder: `rgba(255,255,255,0.35)`
- Border-radius: `8px`

### Avatars
- Always circular (`border-radius: 50%`)
- Border: `2px solid rgba(255,255,255,0.1)`

---

## Interaction States
All five states must be implemented and visible:
- **Default** — base state
- **Hover** — opacity/glow shift (never dramatic color transformation)
- **Active** — scale 0.97 + slightly darker background
- **Focus** — accessible purple ring `0 0 0 2px rgba(155,77,224,0.6)`
- **Disabled** — opacity 0.35, no pointer events

> **Superhuman Principle:** Hover states are intentionally minimal — "consistency and calm over flashy interactions."

---

## Micro-interactions
- Smooth hover transitions: `transition: all 0.15s ease`
- Progress bar animation: smooth fill, no jumps
- Heart icon: outline → filled with scale pop (`transform: scale(1.2)` then back)
- Toast notifications with Undo option (3s timeout)
- Sidebar collapse: width transition `0.2s ease`

> **Superhuman Principle:** One well-orchestrated interaction creates more delight than scattered micro-animations. Prioritize the moments that matter: playback start, heart toggle, track change.

---

## Accessibility (WCAG 2.2 AA)
- Primary text contrast ≥ 7:1 (using `rgba(255,255,255,0.95)` on `#170F23`)
- Secondary text ≥ 4.5:1 (`rgba(255,255,255,0.65)`)
- Large elements ≥ 3:1
- Color + shape combined (colorblind safe — never color alone for state)
  - Sidebar active item: purple tint + **3px left border** ✓
  - Progress bar: purple fill + **numeric time display** (text always shown)
  - Heart / Like icon: outline → filled + **scale animation** + aria-label toggle
  - Error / Success states: colored icon + **distinct icon shape** (✕ for error, ✓ for success) + text label — never color-only
  - Focus ring: purple glow + **dashed border fallback** for forced-colors mode
  - Test all states using Deuteranopia and Protanopia simulation before ship
- Focus ring always visible (purple ring)
- Motion toggle available (Settings)
- Font size: S / M / L options
- UI density: Comfortable / Compact

---

## User Customization (Settings Panel)

> Allow users to personalize their experience without breaking the design system.

| Setting | Options | Default |
|---|---|---|
| Motion | On / Reduced / Off | On |
| Font Size | S / M / L | M |
| UI Density | Comfortable / Compact | Comfortable |
| Language | System / Manual select | System |
| Sidebar | Expanded / Collapsed / Auto | Auto |
| Accent Color | VibeWave Purple / Slate / Rose | Purple |
| Theme | Dark (only, by design) | Dark |

- **Accent Color** — 2–3 preset swaps allowed (still single-accent rule; swaps the `#9B4DE0` token only)
- **Language** — surfaced in Settings as well as the footer selector
- All settings persist via localStorage; sync to user account when logged in
- Settings panel: accessible via Header → Avatar → Settings dropdown

---

## Performance UX
- 1-click playback (no modal, no confirmation)
- Skeleton loaders on all async content
- Perceived latency < 100ms for interactions
- Avoid animations that block content

---

## Pages to Design

### Core App (15 pages)
1. Homepage (Hero + Continue Listening priority)
2. Your Vibe (AI-heavy personalization)
3. Library
4. Track Detail
5. Album Detail
6. Playlist Detail
7. Artist Page
8. Charts
9. Search Results
10. Login
11. Register
12. Profile & Settings
13. 404 Page
14. Maintenance Page
15. Error Page

### Support & Legal (7 pages)
16. About Us
17. Contact Us
18. FAQ
19. Terms of Service
20. Privacy Policy
21. Copyright / DMCA
22. Community Guidelines

---

## Global Footer (Required on all pages except Player Fullscreen)

### Layout
- Full-width, max 1440px centered
- Background: `#1F162E` (slightly lighter than main canvas)
- Top border: `1px solid rgba(255,255,255,0.06)`
- Padding: 40px vertical

### Structure (4 columns)
1. **Brand** — Logo + tagline: *"Music that works with you"*
2. **Product** — Home / Your Vibe / Library / Charts
3. **Support** — Contact Us / FAQ / Help Center
4. **Legal** — Terms / Privacy / Copyright / Community Guidelines

### Bottom Row
- Copyright line
- Language selector (subtle)
- Minimal social icons (opacity 0.4 — very low emphasis)

### Rules
- Low-contrast hierarchy — footer must not compete with main content
- No heavy visuals
- Text: `rgba(255,255,255,0.45)` for links, `rgba(255,255,255,0.25)` for fine print — **fine print is decorative/non-interactive (WCAG exempt); ensure all functional links stay ≥ 3:1**

> **Superhuman Principle:** Footer is an afterthought in the best way — present but invisible. Never calls attention to itself.

---

## Error & Empty States
- Friendly, calm tone — never alarming
- Minimal waveform illustration (single-color, using `#9B4DE0` at low opacity)
- Clear CTA: "Go Home" or "Retry"
- Avoid heavy illustrations or multiple colors

---

## About Us Page (Page 16)
- Hero: "About VibeWave" — large Montserrat display
- Mission statement: short, one paragraph, generous line-height
- Team: circular avatars + name + role (clean grid)
- Minimal optional timeline
- Style: editorial + generous whitespace

> **Superhuman Principle:** Large typography + whitespace IS the design. No decorative elements needed.

---

## Contact Us Page (Page 17)
- Left: contact info (email, optional social)
- Right: contact form (Name / Email / Subject dropdown / Message)
- CTA: "Send Message" — primary button
- Success: toast notification
- Error: inline accessible validation
- Bottom: FAQ accordion (collapsed by default, smooth expand)

---

## FAQ Page (Page 18)
- Accordion style, default collapsed
- Categories: Account / Playback / Subscription / Technical
- Smooth expand animation
- Max 6–8 questions per category

---

## Legal Pages (Pages 19–22)
- Max reading width: 800px centered
- Left-aligned text
- Sticky mini table of contents (optional)
- Typography: comfortable reading size, strong H1/H2/H3 hierarchy
- Dividers: `1px solid rgba(255,255,255,0.06)` between sections
- Tone: clear, calm, non-intimidating

> **Superhuman Principle:** Legal pages should feel like reading a well-designed book — comfortable, never dense, never threatening.

---

## Avoid (Critical)
- No more than 4 sections per page
- No additional accent colors beyond `#9B4DE0`
- No heavy gradients on content surfaces
- No box-shadows used decoratively
- No pill-shaped buttons
- No dense layouts
- No pure `#000000` or `#ffffff` surfaces
- No more than 2 border-radius values (8px and 16px)
- No scattered micro-animations — only purposeful ones

---

## Rendering Standard
- Dribbble-level quality
- Ultra-clean dark UI
- Architectural typography (compressed display, generous body)
- Warm dark surfaces (never cold/pure black)
- Singular purple accent — used sparingly and with intent
- Borders over shadows for depth
- Confident whitespace — emptiness is premium