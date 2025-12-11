/**
 * Shared types between client and server
 * This file can be imported by both frontend and backend
 */

export interface Card {
  id: string;
  value: number;
  isJester: boolean;
}

export interface Player {
  id: string;
  name: string;
  socketId: string;
}

export interface PublicPlayer {
  id: string;
  name: string;
}

export type GameState = "waiting" | "playing" | "roundEnd";

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
