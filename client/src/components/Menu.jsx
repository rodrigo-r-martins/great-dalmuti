import { useState } from "react";
import { HowToPlayModal } from "./HowToPlayModal";
import { useGameStore, useConnected, useError } from "../store/gameStore";
import { useGameActions } from "../store/gameActions";

export function Menu() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  
  const connected = useConnected();
  const error = useError();
  const roomId = useGameStore((state) => state.roomId);
  const playerName = useGameStore((state) => state.playerName);
  const setRoomId = useGameStore((state) => state.setRoomId);
  const setPlayerName = useGameStore((state) => state.setPlayerName);
  const { handleCreateRoom, handleJoinRoom } = useGameActions();
  
  // Allow submits as soon as inputs are filled; socket.io will
  // buffer events until the connection is established.
  const canSubmit = roomId.trim() !== "" && playerName.trim() !== "";

  function handleCreate(e) {
    e.preventDefault();
    if (!canSubmit) return;
    handleCreateRoom({ roomId: roomId.trim(), playerName: playerName.trim() });
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!canSubmit) return;
    handleJoinRoom({ roomId: roomId.trim(), playerName: playerName.trim() });
  }

  return (
    <div className="animate-fade-in mx-auto lg:min-w-2xl md:min-w-xl min-w-md max-w-2xl">
      <div className="card-table">
        <form className="flex flex-col gap-6" onSubmit={handleCreate}>
          <label className="flex flex-col items-start gap-2 text-left">
            <span className="text-ui-primary font-semibold">Your Name</span>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter your name"
              className="input-field w-full text-base h-12"
            />
          </label>

          <div className="flex flex-col gap-4">
            <button
              type="submit"
              disabled={!canSubmit}
              className="btn-primary w-full text-lg py-4 disabled:cursor-not-allowed"
            >
              🎮 Create New Game
            </button>
            <button
              type="button"
              disabled={!canSubmit}
              onClick={handleJoin}
              className="btn-primary w-full text-lg py-4 disabled:cursor-not-allowed"
            >
              🚪 Join Game
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <label className="flex flex-col items-start gap-2 text-left">
              <span className="text-ui-secondary text-sm">Room Code</span>
              <input
                type="text"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                placeholder="Enter room code"
                className="input-field w-full text-base h-12"
              />
            </label>
          </div>

          {!connected && (
            <div className="flex items-center justify-center gap-2 text-sm text-ui-muted">
              <span className="h-2 w-2 rounded-full bg-warning animate-pulse"></span>
              <span>Waiting for server connection...</span>
            </div>
          )}

          {error && (
            <div className="rounded-lg border-l-4 border-error bg-red-50 p-3 text-sm text-error">
              {error}
            </div>
          )}
        </form>
        
        <div className="flex items-center justify-center gap-4 pt-4 text-sm">
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="text-ui-muted hover:text-royal-purple transition-colors cursor-pointer"
          >
            📖 How to Play
          </button>
        </div>
      </div>
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </div>
  );
}
