import { describe, expect, it } from "vitest";
import { DeckBuilder } from "../core/DeckBuilder";
import type { Card } from "../../shared/types";

function countByValue(deck: Card[]): Record<number, number> {
  return deck.reduce<Record<number, number>>((acc, card) => {
    acc[card.value] = (acc[card.value] ?? 0) + 1;
    return acc;
  }, {});
}

describe("DeckBuilder", () => {
  it("creates a deck with correct counts and jesters", () => {
    const deck = DeckBuilder.createDeck();

    expect(deck).toHaveLength(80);

    const counts = countByValue(deck);

    expect(counts[1]).toBe(1);
    expect(counts[2]).toBe(2);
    expect(counts[3]).toBe(3);
    expect(counts[4]).toBe(4);
    expect(counts[5]).toBe(5);
    expect(counts[6]).toBe(6);
    expect(counts[7]).toBe(7);
    expect(counts[8]).toBe(8);
    expect(counts[9]).toBe(9);
    expect(counts[10]).toBe(10);
    expect(counts[11]).toBe(11);
    expect(counts[12]).toBe(12);
    expect(counts[13]).toBe(2);

    const jesters = deck.filter((card) => card.isJester);
    expect(jesters).toHaveLength(2);
    expect(jesters.every((card) => card.value === 13)).toBe(true);
  });

  it("deals cards evenly and preserves all cards", () => {
    const deck = DeckBuilder.createDeck();
    const numPlayers = 5;

    const hands = DeckBuilder.dealCards(deck, numPlayers);

    // correct number of hands
    expect(hands).toHaveLength(numPlayers);

    // total cards preserved
    const totalCardsInHands = hands.reduce((sum, hand) => sum + hand.length, 0);
    expect(totalCardsInHands).toBe(deck.length);

    // cards are uniquely distributed
    const allIds = hands.flat().map((card) => card.id);
    const uniqueIds = new Set(allIds);
    expect(uniqueIds.size).toBe(allIds.length);

    // each hand is sorted
    for (const hand of hands) {
      const sortedCopy = [...hand].sort((a, b) => a.value - b.value);
      expect(hand.map((c) => c.id)).toEqual(sortedCopy.map((c) => c.id));
    }
  });
});
