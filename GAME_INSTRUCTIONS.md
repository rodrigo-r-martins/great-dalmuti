### The Great Dalmuti – Online Version

This project implements **The Great Dalmuti** as an online, multiplayer card game. These rules describe how the game works conceptually; the authoritative rules are implemented on the server in the `game` domain.

---

### 1. Deck

- The deck is a custom 80‑card deck.
- Card values and counts:
  - 1 × `1` (Great Dalmuti)
  - 2 × `2`
  - 3 × `3`
  - 4 × `4`
  - 5 × `5`
  - 6 × `6`
  - 7 × `7`
  - 8 × `8`
  - 9 × `9`
  - 10 × `10`
  - 11 × `11`
  - 12 × `12`
  - 2 × `13` (Jesters)
- **Rank**: Lower numbers are better. `1` is the strongest, `13` (Jesters) are special wild cards.

---

### 2. Players and Seating

- Recommended **3–6 players** (the server currently enforces a max of 6).
- At the start of the game, all players are equal; social roles like "Great Dalmuti" and "Greater Peon" are effectively represented by **who finishes earlier** in a round.

---

### 3. Setup and Dealing

- The server constructs a full deck and shuffles it uniformly.
- Cards are dealt **one at a time, round‑robin**, to all players until the deck is empty.
- Each player’s hand is sorted by card value (from best to worst).

---

### 4. Objective

- The goal in a round is to **get rid of all your cards first**.
- The earlier you go out, the higher your social rank for that round.

---

### 5. Playing a Trick

- The game is played as a sequence of **tricks**.
- On your turn, you must either:
  - **Play** a valid set of cards, or
  - **Pass**.

#### 5.1 Valid Plays

- A play is a set of one or more cards from your hand.
- For the **first play of a trick**:
  - You may play **any** non‑empty set of cards.
- For **subsequent plays in the same trick**:
  - You must play the **same number of cards** as the previous play.
  - All non‑Jester cards in your play must have the **same value** (Jesters are wild and may be mixed in).
  - The value of your set (ignoring Jesters) must be **strictly lower** than the value of the previous play.

#### 5.2 Jesters (Value 13)

- Jesters are special wild cards:
  - They can accompany **any other value** to form a set.
  - If you play **only** Jesters, the effective value of the set is treated as the **best possible** (value `1`) in the engine for comparison.

---

### 6. Passing

- If you cannot or do not want to beat the previous play, you may **pass**.
- Once you pass in a trick, you are **out of that trick** until a new trick begins.
- A trick ends when all active players except the **player who made the last successful play** have passed.
- The player who made the last valid play **wins the trick** and leads the **next trick**.

---

### 7. Ending a Round

- Whenever a player plays cards and their hand becomes empty:
  - They are marked as **finished** for that round.
- The round ends when **all but one** player have finished (only one player still has cards).
- At this point, the game state enters a `roundEnd` phase in the server.

---

### 8. Turn Order

- Players take turns in a **fixed order** (e.g. join order / seating order).
- The server tracks the `currentPlayer` index.
- When a player successfully plays or passes:
  - The turn advances to the **next player** who still has cards.

---

### 9. Server‑Side Authority

- All game rules and state transitions are enforced on the **server**:
  - Clients send **intents** such as "play these card ids" or "pass".
  - The server validates the action against these rules.
  - Invalid actions are rejected with an error.
- The server maintains the full state (`GameRoom`):
  - Players and their socket ids
  - Current game phase (`waiting`, `playing`, `roundEnd`)
  - Whose turn it is
  - Last play and trick history
  - Each player’s hand (not revealed to other players)

---

### 10. Notes for Developers

- The core rules live in the `server/game/core` and `server/game/models` modules.
- The authoritative API for room state is the `GameRoom.getState()` snapshot, which is what the Socket.IO layer will broadcast to clients.
- When in doubt, treat the server’s implementation as the source of truth and keep client UI logic as a thin layer over these rules.
