import { useCallback } from "react";
import type { SocketApi } from "./useSocket";

interface CreateRoomParams {
  roomId: string;
  playerName: string;
}

interface GameHandlers {
  handleCreateRoom: (params: CreateRoomParams) => void;
  handleJoinRoom: (params: CreateRoomParams) => void;
  handleStartGame: () => void;
  handlePlayCards: (cardIds: string[]) => void;
  handlePass: () => void;
  handleLeaveRoom: () => void;
}

/**
 * Provides game action handlers (create room, join, play cards, etc.)
 */
export function useGameHandlers(
  socketApi: SocketApi | null,
  roomId: string,
  playerId: string,
  setError: (error: string | null) => void,
): GameHandlers {
  const { emit } = socketApi ?? {};

  const handleCreateRoom = useCallback(
    ({ roomId: id, playerName: name }: CreateRoomParams) => {
      if (!emit) return;
      setError(null);
      emit("createRoom", { roomId: id, playerId, playerName: name });
    },
    [emit, playerId, setError],
  );

  const handleJoinRoom = useCallback(
    ({ roomId: id, playerName: name }: CreateRoomParams) => {
      if (!emit) return;
      setError(null);
      emit("joinRoom", { roomId: id, playerId, playerName: name });
    },
    [emit, playerId, setError],
  );

  const handleStartGame = useCallback(() => {
    if (!emit || !roomId) return;
    setError(null);
    emit("startGame", { roomId });
  }, [emit, roomId, setError]);

  const handlePlayCards = useCallback(
    (cardIds: string[]) => {
      if (!emit || !roomId) return;
      setError(null);
      emit("playCards", { roomId, playerId, cardIds });
    },
    [emit, roomId, playerId, setError],
  );

  const handlePass = useCallback(() => {
    if (!emit || !roomId) return;
    setError(null);
    emit("passPlay", { roomId, playerId });
  }, [emit, roomId, playerId, setError]);

  const handleLeaveRoom = useCallback(() => {
    if (!emit || !roomId) return;
    setError(null);
    emit("leaveGame", { roomId, playerId });
  }, [emit, roomId, playerId, setError]);

  return {
    handleCreateRoom,
    handleJoinRoom,
    handleStartGame,
    handlePlayCards,
    handlePass,
    handleLeaveRoom,
  };
}
