import { PlayerCard } from "./PlayerCard";
import { useGame } from "../store/gameStore";

export function PlayersList() {
  const game = useGame();

  if (!game) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-ui-primary mb-4">
        👤 Players ({game.players.length}/6)
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {game.players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            playerIndex={index}
            showCardsLeft={false}
          />
        ))}
      </div>
      {game.players.length < 6 && (
        <p className="mt-3 text-sm text-ui-muted italic">
          + Waiting for more players...
        </p>
      )}
    </div>
  );
}
