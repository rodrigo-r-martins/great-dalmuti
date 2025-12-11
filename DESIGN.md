## 👑 UI Design Specification Document: The Great Dalmuti (Revised)

This document specifies the visual components, styles, and layout based on the final, stylized mock-up, focusing on the deep purple background and modern, illustrated cards.

---

### 1. Visual Aesthetic & Textures

- **Overall Theme:** Regal and modern, blending rich, deep colors with clean, organized UI panels.
- **Primary Page Background:** A deep, muted purple/mauve color (`#3A2C40` approx.), potentially with a subtle, dark fabric or texture overlay (like velvet or dark paper) to provide visual warmth and depth.
- **Panel Surfaces:** Clean, dark, solid panels (`#1F2433` approx.) with soft, large rounded corners (12-16px radius). These panels float clearly above the textured background.

### 2. Color Palette (Confirmed)

This palette is directly derived from the mock-up's successful color choices.

| Element                | Color Name           | Hex Code (Approximate) | Purpose                                                             |
| :--------------------- | :------------------- | :--------------------- | :------------------------------------------------------------------ |
| **Primary Background** | Deep Mauve/Plum      | `#3A2C40`              | Main page color and textured base.                                  |
| **Panel Background**   | Dark Charcoal/Navy   | `#1F2433`              | Background for information boxes (Room, Hand, Players, Buddy).      |
| **Text (Primary)**     | Off-White/Light Gray | `#E2E8F0`              | Main text color for readability.                                    |
| **Accents/Active**     | Muted Gold/Yellow    | `#FBBF24`              | Primary action buttons, selection indicators, and focused elements. |
| **Success/Turn**       | Vibrant Green        | `#10B981`              | Status indicator (Connected, "Your Turn").                          |
| **Card Face**          | Off-White/Parchment  | `#F7F4EB`              | The light background color of the actual playing card art.          |

---

### 3. Typography

- **Font Family:** A clean, legible sans-serif font (e.g., Roboto, Inter).
- **Hierachy:**
  - **Game Title:** Large, stylized font (as seen in the mock-up header, potentially a serif or display font for flair).
  - **Panel Titles:** Bold, Off-White (18-20px).
  - **Body Text:** Regular, Light Gray (14-16px).
  - **Turn/Status Text:** Bold, using **Vibrant Green** or **Muted Gold**.

---

### 4. Card Design Specifications (The Illustrated Cards)

The cards are the central visual element, featuring a distinct, stylized, slightly vintage illustration style.

- **Card Face Color:** Light Parchment (`#F7F4EB`).
- **Visual Rank:** Each rank (1-12, Jester) must feature a unique, thematic illustration that conveys status (e.g., the gold-crowned figure for the 1, the distinct Jester image).
- **Rank Numbers:** The numbers (e.g., $1\text{, } 5\text{-5}$) must be clearly displayed within the card art, using a dark color for high contrast.

### 5. UI Layout and Interaction

#### 5.1. Your Hand Panel (Center Interaction)

- **Cards:** Displayed as illustrated images, slightly overlapped.
- **Selection Feedback:**
  - **Click/Tap:** Card lifts on the Z-axis (`transform: translateY(-10px);`).
  - **Glow:** Card receives a thick, vibrant border or shadow glow using **Muted Gold** (`#FBBF24`).
- **Action Buttons:**
  - **"Play selected"**: Solid fill of **Muted Gold**. Must use appropriate hover/active states (slight darkening of the gold).
  - **"Pass"**: Secondary button style—dark panel background with a **Muted Gold** border or text outline.

#### 5.2. Players Panel (Top Right)

- **Card Count:** Displayed prominently next to the name. The mock-up uses a stylized card icon and a numerical count (e.g., `[ 10 ]`).
- **Visual Order:** When a player wins a hand or changes status, their ranking/role should be updated visually (e.g., small status badge).

#### 5.3. Room/Trick Panel (Top Left)

- **Turn Indicator:** The text **"Your turn!"** uses **Vibrant Green** or **Muted Gold** for immediate visibility.
- **Played Cards:** This area will display the card images played in the current trick, possibly fanned out and slightly lowered in opacity to indicate they are the _target to beat_.

#### 5.4. Dalmuti Buddy Panel (Bottom)

- **Aesthetic:** The panel maintains the standard **Panel Background** color.
- **Function:** Clear, bulleted tips. The **"Hide tips"** button should use low-contrast text to remain subtle.
