import { useState } from "react";
import { PlayerHand } from "./PlayerHand";

export function Game({ game, playerId, onPlayCards, onPass, error }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";

  function toggleCard(cardId) {
    setSelectedIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId],
    );
  }

  function handlePlay() {
    if (!isMyTurn || selectedIds.length === 0) return;
    onPlayCards(selectedIds);
    setSelectedIds([]);
  }

  function handlePass() {
    if (!isMyTurn) return;
    onPass();
    setSelectedIds([]);
  }

  const lastPlay = game.lastPlay;

  return (
    <div className="game">
      <div className="panel">
        <h2>Room {game.roomId}</h2>
        <p>
          Turn: <strong>{game.players[game.currentPlayer]?.name ?? "?"}</strong>
        </p>
        <p>
          You are: <strong>{game.players[myIndex]?.name ?? "Unknown"}</strong>
          {isMyTurn && " – your turn!"}
        </p>

        {lastPlay ? (
          <div className="last-play">
            <span>Last play by {game.players[lastPlay.player]?.name ?? "?"}:</span>
            <span>
              {lastPlay.cards.map((card) =>
                card.isJester ? "J" : String(card.value),
              ).join(" ")}
            </span>
          </div>
        ) : (
          <p className="hint">No cards played yet this trick.</p>
        )}

        {game.gameState === "roundEnd" && (
          <p className="hint">Round finished! A new round will be implemented later.</p>
        )}

        {error && <p className="error-text">{error}</p>}
      </div>

      <div className="panel">
        <h3>Your hand</h3>
        <PlayerHand hand={myHand} selectedIds={selectedIds} onToggleCard={toggleCard} />

        <div className="actions">
          <button
            type="button"
            onClick={handlePlay}
            disabled={!isMyTurn || selectedIds.length === 0}
          >
            Play selected
          </button>
          <button type="button" onClick={handlePass} disabled={!isMyTurn}>
            Pass
          </button>
        </div>
      </div>

      <div className="panel">
        <h3>Players</h3>
        <ul className="players-list">
          {game.players.map((player, index) => {
            const isYou = player.id === playerId;
            const isFinished = game.finishedPlayers.includes(index);
            const isCurrent = index === game.currentPlayer;

            return (
              <li
                key={player.id}
                className={
                  "player" +
                  (isYou ? " player--you" : "") +
                  (isCurrent ? " player--current" : "") +
                  (isFinished ? " player--finished" : "")
                }
              >
                {player.name}
                {isYou && " (you)"}
                {isFinished && " – out"}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
