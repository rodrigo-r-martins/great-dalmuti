import { PlayerCard } from "./PlayerCard";
import { useGame } from "../store/gameStore";

export function PlayersList() {
  const game = useGame();

  if (!game) return null;

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-ui-primary mb-4 flex items-center gap-2">
        <span>👤</span>
        <span>Players ({game.players.length}/8)</span>
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
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
