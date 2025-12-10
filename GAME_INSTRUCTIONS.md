### The Great Dalmuti – Online Version

This project implements **The Great Dalmuti** as an online, multiplayer card game. The rules below are based on the official game description (summarised from [Wikipedia](https://en.wikipedia.org/wiki/The_Great_Dalmuti)) and note where this online version simplifies things.

---

### 1. Deck

- The deck is a custom **80‑card** deck.
- Card values and counts:
  - 1 × `1` (Dalmuti – best)
  - 2 × `2` (Archbishop)
  - 3 × `3` (Earl Marshal)
  - 4 × `4` (Baroness)
  - 5 × `5` (Abbess)
  - 6 × `6` (Knight)
  - 7 × `7` (Seamstress)
  - 8 × `8` (Mason)
  - 9 × `9` (Cook)
  - 10 × `10` (Shepherdess)
  - 11 × `11` (Stonecutter)
  - 12 × `12` (Peasant)
  - 2 × `13` (Jesters)
- **Rank**: Lower numbers are better when comparing sets.
- **Jesters (13)**:
  - When played **together with other cards**, each Jester is a **wild card** that takes the value of the other cards in that set.
  - When a Jester is played **by itself** (no other cards in the set), it counts as a card of value **13** – strictly worse than any numbered card.

---

### 2. Players, Seating, and Roles

- The tabletop game is usually played with **4–8 players**; this online version supports **3–6**.
- At the start of a traditional game, players draw cards to determine their initial rank and seating:
  - The player with the **lowest** card becomes the **Greater Dalmuti**.
  - The player to their left is the **Lesser Dalmuti**.
  - The player with the **highest** card is the **Greater Peon**.
  - The player to the right of the Greater Peon is the **Lesser Peon**.
  - All others are **Merchants**.
- After each hand, players are reseated according to the order they went out (first out becomes the new Greater Dalmuti, last remaining becomes the new Greater Peon).

> **Implementation note:** The current online version focuses on the **core shedding and trick‑taking rules**. Social titles (Greater Dalmuti, Peons) and reseating are not yet modeled as separate roles; "rank" is inferred from who finishes first in a round.

---

### 3. Setup, Dealing, and Taxes

1. **Dealing**

   - The entire deck is shuffled.
   - Cards are dealt one at a time, round‑robin, until the deck is exhausted.
   - Some players may receive one more card than others; this is expected.
   - In this implementation, each player’s hand is sorted by value for convenience.

2. **Taxes (Tabletop rule)**
   - Before each hand, in the physical game:
     - The **Greater Peon** must give their **two best cards** to the **Greater Dalmuti**, and receives the Dalmuti’s **two worst cards** in return.
     - The **Lesser Peon** must give their **best card** to the **Lesser Dalmuti**, and receives the Dalmuti’s **worst card** in return.
   - If a player holds **both Jesters**, they may call a **Revolution** (or **Greater Revolution** if that player is the Greater Peon), which cancels taxes or reverses social order.

> **Implementation note:** Taxes and revolutions are **not yet implemented** in the server logic. Each online round starts from an even state after dealing.

---

### 4. Objective

- The goal of each hand is to **shed all your cards** as quickly as possible.
- The earlier you go out, the **higher your rank** for that hand.
- The last player left with cards is effectively the **Greater Peon** for the next hand in the tabletop game.

In this online version, a "round" ends as soon as **all but one** player have shed their cards.

---

### 5. Playing a Trick

- Play proceeds **clockwise**.
- On your turn you must either:
  - **Play** a valid set of cards, or
  - **Pass**.

#### 5.1 Valid Sets

- A **set** is one or more cards you play from your hand.
- All non‑Jester cards in a set must have the **same value**. Jesters may be included as wild cards.
- The **value of the set** is:
  - The common value of its non‑Jester cards, if there are any, or
  - `13` if the set consists entirely of Jesters.

#### 5.2 First Play of a Trick

- The player who leads a trick may play **any non‑empty valid set**:
  - All non‑Jester cards in the set must still have the **same value**.
  - A set of only Jesters is allowed and has value `13`.

#### 5.3 Following Plays in the Same Trick

- Each subsequent play in that trick must:
  - Use the **same number of cards** as the current leading set.
  - Be a **valid set** (all non‑Jesters same value).
  - Have a set value **strictly lower** than the current leading set.
- If you cannot or do not wish to play a valid lower set, you **pass**.

---

### 6. Jesters (Detailed)

- A Jester played alone is a **13** – the worst single card.
- Jesters can be used to **complete better sets**, for example:
  - `6 + Jester` counts as a pair of 6s.
  - `4 + 4 + Jester` counts as three 4s.
- A set of only Jesters (e.g. single Jester, or two Jesters together) is legal to lead a trick, but is **very weak** and almost always beaten by any numbered set of the same size.

The server logic mirrors this behaviour by treating all‑Jester sets as value `13`, and mixed sets by the value of their numbered cards.

---

### 7. Passing and Ending a Trick

- If you pass, you take no further part in that trick.
- A trick ends when **all active players except the player who made the last valid play** have passed.
- The player who made the last valid play **wins the trick** and will lead the **next trick**.

In this online version, a new trick is automatically started after everyone else passes; the last successful player becomes the new leader.

---

### 8. Ending a Round (Hand)

- Whenever a player plays a set and their hand becomes empty:
  - They are marked as **finished** for that round.
- The round ends when **only one player** still has cards.
- The server then marks the game state as `roundEnd`.

The full tabletop game would then perform reseating and start a new hand; this version currently ends the round and can be reset or a new room can be created.

---

### 9. Turn Order

- Players take turns in a **fixed order** determined by join order.
- The server tracks:
  - `currentPlayer`
  - `lastPlay` and trick history
  - Each player’s hand and which players have already finished

After each successful play or pass, turn advances to the next player who still has cards.

---

### 10. Server‑Side Authority

- All rules and state transitions are enforced on the **server**:
  - Clients send **intents** such as "play these card ids" or "pass".
  - The server validates each action against the rules above.
  - Invalid actions are rejected with an error.
- The authoritative game state is exposed via `GameRoom.getState()` and broadcast to all players in the room.

---

### 11. Implementation Notes & Differences from the Tabletop Game

- This online version currently focuses on a single **round** (hand) at a time.
- **Not yet implemented** compared to the full rules:
  - Taxation between Dalmutis and Peons.
  - Revolutions (and Greater Revolutions).
  - Automatic reseating and persistent social titles between hands.
- Core gameplay – dealing, trick‑taking, Jester behaviour, passing, and ending a hand – follows the standard rules of _The Great Dalmuti_.
