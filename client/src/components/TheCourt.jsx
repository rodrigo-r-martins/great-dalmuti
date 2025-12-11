import { PlayerCard } from "./PlayerCard";

export function TheCourt({ game, playerId }) {
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
            game={game}
            playerId={playerId}
            showCardsLeft={true}
          />
        ))}
      </div>
    </div>
  );
}
