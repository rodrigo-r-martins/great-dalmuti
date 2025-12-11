# The Great Dalmuti - UI/UX Design System

## 🎨 Design Philosophy

**Core Principles:**

- **Playful & Fun** - This is a social card game, not a serious app
- **Medieval Whimsy** - Renaissance fair meets modern design
- **Warm & Inviting** - Rich colors, friendly illustrations
- **Clear Hierarchy** - Game state always obvious
- **Touch-Friendly** - Large, tappable elements

---

## 🎨 Color Palette

### Primary Colors (Inspired by Original Game)

```css
/* Royal Purple - Primary brand color */
--royal-purple: #6b46c1;
--royal-purple-light: #805ad5;
--royal-purple-dark: #553c9a;

/* Medieval Gold - Accents & highlights */
--medieval-gold: #d69e2e;
--gold-light: #ecc94b;
--gold-dark: #b7791f;

/* Parchment - Backgrounds */
--parchment: #f7fafc;
--parchment-dark: #edf2f7;
--aged-parchment: #e2e8f0;

/* Rich Burgundy - Secondary accent */
--burgundy: #9b2c2c;
--burgundy-light: #c53030;

/* Forest Green - Success states */
--forest-green: #276749;
--forest-green-light: #38a169;
```

### Card Rank Colors

```css
/* Card value-based colors */
--card-royal: #9f7aea; /* 1-2: Royal cards */
--card-noble: #4299e1; /* 3-4: Noble cards */
--card-merchant: #48bb78; /* 5-8: Merchant cards */
--card-peasant: #ed8936; /* 9-12: Peasant cards */
--card-jester: #d53f8c; /* 13: Jesters (wild) */
```

### UI States

```css
/* Neutrals */
--text-primary: #2d3748;
--text-secondary: #4a5568;
--text-muted: #718096;
--text-inverse: #ffffff;

/* States */
--success: #38a169;
--error: #e53e3e;
--warning: #dd6b20;
--info: #3182ce;

/* Backgrounds */
--bg-primary: #f7fafc;
--bg-secondary: #edf2f7;
--bg-elevated: #ffffff;
--bg-overlay: rgba(0, 0, 0, 0.5);
```

---

## 🖼️ Visual Style

### Background Treatment

**Main Game Background:**

- Subtle wood grain texture or velvet pattern
- Rich purple gradient: `linear-gradient(135deg, #6B46C1 0%, #553C9A 100%)`
- Optional: Subtle medieval tapestry pattern overlay at 5% opacity

**Card Table Area:**

- Lighter parchment color with subtle paper texture
- Soft drop shadow to elevate from background
- Rounded corners (16px radius)

### Typography

**Primary Font Stack:**

```css
font-family: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
```

**Display Font (Headers):**

```css
font-family: "Cinzel", "Georgia", serif;
/* Medieval-inspired but readable */
/* Use for: Game title, player titles */
```

**Sizes:**

```css
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
--text-3xl: 30px;
--text-4xl: 36px;
--text-5xl: 48px;
```

---

## 🎴 Card Design

### Card Dimensions

- Desktop: 80px × 112px (standard playing card ratio)
- Mobile: 60px × 84px
- Selected state: +8px height (lifted effect)

**Card Face Design:**

```
┌─────────────┐
│ 5      [♦]  │  ← Rank corner (large)
│             │
│             │
│      5      │  ← Center value (huge)
│             │
│             │
│ [♦]      5  │  ← Rank corner (large)
└─────────────┘
```

**Card Back Design:**

- Purple with gold filigree pattern
- Medieval crest in center
- "The Great Dalmuti" text at bottom

### Card Colors by Rank

| Rank           | Background                  | Border      | Text  |
| -------------- | --------------------------- | ----------- | ----- |
| 1-2 (Royal)    | Linear gradient purple-gold | Gold        | White |
| 3-4 (Noble)    | Bright blue                 | Dark blue   | White |
| 5-8 (Merchant) | Green                       | Dark green  | White |
| 9-12 (Peasant) | Orange                      | Dark orange | White |
| Jester         | Pink/Purple gradient        | Magenta     | White |

---

## 📱 Layout & Components

### Main Menu Screen

```
┌─────────────────────────────────────────┐
│                                         │
│            👑 The Great Dalmuti         │
│         Medieval Card Game Mayhem       │
│                                         │
│   [Input: Your Name _______________]    │
│                                         │
│     ┌─────────────────────────────┐    │
│     │    🎮 Create New Game       │    │
│     └─────────────────────────────┘    │
│                                         │
│     ┌─────────────────────────────┐    │
│     │    🚪 Join Game             │    │
│     └─────────────────────────────┘    │
│                                         │
│          [Room Code: ______]            │
│                                         │
│     ───────────────────────────────     │
│                                         │
│     📖 How to Play  |  ⚙️ Settings     │
│                                         │
└─────────────────────────────────────────┘
```

**Visual Details:**

- Background: Rich purple gradient with subtle pattern
- Title: Large Cinzel font, gold color with shadow
- Buttons: Large (56px height), rounded (12px), with hover lift
- Input fields: White background, soft shadows, 48px height

---

### Lobby Screen

```
┌─────────────────────────────────────────┐
│  👑 The Great Dalmuti                   │
│  Room: ABC123  [📋 Copy]  [🔗 Share]   │
│                                         │
│  ┌────────────────────────────────────┐│
│  │ 👤 Players (3/6)                   ││
│  │                                    ││
│  │  👑 Carol (Host) ───────────── ●  ││
│  │  👤 Rodrigo ───────────────── ●   ││
│  │  👤 Claudio ──────────────── ●    ││
│  │  + Waiting for more players...    ││
│  │                                    ││
│  └────────────────────────────────────┘│
│                                         │
│  ┌────────────────────────────────────┐│
│  │ 💬 Chat                            ││
│  │  Carol: Ready to play!             ││
│  │  Rodrigo: Let's go!                ││
│  │  [Type message...] [Send]          ││
│  └────────────────────────────────────┘│
│                                         │
│  [Start Game] (Host only, needs 3+)    │
│  [Leave Room]                           │
│                                         │
└─────────────────────────────────────────┘
```

**Visual Details:**

- Cards: White elevated panels with soft shadows
- Player list: Each player in a row with avatar, name, status dot
- Crown icon for host
- Green dot for connected, red for disconnected
- Chat: Scrollable area, messages grouped by player

---

### Game Screen - Desktop Layout

```
┌──────────────────────────────────────────────────────────────┐
│  👑 The Great Dalmuti  │  Round 1  │  Room: ABC123  │  ⚙️    │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     THE COURT                          │  │
│  │                                                        │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │  │ 👑 Rodrigo   │  │ 👤 Carol     │  │ 👤 Claudio   │ │
│  │  │ (The Great   │  │ (You)        │  │ (Lesser      │ │
│  │  │  Dalmuti)    │  │              │  │  Dalmuti)    │ │
│  │  │              │  │              │  │              │ │
│  │  │  🃏 × 15     │  │  🃏 × 18     │  │  🃏 × 20     │ │
│  │  │  ⏳ TURN     │  │              │  │  PASSED      │ │
│  │  └──────────────┘  └──────────────┘  └──────────────┘ │
│  │                                                        │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Last Play:  👤 Carol played  [5][5][5]  (3 cards)    │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  YOUR HAND                                              │  │
│  │  Select cards to play                                   │  │
│  │                                                         │  │
│  │  [1] [3][3] [5][5][5] [7][7] [9][9][9] [11][11] [J]   │  │
│  │                                                         │  │
│  │            [▶ Play 3 Cards]    [Pass]                  │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  💡 Tip: Play lower numbers to beat the previous play!      │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

---

### Game Screen - Mobile Layout

```
┌──────────────────────────┐
│  👑 Dalmuti  │  R1  │  ⚙️ │
├──────────────────────────┤
│                          │
│  ┌────────────────────┐  │
│  │  🎯 Current Turn   │  │
│  │  👤 Rodrigo        │  │
│  └────────────────────┘  │
│                          │
│  Last: [5][5][5]         │
│                          │
│  ┌────────────────────┐  │
│  │ Players            │  │
│  │ 👑 Rodrigo (15) ⏳ │  │
│  │ 👤 You (18)        │  │
│  │ 👤 Claudio (20) ✗  │  │
│  └────────────────────┘  │
│                          │
│  ┌────────────────────┐  │
│  │  YOUR HAND         │  │
│  │                    │  │
│  │ [1] [3][3] [5][5]  │  │
│  │ [5] [7][7] [9][9]  │  │
│  │ [9] [11][11] [J]   │  │
│  │                    │  │
│  │  [Play]   [Pass]   │  │
│  └────────────────────┘  │
│                          │
│  💡 Play lower to win!   │
│                          │
└──────────────────────────┘
```

## 🎭 Icons & Illustrations

### Icon Usage

- **Lucide React** for UI icons (consistent, clean)
- **Custom SVG** for game-specific elements:
  - Crown (for host/winner)
  - Card suits (decorative)
  - Medieval banners
  - Trophy/medals for rankings

### Illustration Style

- **Simple, friendly** - not too detailed
- **Medieval theme** - castles, crowns, banners
- **Playful** - slightly cartoonish, not serious
- **Warm colors** - golds, purples, rich tones

---

## 📐 Spacing & Layout

### Spacing Scale

```css
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-5: 20px;
--space-6: 24px;
--space-8: 32px;
--space-10: 40px;
--space-12: 48px;
--space-16: 64px;
```

### Breakpoints

```css
--mobile: 320px;
--tablet: 768px;
--desktop: 1024px;
--wide: 1440px;
```

### Container Max-Widths

```css
--container-sm: 640px; /* Lobby */
--container-md: 768px; /* Game mobile */
--container-lg: 1024px; /* Game desktop */
--container-xl: 1280px; /* Wide screens */
```

---

## 🎮 Game State Indicators

### Turn Indicator

```
┌────────────────────┐
│  ⏳ Rodrigo's Turn │  ← Pulsing golden border
│  Waiting...        │
└────────────────────┘
```

### Player Status Icons

- 🎯 Current turn (animated)
- 👑 Host
- ✅ Ready
- ⏳ Thinking
- ✗ Passed
- 🏆 Finished (with placement number)

### Card Count Display

```
🃏 × 15  ← Large, readable numbers
```

---

## 🎨 Dark Mode (Optional)

If implementing dark mode:

```css
/* Dark theme colors */
--bg-primary-dark: #1a202c;
--bg-secondary-dark: #2d3748;
--text-primary-dark: #f7fafc;

/* Keep same accent colors */
/* Purple and gold work well on dark */
```

---

## 📱 Responsive Considerations

### Mobile Optimizations

1. **Larger tap targets** - minimum 44×44px
2. **Bottom sheet modals** - easier thumb reach
3. **Simplified nav** - fewer options visible
4. **Card size** - 60×84px (still readable)
5. **Single column layouts** - vertical stacking

### Tablet Optimizations

1. **Hybrid layout** - between mobile/desktop
2. **Side-by-side players** - 2 columns
3. **Larger cards** - 70×98px
4. **More visible info** - show more game history

---

## 🎪 Fun Extra Details

### Loading States

- Shuffling cards animation
- "Dealing cards..." with progress
- Connecting spinner with medieval theme

### Sound Effects (Optional)

- Card shuffle on deal
- "Whoosh" on card play
- Gentle bell on turn change
- Fanfare on round win
- Medieval tavern ambiance (toggleable)

### Easter Eggs

- Special animations for perfect plays
- Confetti when finishing with Jesters
- Silly title for last place ("The Great Peon")
- Sound bite: "Revolution!" when rankings flip

---

## 🎨 Design Assets Needed

### To Create:

1. **Logo** - "The Great Dalmuti" stylized text with crown
2. **Card backs** - Purple with gold pattern
3. **Background textures** - Velvet, wood grain, parchment
4. **Player avatars** - Default medieval character icons
5. **Rank badges** - Visual badges for each title
6. **Tutorial illustrations** - Simple guide images

### Recommended Tools:

- **Figma** - Full mockups
- **Canva** - Quick assets
- **Hero Icons / Lucide** - Icon library
- **Unsplash** - Texture references
