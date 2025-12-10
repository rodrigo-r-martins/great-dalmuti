export function Card({ card, selected, onToggle }) {
  const label = card.isJester ? "J" : String(card.value);

  return (
    <button
      type="button"
      className={
        "card" +
        (selected ? " card--selected" : "") +
        (card.isJester ? " card--jester" : "")
      }
      onClick={onToggle}
    >
      <span className="card-value">{label}</span>
    </button>
  );
}
