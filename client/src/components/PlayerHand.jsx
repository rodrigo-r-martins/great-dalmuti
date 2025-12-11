import { Card } from "./Card";

export function PlayerHand({ hand, selectedIds, onToggleCard }) {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
      {hand.map((card, index) => (
        <div
          key={card.id}
          className="animate-deal-card"
          style={{
            animationDelay: `${index * 0.05}s`,
            animationFillMode: 'both',
          }}
        >
          <Card
            card={card}
            selected={selectedIds.includes(card.id)}
            onToggle={() => onToggleCard(card.id)}
          />
        </div>
      ))}
      {hand.length === 0 && (
        <p className="mt-2 text-sm text-ui-muted text-center w-full">
          You have no cards left.
        </p>
      )}
    </div>
  );
}
