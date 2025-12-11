import { useCallback } from "react";

interface RoomSharingHandlers {
  handleCopyRoomCode: () => void;
  handleShareRoom: () => void;
}

/**
 * Provides room sharing functionality (copy/share room code)
 */
export function useRoomSharing(roomId: string): RoomSharingHandlers {
  const handleCopyRoomCode = useCallback(() => {
    navigator.clipboard.writeText(roomId);
  }, [roomId]);

  const handleShareRoom = useCallback(() => {
    if (navigator.share) {
      navigator.share({
        title: "Join my Great Dalmuti game!",
        text: `Join room ${roomId}`,
      });
    } else {
      handleCopyRoomCode();
    }
  }, [roomId, handleCopyRoomCode]);

  return {
    handleCopyRoomCode,
    handleShareRoom,
  };
}
