import { useState } from "react";
import { HowToPlayModal } from "./HowToPlayModal";
import { LobbyHeader } from "./LobbyHeader";
import { PlayersList } from "./PlayersList";
import { ChatSection } from "./ChatSection";
import { useGame, usePlayerId } from "../store/gameStore";
import { useGameActions } from "../store/gameActions";

export function Lobby() {
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const game = useGame();
  const playerId = usePlayerId();
  const { handleStartGame, handleLeaveRoom } = useGameActions();
  
  if (!game) return null;
  
  const isHost = game.hostId === playerId;
  const canStart = isHost && game.gameState === "waiting";

  return (
    <div className="animate-fade-in mx-auto max-w-4xl">
      <div className="card-table mb-6">
        <LobbyHeader />
        <PlayersList />
        <ChatSection />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3">
            {canStart ? (
              <button
                onClick={handleStartGame}
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
              onClick={handleLeaveRoom}
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
