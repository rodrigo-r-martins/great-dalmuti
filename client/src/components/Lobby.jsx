export function Lobby({ game, playerId, onStartGame }) {
  const isHost = game.hostId === playerId;
  const canStart = isHost && game.gameState === "waiting";

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-6 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
      <h2 className="text-xl font-semibold tracking-tight">Lobby – Room {game.roomId}</h2>
      <p className="mt-2 text-sm text-slate-300">
        Players in room ({game.players.length}):
      </p>
      <ul className="mt-2 flex list-none flex-col gap-1 text-sm">
        {game.players.map((player) => {
          const isYou = player.id === playerId;
          const isFinished = game.finishedPlayers.includes(
            game.players.findIndex((p) => p.id === player.id),
          );
          return (
            <li
              key={player.id}
              className={
                "flex items-center justify-between rounded-md px-2 py-1 " +
                (isYou ? "font-semibold text-sky-200" : "text-slate-100")
              }
            >
              <span>
                {player.name}
                {isYou && " (you)"}
                {player.id === game.hostId && " – host"}
                {isFinished && " – finished"}
              </span>
            </li>
          );
        })}
      </ul>

      {canStart ? (
        <button
          onClick={onStartGame}
          className="mt-4 inline-flex items-center justify-center rounded-full border border-emerald-500/70 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-500/30"
        >
          Start game
        </button>
      ) : (
        <p className="mt-3 text-xs text-slate-400">
          {isHost
            ? "You are the host. Start the game when everyone is ready."
            : "Waiting for the host to start the game..."}
        </p>
      )}
    </div>
  );
}
