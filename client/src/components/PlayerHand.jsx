import { Card } from "./Card";

export function PlayerHand({ hand, selectedIds, onToggleCard }) {
  return (
    <div className="hand">
      {hand.map((card) => (
        <Card
          key={card.id}
          card={card}
          selected={selectedIds.includes(card.id)}
          onToggle={() => onToggleCard(card.id)}
        />
      ))}
      {hand.length === 0 && <p className="hint">You have no cards left.</p>}
    </div>
  );
}
