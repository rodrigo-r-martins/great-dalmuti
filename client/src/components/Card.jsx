export function Card({ card, selected, onToggle }) {
  const label = card.isJester ? "J" : String(card.value);

  return (
    <button
      type="button"
      className={[
        "min-w-[2.2rem] rounded-xl border px-2 py-1 text-sm font-semibold text-slate-100 transition",
        "border-slate-500/70 bg-gradient-to-b from-slate-800 to-slate-950 shadow-sm shadow-black/70",
        selected && "border-emerald-400 shadow-emerald-500/40 -translate-y-[2px] scale-[1.03]",
        card.isJester && "from-amber-400 to-amber-900 text-slate-950",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onToggle}
    >
      <span>{label}</span>
    </button>
  );
}
