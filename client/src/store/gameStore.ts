import { create } from "zustand";
import type { GameSnapshot } from "../../../shared/types";
import type { SocketApi } from "../hooks/useSocket";

type View = "menu" | "lobby" | "game";

interface GameState {
  // State
  view: View;
  game: GameSnapshot | null;
  playerId: string;
  playerName: string;
  roomId: string;
  error: string | null;
  connected: boolean;
  socketApi: SocketApi | null;

  // Actions
  setView: (view: View) => void;
  setGame: (game: GameSnapshot | null) => void;
  setPlayerId: (playerId: string) => void;
  setPlayerName: (playerName: string) => void;
  setRoomId: (roomId: string) => void;
  setError: (error: string | null) => void;
  setConnected: (connected: boolean) => void;
  setSocketApi: (socketApi: SocketApi | null) => void;
  reset: () => void;
}

const initialState = {
  view: "menu" as View,
  game: null,
  playerId: "",
  playerName: "",
  roomId: "",
  error: null,
  connected: false,
  socketApi: null,
};

export const useGameStore = create<GameState>((set) => ({
  ...initialState,

  setView: (view) => set({ view }),
  setGame: (game) => set({ game }),
  setPlayerId: (playerId) => set({ playerId }),
  setPlayerName: (playerName) => set({ playerName }),
  setRoomId: (roomId) => set({ roomId }),
  setError: (error) => set({ error }),
  setConnected: (connected) => set({ connected }),
  setSocketApi: (socketApi) => set({ socketApi }),
  reset: () => set(initialState),
}));

// Selectors for common use cases (exported for convenience)
export function useGame() {
  return useGameStore((state) => state.game);
}

export function usePlayerId() {
  return useGameStore((state) => state.playerId);
}

export function useRoomId() {
  return useGameStore((state) => state.roomId);
}

export function usePlayerName() {
  return useGameStore((state) => state.playerName);
}

export function useError() {
  return useGameStore((state) => state.error);
}

export function useConnected() {
  return useGameStore((state) => state.connected);
}

export function useSocketApi() {
  return useGameStore((state) => state.socketApi);
}

export function useView() {
  return useGameStore((state) => state.view);
}
