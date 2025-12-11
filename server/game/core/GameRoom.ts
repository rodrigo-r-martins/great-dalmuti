import type { Card } from "../models/Card";
import type { Player } from "../models/Player";
import { DeckBuilder } from "./DeckBuilder";

export type GameState = "waiting" | "playing" | "roundEnd";

export interface PublicPlayer {
  id: string;
  name: string;
}

export interface LastPlay {
  player: number;
  cards: Card[];
  value: number;
  count: number;
}

export interface GameSnapshot {
  roomId: string;
  players: PublicPlayer[];
  gameState: GameState;
  currentPlayer: number;
  lastPlay: LastPlay | null;
  playerHands: Card[][];
  finishedPlayers: number[];
  passedPlayers: number[];
  gameHistory: LastPlay[];
  hostId: string | null;
  roundNumber: number;
}

/**
 * Aggregate root for a single game room.
 *
 * Encapsulates all server-side game rules and state transitions.
 */
export class GameRoom {
  private readonly roomId: string;

  private readonly players: Player[] = [];

  private gameState: GameState = "waiting";

  private currentPlayer = 0;

  private lastPlay: LastPlay | null = null;

  private playerHands: Card[][] = [];

  private finishedPlayers: number[] = [];

  private readonly passedPlayers = new Set<number>();

  private readonly gameHistory: LastPlay[] = [];

  private hostId: string | null = null;

  private roundNumber = 1;

  constructor(roomId: string) {
    this.roomId = roomId;
  }

  /**
   * Marks a player as having left the current round. For the purposes of turn
   * order and minimum player counts, a player who leaves is treated as if they
   * have finished the round.
   */
  playerLeft(playerId: string): { success: boolean; ended: boolean } {
    const index = this.findPlayerIndex(playerId);
    if (index === -1) {
      return { success: false, ended: false };
    }

    const alreadyFinished = this.finishedPlayers.includes(index);

    if (!alreadyFinished) {
      this.finishedPlayers.push(index);
      this.playerHands[index] = [];

      if (this.currentPlayer === index) {
        this.nextPlayer();
      }
    }

    const activePlayers = this.players
      .map((_, i) => i)
      .filter((i) => !this.finishedPlayers.includes(i));

    let ended = false;
    if (activePlayers.length < 3 && this.gameState === "playing") {
      this.gameState = "roundEnd";
      ended = true;
    }

    return { success: true, ended };
  }

  /**
   * Ends the current game at the host's request. All players are considered
   * finished and the game transitions to a terminal roundEnd state.
   */
  endGameByHost(): void {
    this.finishedPlayers = this.players.map((_, index) => index);
    this.playerHands = this.playerHands.map(() => []);
    this.gameState = "roundEnd";
  }

  /**
   * Starts a new round after the previous one has finished, using the
   * finishing order to assign social roles and applying taxes before play.
   */
  startNextRound(): boolean {
    if (this.players.length < 3) {
      return false;
    }

    if (this.gameState !== "roundEnd") {
      return false;
    }

    if (this.finishedPlayers.length !== this.players.length - 1) {
      // Round did not end in the standard \"all but one finished\" state.
      return false;
    }

    const totalPlayers = this.players.length;
    const finishedSet = new Set(this.finishedPlayers);
    const greaterPeonIndex = this.players.findIndex(
      (_, index) => !finishedSet.has(index),
    );

    if (greaterPeonIndex === -1) {
      return false;
    }

    const greaterDalmutiIndex = this.finishedPlayers[0];
    const lesserDalmutiIndex =
      this.finishedPlayers.length > 1 ? this.finishedPlayers[1] : -1;
    const lesserPeonIndex =
      totalPlayers >= 4
        ? this.finishedPlayers[this.finishedPlayers.length - 1]
        : -1;

    const deck = DeckBuilder.createDeck();
    this.playerHands = DeckBuilder.dealCards(deck, this.players.length);

    this.applyTaxes({
      greaterDalmutiIndex,
      lesserDalmutiIndex,
      greaterPeonIndex,
      lesserPeonIndex,
    });

    this.gameState = "playing";
    this.currentPlayer = greaterDalmutiIndex;
    this.lastPlay = null;
    this.finishedPlayers = [];
    this.passedPlayers.clear();
    this.gameHistory.length = 0;
    this.roundNumber += 1;

    return true;
  }

  private applyTaxes(config: {
    greaterDalmutiIndex: number;
    lesserDalmutiIndex: number;
    greaterPeonIndex: number;
    lesserPeonIndex: number;
  }): void {
    const {
      greaterDalmutiIndex,
      lesserDalmutiIndex,
      greaterPeonIndex,
      lesserPeonIndex,
    } = config;

    // Helper to (re)sort a hand by card value.
    const sortHand = (hand: Card[]): Card[] =>
      [...hand].sort((a, b) => a.value - b.value);

    // Greater Peon <-> Greater Dalmuti exchange (two best vs two worst).
    if (
      greaterDalmutiIndex >= 0 &&
      greaterPeonIndex >= 0 &&
      this.playerHands[greaterDalmutiIndex] &&
      this.playerHands[greaterPeonIndex]
    ) {
      let gdHand = sortHand(this.playerHands[greaterDalmutiIndex]);
      let gpHand = sortHand(this.playerHands[greaterPeonIndex]);

      const count = Math.min(2, gdHand.length, gpHand.length);
      if (count > 0) {
        const gpBest = gpHand.slice(0, count);
        const gdWorst = gdHand.slice(gdHand.length - count);

        gpHand = gpHand.slice(count).concat(gdWorst);
        gdHand = gdHand.slice(0, gdHand.length - count).concat(gpBest);

        this.playerHands[greaterPeonIndex] = sortHand(gpHand);
        this.playerHands[greaterDalmutiIndex] = sortHand(gdHand);
      }
    }

    // Lesser Peon <-> Lesser Dalmuti exchange (one best vs one worst).
    if (
      lesserDalmutiIndex >= 0 &&
      lesserPeonIndex >= 0 &&
      this.playerHands[lesserDalmutiIndex] &&
      this.playerHands[lesserPeonIndex]
    ) {
      let ldHand = sortHand(this.playerHands[lesserDalmutiIndex]);
      let lpHand = sortHand(this.playerHands[lesserPeonIndex]);

      const count = Math.min(1, ldHand.length, lpHand.length);
      if (count > 0) {
        const lpBest = lpHand.slice(0, count);
        const ldWorst = ldHand.slice(ldHand.length - count);

        lpHand = lpHand.slice(count).concat(ldWorst);
        ldHand = ldHand.slice(0, ldHand.length - count).concat(lpBest);

        this.playerHands[lesserPeonIndex] = sortHand(lpHand);
        this.playerHands[lesserDalmutiIndex] = sortHand(ldHand);
      }
    }
  }

  addPlayer(playerId: string, playerName: string, socketId: string): boolean {
    if (this.players.length >= 6) {
      return false;
    }

    const player: Player = { id: playerId, name: playerName, socketId };
    this.players.push(player);

    if (this.players.length === 1) {
      this.hostId = playerId;
    }

    return true;
  }

  startGame(): boolean {
    if (this.players.length < 3) {
      return false;
    }

    const deck = DeckBuilder.createDeck();
    this.playerHands = DeckBuilder.dealCards(deck, this.players.length);
    this.gameState = "playing";
    this.currentPlayer = 0;
    this.lastPlay = null;
    this.finishedPlayers = [];
    this.passedPlayers.clear();
    this.gameHistory.length = 0;
    this.roundNumber = 1;

    return true;
  }

  playCards(playerId: string, cardIds: string[]): { success: boolean; error?: string; roundEnd?: boolean } {
    const playerIndex = this.findPlayerIndex(playerId);
    if (playerIndex === -1) {
      return { success: false, error: "Player not found" };
    }

    if (playerIndex !== this.currentPlayer) {
      return { success: false, error: "Not your turn" };
    }

    const hand = this.playerHands[playerIndex] ?? [];
    const selectedCards = hand.filter((card) => cardIds.includes(card.id));

    if (!this.isValidPlay(selectedCards)) {
      return { success: false, error: "Invalid card combination" };
    }

    const nonJester = selectedCards.find((card) => !card.isJester);
    // If at least one non‑Jester is present, the set value is that rank.
    // If the set consists only of Jesters, it counts as value 13 (worst).
    const cardValue = nonJester?.value ?? 13;

    this.lastPlay = {
      player: playerIndex,
      cards: selectedCards,
      value: cardValue,
      count: selectedCards.length,
    };

    this.playerHands[playerIndex] = hand.filter(
      (card) => !selectedCards.some((selected) => selected.id === card.id),
    );

    this.gameHistory.push(this.lastPlay);
    this.passedPlayers.clear();

    if (this.playerHands[playerIndex].length === 0) {
      this.finishedPlayers.push(playerIndex);

      if (this.finishedPlayers.length === this.players.length - 1) {
        this.gameState = "roundEnd";
        return { success: true, roundEnd: true };
      }
    }

    this.nextPlayer();
    return { success: true };
  }

  passPlay(playerId: string): { success: boolean; error?: string } {
    const playerIndex = this.findPlayerIndex(playerId);
    if (playerIndex === -1) {
      return { success: false, error: "Player not found" };
    }

    if (playerIndex !== this.currentPlayer) {
      return { success: false, error: "Not your turn" };
    }

    this.passedPlayers.add(playerIndex);

    const activePlayers = this.players
      .map((_, index) => index)
      .filter((index) => !this.finishedPlayers.includes(index));

    const lastPlayPlayer = this.lastPlay?.player;
    const allPassed = activePlayers.every(
      (index) => this.passedPlayers.has(index) || index === lastPlayPlayer,
    );

    if (allPassed) {
      const nextStartingPlayer = lastPlayPlayer ?? this.currentPlayer;
      this.lastPlay = null;
      this.passedPlayers.clear();
      this.currentPlayer = nextStartingPlayer;
    } else {
      this.nextPlayer();
    }

    return { success: true };
  }

  getState(): GameSnapshot {
    return {
      roomId: this.roomId,
      players: this.players.map<PublicPlayer>((player) => ({
        id: player.id,
        name: player.name,
      })),
      gameState: this.gameState,
      currentPlayer: this.currentPlayer,
      lastPlay: this.lastPlay,
      playerHands: this.playerHands,
      finishedPlayers: [...this.finishedPlayers],
      passedPlayers: Array.from(this.passedPlayers),
      gameHistory: [...this.gameHistory],
      hostId: this.hostId,
      roundNumber: this.roundNumber,
    };
  }

  /**
   * Returns human-readable suggestions for a specific player, used by the
   * frontend \"buddy\" helper. This logic lives next to the rules engine so
   * that tips always stay consistent with the real game rules.
   */
  getBuddyTipsForPlayer(playerId: string): string[] {
    const playerIndex = this.findPlayerIndex(playerId);

    if (playerIndex === -1) {
      return [
        "You are not part of this room. Join the room again from the main menu.",
      ];
    }

    const hand = this.playerHands[playerIndex] ?? [];

    if (this.gameState !== "playing") {
      if (this.gameState === "waiting") {
        const hostName =
          this.players.find((player) => player.id === this.hostId)?.name ??
          "the host";
        return [
          "The game has not started yet.",
          `Wait for ${hostName} to start the game once everyone has joined.`,
        ];
      }

      if (this.gameState === "roundEnd") {
        return [
          "This round has finished.",
          "You can start a new round or create a new room to play again.",
        ];
      }
    }

    if (hand.length === 0) {
      return [
        "You have no cards left in your hand.",
        "You have already finished this round. Watch the remaining players finish up.",
      ];
    }

    const isMyTurn = playerIndex === this.currentPlayer;
    const lastPlay = this.lastPlay;

    if (!isMyTurn) {
      const current =
        this.players[this.currentPlayer]?.name ?? "another player";
      return [
        `It is currently ${current}'s turn.`,
        "Watch what they play and think about whether you could beat that set or would rather pass on your turn.",
      ];
    }

    // Group this player's hand by value and collect Jesters.
    const byValue = new Map<number, Card[]>();
    const jesters: Card[] = [];

    for (const card of hand) {
      if (card.isJester) {
        jesters.push(card);
      } else {
        const existing = byValue.get(card.value) ?? [];
        existing.push(card);
        byValue.set(card.value, existing);
      }
    }

    const tips: string[] = [];

    if (!lastPlay) {
      // Player is leading a new trick.
      tips.push(
        "You are leading a new trick. You can play any set where all non‑Jester cards share the same number.",
      );

      const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);

      // Suggest up to three low single cards.
      for (const value of sortedValues.slice(0, 3)) {
        tips.push(`Play a single ${value} to start with a modest lead.`);
      }

      // Suggest a pair / triple if available.
      for (const value of sortedValues) {
        const cardsOfValue = byValue.get(value)!;
        const total = cardsOfValue.length + jesters.length;
        if (total >= 2) {
          tips.push(
            `You can also lead with a pair of ${value}s (using a Jester as wild if needed).`,
          );
          break;
        }
      }

      if (jesters.length > 0) {
        tips.push(
          "Jesters are wild when mixed with other cards (for example, a 6 and a Jester act like a pair of 6s).",
        );
      }
    } else {
      // Player must follow the current leading set.
      const requiredCount = lastPlay.count;
      const maxValue = lastPlay.value - 1;

      tips.push(
        `To beat the current play, you must play ${requiredCount} cards of a lower rank than ${lastPlay.value}.`,
      );

      const sortedValues = Array.from(byValue.keys()).sort((a, b) => a - b);
      const options: { value: number; usesJesters: boolean }[] = [];

      for (const value of sortedValues) {
        if (value > maxValue) continue;

        const cardsOfValue = byValue.get(value)!;
        const total = cardsOfValue.length + jesters.length;

        if (total >= requiredCount) {
          const usesJesters = cardsOfValue.length < requiredCount;
          options.push({ value, usesJesters });
        }
      }

      if (options.length === 0) {
        tips.push(
          "You do not have any set that can beat the current play. Passing is usually the best choice here.",
        );
      } else {
        for (const option of options.slice(0, 3)) {
          tips.push(
            `Play ${requiredCount} × ${option.value}${
              option.usesJesters ? " using Jesters as wilds" : ""
            } to beat the current set.`,
          );
        }

        tips.push(
          "If you prefer to save strong cards for later, you can still choose to pass instead of beating this play.",
        );
      }
    }

    if (tips.length === 0) {
      tips.push(
        "You can always choose to pass if you are not comfortable with any play.",
      );
    }

    return tips;
  }

  private findPlayerIndex(playerId: string): number {
    return this.players.findIndex((player) => player.id === playerId);
  }

  private isValidPlay(cards: Card[]): boolean {
    if (cards.length === 0) {
      return false;
    }

    const nonJesters = cards.filter((card) => !card.isJester);
    if (nonJesters.length > 0) {
      const value = nonJesters[0]?.value;
      if (!nonJesters.every((card) => card.value === value)) {
        return false;
      }
    }

    // If there is no previous play in the current trick, any valid
    // uniform set (or an all‑Jester set) is allowed as the opening lead.
    if (!this.lastPlay) {
      return true;
    }

    // Subsequent plays must match the card count of the current leading set.
    if (cards.length !== this.lastPlay.count) {
      return false;
    }

    // Compare the value of this set (taking Jesters into account) to the
    // value of the current leading set. Lower is better.
    const currentValue =
      nonJesters.length > 0 ? nonJesters[0]!.value : 13;

    if (currentValue >= this.lastPlay.value) {
      return false;
    }

    return true;
  }

  private nextPlayer(): void {
    if (this.players.length === 0) {
      return;
    }

    let next = (this.currentPlayer + 1) % this.players.length;
    while (this.finishedPlayers.includes(next)) {
      next = (next + 1) % this.players.length;
    }
    this.currentPlayer = next;
  }
}

