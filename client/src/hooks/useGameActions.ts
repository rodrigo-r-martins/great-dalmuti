import { useCallback } from "react";
import type { GameSnapshot } from "../../../shared/types";
import type { SocketApi } from "./useSocket";

interface GameActions {
  handleEndGame: () => void;
  handleLeaveGame: () => void;
  handleStartNextRound: () => void;
}

/**
 * Provides game action handlers with confirmations
 */
export function useGameActions(
  socketApi: SocketApi | null,
  game: GameSnapshot | null,
  playerId: string,
  isHost: boolean,
): GameActions {
  const { emit } = socketApi ?? {};

  const handleEndGame = useCallback(() => {
    if (!emit || !isHost || !game) return;
    const confirmed = window.confirm(
      "Are you sure you want to end the game for everyone?",
    );
    if (!confirmed) return;
    emit("endGame", { roomId: game.roomId, playerId });
  }, [emit, isHost, game, playerId]);

  const handleLeaveGame = useCallback(() => {
    if (!emit || !game) return;
    const confirmed = window.confirm(
      "Are you sure you want leave this game?",
    );
    if (!confirmed) return;
    emit("leaveGame", { roomId: game.roomId, playerId });
  }, [emit, game, playerId]);

  const handleStartNextRound = useCallback(() => {
    if (!emit || !isHost || !game) return;
    if (game.gameState !== "roundEnd") return;
    const confirmed = window.confirm(
      "Start a new round using the current ranking (with card taxes applied)?",
    );
    if (!confirmed) return;
    emit("startNextRound", { roomId: game.roomId, playerId });
  }, [emit, isHost, game, playerId]);

  return {
    handleEndGame,
    handleLeaveGame,
    handleStartNextRound,
  };
}
