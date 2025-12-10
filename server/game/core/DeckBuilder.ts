import type { Card } from "../models/Card";

export class DeckBuilder {
  private static readonly CARD_COUNTS: Record<number, number> = {
    1: 1,
    2: 2,
    3: 3,
    4: 4,
    5: 5,
    6: 6,
    7: 7,
    8: 8,
    9: 9,
    10: 10,
    11: 11,
    12: 12,
    13: 2, // Jesters
  };

  static createDeck(): Card[] {
    const deck: Card[] = [];

    Object.entries(this.CARD_COUNTS).forEach(([valueString, count]) => {
      const value = Number(valueString);

      for (let i = 0; i < count; i += 1) {
        deck.push({
          value,
          id: `${value}-${i}`,
          isJester: value === 13,
        });
      }
    });

    return this.shuffle(deck);
  }

  static shuffle(deck: Card[]): Card[] {
    const shuffled = [...deck];

    for (let i = shuffled.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
  }

  static dealCards(deck: Card[], numPlayers: number): Card[][] {
    if (numPlayers <= 0) {
      throw new Error("Number of players must be positive");
    }

    const hands: Card[][] = Array.from({ length: numPlayers }, () => []);

    deck.forEach((card, index) => {
      const playerIndex = index % numPlayers;
      hands[playerIndex].push(card);
    });

    return hands.map((hand) =>
      [...hand].sort((a, b) => a.value - b.value),
    );
  }
}

