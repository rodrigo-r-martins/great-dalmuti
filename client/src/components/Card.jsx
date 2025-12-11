export function Card({ card, selected, onToggle }) {
  const label = card.isJester ? "J" : String(card.value);

  const titles = {
    1: "Dalmuti",
    2: "Archbishop",
    3: "Earl Marshal",
    4: "Baroness",
    5: "Abbess",
    6: "Knight",
    7: "Seamstress",
    8: "Mason",
    9: "Cook",
    10: "Shepherdess",
    11: "Stonecutter",
    12: "Peasant",
  };

  const title = card.isJester ? "Jester" : titles[card.value] ?? "";

  return (
    <button
      type="button"
      className={[
        "min-w-[2.7rem] rounded-xl border px-2 py-1 text-xs font-semibold text-slate-900 transition",
        "border-slate-700 bg-card-parchment shadow-sm shadow-black/40",
        selected && "border-dalmuti-gold shadow-[0_0_12px_rgba(251,191,36,0.7)] -translate-y-2",
        card.isJester && "border-dalmuti-gold text-slate-900",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onToggle}
    >
      <div className="flex flex-col items-center leading-tight">
        <span className="text-[0.65rem] opacity-80">{title}</span>
        <span className="mt-0.5 text-sm">{label}</span>
      </div>
    </button>
  );
}
