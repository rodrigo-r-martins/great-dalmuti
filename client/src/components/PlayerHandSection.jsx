import { PlayerHand } from "./PlayerHand";

export function PlayerHandSection({
  hand,
  selectedIds,
  onToggleCard,
  onPlay,
  onPass,
  isMyTurn,
  gameState,
  isHost,
  error,
  gameActions,
}) {
  return (
    <div className="card-table">
      <h3 className="text-xl font-display font-bold text-royal-purple-dark mb-2">
        YOUR HAND
      </h3>
      <p className="text-sm text-ui-secondary mb-4">
        Select cards to play
      </p>
      <PlayerHand hand={hand} selectedIds={selectedIds} onToggleCard={onToggleCard} />

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={onPlay}
          disabled={!isMyTurn || selectedIds.length === 0}
          className="btn-primary px-8 py-3 text-lg disabled:cursor-not-allowed"
        >
          ▶ Play {selectedIds.length > 0 ? `${selectedIds.length} Card${selectedIds.length !== 1 ? 's' : ''}` : 'Cards'}
        </button>
        <button
          type="button"
          onClick={onPass}
          disabled={!isMyTurn}
          className="btn-secondary px-8 py-3 text-lg disabled:cursor-not-allowed"
        >
          Pass
        </button>
      </div>

      {gameState === "roundEnd" && (
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
            {gameState === "roundEnd" ? (
              <>
                <button
                  type="button"
                  onClick={gameActions.handleStartNextRound}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Start new round
                </button>
                <button
                  type="button"
                  onClick={gameActions.handleLeaveGame}
                  className="btn-secondary px-4 py-2 text-sm"
                >
                  Leave game
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={gameActions.handleEndGame}
                className="btn-secondary px-4 py-2 text-sm border-burgundy text-burgundy hover:bg-burgundy/10"
              >
                End game
              </button>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={gameActions.handleLeaveGame}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Leave game
          </button>
        )}
      </div>
    </div>
  );
}
