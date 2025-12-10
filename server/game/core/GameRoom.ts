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

