import { useRoomSharing } from "../hooks/useRoomSharing";
import { useRoomId } from "../store/gameStore";

export function LobbyHeader() {
  const roomId = useRoomId();
  const { handleCopyRoomCode, handleShareRoom } = useRoomSharing(roomId);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-royal-purple-dark mb-1">
          👑 The Great Dalmuti
        </h2>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-ui-secondary">
          <span className="font-semibold">Room: {roomId}</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopyRoomCode}
              className="flex items-center gap-1 text-sm text-royal-purple hover:text-royal-purple-dark transition-colors font-medium"
              title="Copy room code"
            >
              📋 Copy
            </button>
            <button
              onClick={handleShareRoom}
              className="flex items-center gap-1 text-sm text-royal-purple hover:text-royal-purple-dark transition-colors font-medium"
              title="Share room"
            >
              🔗 Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
