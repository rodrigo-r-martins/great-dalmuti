import { useRoomSharing } from "../hooks/useRoomSharing";

export function LobbyHeader({ roomId }) {
  const { handleCopyRoomCode, handleShareRoom } = useRoomSharing(roomId);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="font-display text-3xl font-bold text-royal-purple-dark mb-1">
          👑 The Great Dalmuti
        </h2>
        <div className="flex items-center gap-2 text-ui-secondary">
          <span className="font-semibold">Room: {roomId}</span>
          <button
            onClick={handleCopyRoomCode}
            className="text-sm text-royal-purple hover:text-royal-purple-dark transition-colors"
            title="Copy room code"
          >
            📋 Copy
          </button>
          <button
            onClick={handleShareRoom}
            className="text-sm text-royal-purple hover:text-royal-purple-dark transition-colors"
            title="Share room"
          >
            🔗 Share
          </button>
        </div>
      </div>
    </div>
  );
}
