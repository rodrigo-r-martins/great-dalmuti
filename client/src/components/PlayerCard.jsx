import { getPlayerRole } from "../utils/playerUtils";
import { useGame, usePlayerId } from "../store/gameStore";

export function PlayerCard({ player, playerIndex, showCardsLeft = true }) {
  const game = useGame();
  const playerId = usePlayerId();

  if (!game) return null;

  const isYou = player.id === playerId;
  const isHost = player.id === game.hostId;
  const isFinished = game.finishedPlayers.includes(playerIndex);
  const isCurrent = playerIndex === game.currentPlayer;
  const cardsLeft = game.playerHands[playerIndex]?.length ?? 0;
  const role = getPlayerRole(playerIndex, game, game.hostId);

  return (
    <div
      className={`player-card ${isCurrent ? 'current-turn' : ''} ${isHost ? 'is-host' : ''} ${isFinished ? 'opacity-60' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isCurrent && <span className="text-lg">⏳</span>}
          {isHost && <span className="text-lg">👑</span>}
          <span className={`font-semibold ${isYou ? 'text-royal-purple' : 'text-ui-primary'}`}>
            {player.name}
            {isYou && " (You)"}
          </span>
        </div>
      </div>
      {role && (
        <p className="text-xs text-ui-secondary mb-2">{role}</p>
      )}
      <div className="flex items-center justify-between">
        {showCardsLeft && (
          <span className="text-sm font-semibold text-ui-primary">
            🃏 × {cardsLeft}
          </span>
        )}
        {isFinished && (
          <span className="text-xs text-ui-muted">✓ Finished</span>
        )}
        {isCurrent && game.gameState === "playing" && (
          <span className="text-xs font-semibold text-medieval-gold">TURN</span>
        )}
      </div>
    </div>
  );
}
