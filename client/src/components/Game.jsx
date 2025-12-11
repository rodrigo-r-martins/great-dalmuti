import { useEffect, useState, useRef } from "react";
import { PlayerHand } from "./PlayerHand";

export function Game({ game, playerId, onPlayCards, onPass, error, socketApi }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBuddy, setShowBuddy] = useState(true);
  const [buddyTips, setBuddyTips] = useState([]);

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";
  const isHost = game.hostId === playerId;
  const prevIsMyTurnRef = useRef(false);

  // Play beep sound when it becomes the player's turn
  useEffect(() => {
    // Only play sound when transitioning from not-my-turn to my-turn
    if (isMyTurn && !prevIsMyTurnRef.current && game.gameState === "playing") {
      try {
        // Create a simple beep sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Beep frequency in Hz
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Cleanup
        setTimeout(() => {
          oscillator.disconnect();
          gainNode.disconnect();
          audioContext.close();
        }, 400);
      } catch (error) {
        // Silently fail if audio context is not available
        console.debug("Could not play turn sound:", error);
      }
    }
    // Update the ref for next comparison
    prevIsMyTurnRef.current = isMyTurn;
  }, [isMyTurn, game.gameState]);

  // Play beep sound when it's the player's turn
  useEffect(() => {
    if (isMyTurn && game.gameState === "playing") {
      // Create a simple beep sound using Web Audio API
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800; // Beep frequency in Hz
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);

      return () => {
        oscillator.disconnect();
        gainNode.disconnect();
      };
    }
  }, [isMyTurn, game.gameState]);

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

  const { emit, on, off } = socketApi ?? {};

  useEffect(() => {
    if (!on || !off) return;

    function handleBuddyTips(payload) {
      if (!payload) return;
      if (payload.playerId && payload.playerId !== playerId) return;
      setBuddyTips(Array.isArray(payload.tips) ? payload.tips : []);
    }

    on("buddyTips", handleBuddyTips);
    return () => {
      off("buddyTips", handleBuddyTips);
    };
  }, [on, off, playerId]);

  useEffect(() => {
    if (!emit || !game) return;
    emit("requestTips", { roomId: game.roomId, playerId });
  }, [emit, game, playerId]);

  function handleEndGameClick() {
    if (!emit || !isHost) return;
    const confirmed = window.confirm(
      "Are you sure you want to end the game for everyone?",
    );
    if (!confirmed) return;
    emit("endGame", { roomId: game.roomId, playerId });
  }

  function handleLeaveGameClick() {
    if (!emit) return;
    const confirmed = window.confirm(
      "Are you sure you want leave this game?",
    );
    if (!confirmed) return;
    emit("leaveGame", { roomId: game.roomId, playerId });
  }

  function handleStartNextRoundClick() {
    if (!emit || !isHost) return;
    if (game.gameState !== "roundEnd") return;
    const confirmed = window.confirm(
      "Start a new round using the current ranking (with card taxes applied)?",
    );
    if (!confirmed) return;
    emit("startNextRound", { roomId: game.roomId, playerId });
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      {/* Header */}
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
              ? 'border-medieval-gold bg-gradient-to-r from-medieval-gold/20 to-gold-light/20 text-medieval-gold turn-indicator' 
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

      {/* The Court (players around the table) */}
      <div className="card-table">
        <h3 className="text-xl font-display font-bold text-royal-purple-dark mb-4">
          THE COURT
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {game.players.map((player, index) => {
            const isYou = player.id === playerId;
            const isFinished = game.finishedPlayers.includes(index);
            const isCurrent = index === game.currentPlayer;
            const cardsLeft = game.playerHands[index]?.length ?? 0;

            let role = "";
            if (player.id === game.hostId) {
              role = "👑 Host";
            } else if (game.gameState === "roundEnd") {
              const pos = game.finishedPlayers.indexOf(index);
              if (pos === 0) {
                role = "👑 The Great Dalmuti";
              } else if (pos === 1) {
                role = "👑 Lesser Dalmuti";
              } else if (pos === game.players.length - 1) {
                role = "Greater Peon";
              } else if (pos === game.players.length - 2) {
                role = "Lesser Peon";
              } else if (pos >= 0) {
                role = "Merchant";
              }
            }

            return (
              <div
                key={player.id}
                className={`player-card ${isCurrent ? 'current-turn' : ''} ${player.id === game.hostId ? 'is-host' : ''} ${isFinished ? 'opacity-60' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {isCurrent && <span className="text-lg">⏳</span>}
                    {player.id === game.hostId && <span className="text-lg">👑</span>}
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
                  <span className="text-sm font-semibold text-ui-primary">
                    🃏 × {cardsLeft}
                  </span>
                  {isFinished && (
                    <span className="text-xs text-ui-muted">✓ Finished</span>
                  )}
                  {isCurrent && game.gameState === "playing" && (
                    <span className="text-xs font-semibold text-medieval-gold">TURN</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Last Play */}
      {lastPlay && (
        <div className="card-table">
          <h3 className="text-lg font-semibold text-ui-primary mb-2">Last Play</h3>
          <div className="flex items-center gap-3">
            <span className="text-ui-secondary">
              {game.players[lastPlay.player]?.name ?? "?"} played:
            </span>
            <div className="flex gap-2">
              {lastPlay.cards.map((card, idx) => (
                <div
                  key={idx}
                  className="w-12 h-16 rounded border-2 border-medieval-gold bg-gradient-to-br from-medieval-gold/30 to-gold-light/30 flex items-center justify-center font-bold text-medieval-gold"
                >
                  {card.isJester ? "J" : String(card.value)}
                </div>
              ))}
            </div>
            <span className="text-sm text-ui-muted">
              ({lastPlay.cards.length} card{lastPlay.cards.length !== 1 ? 's' : ''})
            </span>
          </div>
        </div>
      )}

      {/* Your Hand */}
      <div className="card-table">
        <h3 className="text-xl font-display font-bold text-royal-purple-dark mb-2">
          YOUR HAND
        </h3>
        <p className="text-sm text-ui-secondary mb-4">
          Select cards to play
        </p>
        <PlayerHand hand={myHand} selectedIds={selectedIds} onToggleCard={toggleCard} />

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            disabled={!isMyTurn || selectedIds.length === 0}
            className="btn-primary px-8 py-3 text-lg disabled:cursor-not-allowed"
          >
            ▶ Play {selectedIds.length > 0 ? `${selectedIds.length} Card${selectedIds.length !== 1 ? 's' : ''}` : 'Cards'}
          </button>
          <button
            type="button"
            onClick={handlePass}
            disabled={!isMyTurn}
            className="btn-secondary px-8 py-3 text-lg disabled:cursor-not-allowed"
          >
            Pass
          </button>
        </div>

        {game.gameState === "roundEnd" && (
          <div className="mt-4 rounded-lg border-l-4 border-medieval-gold bg-gold-light/10 p-3">
            <p className="text-sm font-semibold text-medieval-gold">
              Round finished! {isHost && "Start a new round when ready."}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-4 rounded-lg border-l-4 border-error bg-red-50 p-3">
            <p className="text-sm font-medium text-error">
              {error}
            </p>
          </div>
        )}

        <div className="mt-6 flex justify-between gap-3 text-sm">
          {isHost ? (
            <>
              {game.gameState === "roundEnd" ? (
                <>
                  <button
                    type="button"
                    onClick={handleStartNextRoundClick}
                    className="btn-primary px-4 py-2 text-sm"
                  >
                    Start new round
                  </button>
                  <button
                    type="button"
                    onClick={handleLeaveGameClick}
                    className="btn-secondary px-4 py-2 text-sm"
                  >
                    Leave game
                  </button>
                </>
              ) : (
                <button
                  type="button"
                  onClick={handleEndGameClick}
                  className="btn-secondary px-4 py-2 text-sm border-burgundy text-burgundy hover:bg-burgundy/10"
                >
                  End game
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              onClick={handleLeaveGameClick}
              className="btn-secondary px-4 py-2 text-sm"
            >
              Leave game
            </button>
          )}
        </div>
      </div>

      {/* Dalmuti Buddy (contextual helper) */}
      <div className="card-table">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <h3 className="text-lg font-semibold text-ui-primary">
              Dalmuti Buddy
            </h3>
            <p className="text-xs text-ui-muted mt-1">
              Simple suggestions to help you learn which plays are valid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBuddy((value) => !value)}
            className="btn-secondary px-3 py-1.5 text-sm"
          >
            {showBuddy ? "Hide" : "Show"}
          </button>
        </div>

        {showBuddy && (
          <>
            {buddyTips.length === 0 ? (
              <p className="text-sm text-ui-muted">
                Waiting for tips from the server...
              </p>
            ) : (
              <ul className="list-disc space-y-2 pl-5 text-sm text-ui-secondary">
                {buddyTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
