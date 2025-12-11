import { useCallback } from "react";
import { useGame, usePlayerId, useSocketApi } from "../store/gameStore";

interface GameActions {
  handleEndGame: () => void;
  handleLeaveGame: () => void;
  handleStartNextRound: () => void;
}

/**
 * Provides game action handlers with confirmations
 * Now uses Zustand store instead of props
 */
export function useGameActions(): GameActions {
  const socketApi = useSocketApi();
  const game = useGame();
  const playerId = usePlayerId();
  const { emit } = socketApi ?? {};

  const isHost = game?.hostId === playerId;

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
