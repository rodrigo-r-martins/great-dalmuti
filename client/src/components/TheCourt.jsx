import { PlayerCard } from "./PlayerCard";
import { useGame } from "../store/gameStore";

export function TheCourt() {
  const game = useGame();

  if (!game) return null;

  return (
    <div className="card-table">
      <h3 className="text-xl font-display font-bold text-royal-purple-dark mb-4">
        THE COURT
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {game.players.map((player, index) => (
          <PlayerCard
            key={player.id}
            player={player}
            playerIndex={index}
            showCardsLeft={true}
          />
        ))}
      </div>
    </div>
  );
}
