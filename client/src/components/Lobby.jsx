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
    <div className="animate-fade-in mx-auto max-w-4xl px-2 sm:px-0">
      <div className="card-table mb-6">
        <LobbyHeader />
        <PlayersList />
        <ChatSection />

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-2 border-t border-parchment-dark">
          <div className="flex flex-col sm:flex-row gap-3">
            {canStart ? (
              <button
                onClick={handleStartGame}
                className="btn-primary w-full sm:w-auto px-8 py-3 text-lg order-1 sm:order-none"
              >
                Start Game
              </button>
            ) : (
              <div className="flex-1 bg-parchment-dark/50 rounded-lg px-4 py-3 border border-medieval-gold/20 order-2 sm:order-none">
                <p className="text-sm text-ui-secondary">
                  {isHost
                    ? "👑 You are the host. Start the game when everyone is ready (3+ players)."
                    : "⏳ Waiting for the host to start the game..."}
                </p>
              </div>
            )}
            <button
              onClick={handleLeaveRoom}
              className="btn-secondary w-full sm:w-auto px-6 py-3 order-3 sm:order-none"
            >
              Leave Room
            </button>
          </div>
          <button
            type="button"
            onClick={() => setShowHowToPlay(true)}
            className="text-ui-muted hover:text-medieval-gold transition-colors cursor-pointer text-sm font-medium self-center sm:self-start flex items-center gap-2"
          >
            <span>📖</span>
            <span>How to Play</span>
          </button>
        </div>
      </div>
      <HowToPlayModal isOpen={showHowToPlay} onClose={() => setShowHowToPlay(false)} />
    </div>
  );
}
