import { useCallback } from "react";
import { useGameStore } from "./gameStore";

interface CreateRoomParams {
  roomId: string;
  playerName: string;
}

/**
 * Custom hook for game actions that uses the Zustand store
 */
export function useGameActions() {
  const socketApi = useGameStore((state) => state.socketApi);
  const roomId = useGameStore((state) => state.roomId);
  const playerId = useGameStore((state) => state.playerId);
  const setError = useGameStore((state) => state.setError);

  const handleCreateRoom = useCallback(
    ({ roomId: id, playerName: name }: CreateRoomParams) => {
      if (!socketApi?.emit) return;
      setError(null);
      socketApi.emit("createRoom", { roomId: id, playerId, playerName: name });
    },
    [socketApi, playerId, setError],
  );

  const handleJoinRoom = useCallback(
    ({ roomId: id, playerName: name }: CreateRoomParams) => {
      if (!socketApi?.emit) return;
      setError(null);
      socketApi.emit("joinRoom", { roomId: id, playerId, playerName: name });
    },
    [socketApi, playerId, setError],
  );

  const handleStartGame = useCallback(() => {
    if (!socketApi?.emit || !roomId) return;
    setError(null);
    socketApi.emit("startGame", { roomId });
  }, [socketApi, roomId, setError]);

  const handlePlayCards = useCallback(
    (cardIds: string[]) => {
      if (!socketApi?.emit || !roomId) return;
      setError(null);
      socketApi.emit("playCards", { roomId, playerId, cardIds });
    },
    [socketApi, roomId, playerId, setError],
  );

  const handlePass = useCallback(() => {
    if (!socketApi?.emit || !roomId) return;
    setError(null);
    socketApi.emit("passPlay", { roomId, playerId });
  }, [socketApi, roomId, playerId, setError]);

  const handleLeaveRoom = useCallback(() => {
    if (!socketApi?.emit || !roomId) return;
    setError(null);
    socketApi.emit("leaveGame", { roomId, playerId });
  }, [socketApi, roomId, playerId, setError]);

  return {
    handleCreateRoom,
    handleJoinRoom,
    handleStartGame,
    handlePlayCards,
    handlePass,
    handleLeaveRoom,
  };
}
