import { useGame, usePlayerId } from "../store/gameStore";

export function GameHeader() {
  const game = useGame();
  const playerId = usePlayerId();

  if (!game) return null;

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";

  return (
    <div className="card-table">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-royal-purple-dark">
            👑 The Great Dalmuti
          </h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-ui-secondary">
            <span>Round {game.roundNumber || 1}</span>
            <span>•</span>
            <span>Room: {game.roomId}</span>
          </div>
        </div>
        <div className={`inline-flex items-center gap-2 rounded-full border-2 px-4 py-2 font-semibold ${
          isMyTurn 
            ? 'border-medieval-gold bg-linear-to-r from-medieval-gold/20 to-gold-light/20 text-medieval-gold turn-indicator' 
            : 'border-royal-purple bg-royal-purple/10 text-royal-purple'
        }`}>
          <span>⏳</span>
          <span>
            {game.players[game.currentPlayer]?.name ?? "?"}
            {'\'s turn'}
          </span>
        </div>
      </div>
    </div>
  );
}
