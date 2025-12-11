import { useState } from "react";
import { HowToPlayModal } from "./HowToPlayModal";

export function Lobby({ game, playerId, onStartGame, onLeaveRoom }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const isHost = game.hostId === playerId;
  const canStart = isHost && game.gameState === "waiting";

  function handleCopyRoomCode() {
    navigator.clipboard.writeText(game.roomId);
  }

  function handleShareRoom() {
    if (navigator.share) {
      navigator.share({
        title: "Join my Great Dalmuti game!",
        text: `Join room ${game.roomId}`,
      });
    } else {
      handleCopyRoomCode();
    }
  }

  return (
    <div className="animate-fade-in mx-auto max-w-4xl">
      <div className="card-table mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="font-display text-3xl font-bold text-royal-purple-dark mb-1">
              👑 The Great Dalmuti
            </h2>
            <div className="flex items-center gap-2 text-ui-secondary">
              <span className="font-semibold">Room: {game.roomId}</span>
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

        {/* Players Section */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-ui-primary mb-4">
            👤 Players ({game.players.length}/6)
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {game.players.map((player) => {
              const isYou = player.id === playerId;
              const isHostPlayer = player.id === game.hostId;
              const isFinished = game.finishedPlayers.includes(
                game.players.findIndex((p) => p.id === player.id),
              );
              
              return (
                <div
                  key={player.id}
                  className={`player-card ${isHostPlayer ? 'is-host' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isHostPlayer && <span className="text-xl">👑</span>}
                      <span className={`font-semibold ${isYou ? 'text-royal-purple' : 'text-ui-primary'}`}>
                        {player.name}
                        {isYou && " (You)"}
                      </span>
                    </div>
                    <span className="h-3 w-3 rounded-full bg-forest-green-light"></span>
                  </div>
                  {isFinished && (
                    <span className="text-xs text-ui-muted mt-1 block">Finished</span>
                  )}
                </div>
              );
            })}
          </div>
          {game.players.length < 6 && (
            <p className="mt-3 text-sm text-ui-muted italic">
              + Waiting for more players...
            </p>
          )}
        </div>

        {/* Chat Section (UI only for now) */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-ui-primary mb-3">💬 Chat</h3>
          <div className="bg-parchment-dark rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
            <p className="text-sm text-ui-muted italic">Chat feature coming soon...</p>
          </div>
          <div className="mt-2 flex gap-2">
            <input
              type="text"
              placeholder="Type message..."
              disabled
              className="input-field flex-1 text-sm"
            />
            <button
              disabled
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {canStart ? (
              <button
                onClick={onStartGame}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-lg"
              >
                Start Game
              </button>
            ) : (
              <p className="text-sm text-ui-muted py-2">
                {isHost
                  ? "You are the host. Start the game when everyone is ready (needs 3+ players)."
                  : "Waiting for the host to start the game..."}
              </p>
            )}
            <button
              onClick={onLeaveRoom}
              className="btn-secondary w-full sm:w-auto px-6 py-3"
            >
              Leave Room
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="text-ui-muted hover:text-medieval-gold transition-colors cursor-pointer"
          >
            📖 How to Play
          </button>
          
        </div>
      </div>
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </div>
  );
}
