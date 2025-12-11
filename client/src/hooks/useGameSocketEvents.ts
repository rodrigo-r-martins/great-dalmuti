import { useEffect } from "react";
import type { GameSnapshot } from "../../../shared/types";
import { useGameStore } from "../store/gameStore";

const VIEW_MENU = "menu";
const VIEW_LOBBY = "lobby";
const VIEW_GAME = "game";

/**
 * Manages socket event listeners for game state changes
 * Now uses Zustand store instead of props
 */
export function useGameSocketEvents(): void {
  const socketApi = useGameStore((state) => state.socketApi);
  const setGame = useGameStore((state) => state.setGame);
  const setView = useGameStore((state) => state.setView);
  const setError = useGameStore((state) => state.setError);
  const setRoomId = useGameStore((state) => state.setRoomId);

  const { on, off } = socketApi ?? {};

  useEffect(() => {
    if (!on || !off) return;

    function handleRoomCreated(...args: unknown[]) {
      const nextState = args[0] as GameSnapshot;
      setGame(nextState);
      setRoomId(nextState.roomId);
      setView(VIEW_LOBBY);
      setError(null);
    }

    function handlePlayerJoined(...args: unknown[]) {
      const nextState = args[0] as GameSnapshot;
      setGame(nextState);
      setView(VIEW_LOBBY);
      setError(null);
    }

    function handleGameUpdated(...args: unknown[]) {
      const nextState = args[0] as GameSnapshot;
      setGame(nextState);
      setError(null);
      if (nextState.gameState === "playing" || nextState.gameState === "roundEnd") {
        setView(VIEW_GAME);
      }
    }

    function handleError(...args: unknown[]) {
      const payload = args[0] as { message?: string } | string | undefined;
      const message = typeof payload === "string" ? payload : payload?.message ?? "Unknown error";
      console.error("Server error:", message);
      setError(message);
    }

    function handleLeftGame() {
      setGame(null);
      setView(VIEW_MENU);
    }

    on("roomCreated", handleRoomCreated);
    on("playerJoined", handlePlayerJoined);
    on("gameStarted", handleGameUpdated);
    on("cardsPlayed", handleGameUpdated);
    on("playerPassed", handleGameUpdated);
    on("error", handleError);
    on("gameEnded", handleGameUpdated);
    on("leftGame", handleLeftGame);

    return () => {
      off("roomCreated", handleRoomCreated);
      off("playerJoined", handlePlayerJoined);
      off("gameStarted", handleGameUpdated);
      off("cardsPlayed", handleGameUpdated);
      off("playerPassed", handleGameUpdated);
      off("error", handleError);
      off("gameEnded", handleGameUpdated);
      off("leftGame", handleLeftGame);
    };
  }, [on, off, setGame, setView, setError, setRoomId]);
}
