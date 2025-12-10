export function Lobby({ game, playerId, onStartGame }) {
  const isHost = game.hostId === playerId;
  const canStart = isHost && game.gameState === "waiting";

  return (
    <div className="panel">
      <h2>Lobby – Room {game.roomId}</h2>
      <p>
        Players in room ({game.players.length}):
      </p>
      <ul className="players-list">
        {game.players.map((player) => {
          const isYou = player.id === playerId;
          const isFinished = game.finishedPlayers.includes(
            game.players.findIndex((p) => p.id === player.id),
          );
          return (
            <li key={player.id} className={isYou ? "player player--you" : "player"}>
              {player.name}
              {isYou && " (you)"}
              {player.id === game.hostId && " – host"}
              {isFinished && " – finished"}
            </li>
          );
        })}
      </ul>

      {canStart ? (
        <button onClick={onStartGame}>Start game</button>
      ) : (
        <p className="hint">
          {isHost
            ? "You are the host. Start the game when everyone is ready."
            : "Waiting for the host to start the game..."}
        </p>
      )}
    </div>
  );
}
