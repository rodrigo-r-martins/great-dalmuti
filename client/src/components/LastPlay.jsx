export function LastPlay({ lastPlay, players }) {
  if (!lastPlay) return null;

  return (
    <div className="card-table">
      <h3 className="text-lg font-semibold text-ui-primary mb-2">Last Play</h3>
      <div className="flex items-center gap-3">
        <span className="text-ui-secondary">
          {players[lastPlay.player]?.name ?? "?"} played:
        </span>
        <div className="flex gap-2">
          {lastPlay.cards.map((card) => (
            <div
              key={card.id}
              className="w-12 h-16 rounded border-2 border-medieval-gold bg-linear-to-br from-medieval-gold/30 to-gold-light/30 flex items-center justify-center font-bold text-medieval-gold"
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
  );
}
