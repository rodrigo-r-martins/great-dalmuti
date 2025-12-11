import { useState } from "react";
import { HowToPlayModal } from "./HowToPlayModal";
import { LobbyHeader } from "./LobbyHeader";
import { PlayersList } from "./PlayersList";
import { ChatSection } from "./ChatSection";

export function Lobby({ game, playerId, onStartGame, onLeaveRoom }) {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const isHost = game.hostId === playerId;
  const canStart = isHost && game.gameState === "waiting";

  return (
    <div className="animate-fade-in mx-auto max-w-4xl">
      <div className="card-table mb-6">
        <LobbyHeader roomId={game.roomId} />
        <PlayersList game={game} playerId={playerId} />
        <ChatSection />

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
