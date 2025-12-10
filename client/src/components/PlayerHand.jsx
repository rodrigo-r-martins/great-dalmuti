import { Card } from "./Card";

export function PlayerHand({ hand, selectedIds, onToggleCard }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {hand.map((card) => (
        <Card
          key={card.id}
          card={card}
          selected={selectedIds.includes(card.id)}
          onToggle={() => onToggleCard(card.id)}
        />
      ))}
      {hand.length === 0 && (
        <p className="mt-2 text-xs text-slate-400">You have no cards left.</p>
      )}
    </div>
  );
}
