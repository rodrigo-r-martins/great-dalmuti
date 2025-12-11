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
        "min-w-[2.4rem] rounded-xl border px-2 py-1 text-xs font-semibold text-slate-100 transition",
        "border-slate-500/70 bg-linear-gradient(to bottom, #1e293b, #0f172a) shadow-sm shadow-black/70",
        selected && "border-amber-400 shadow-amber-500/40 -translate-y-[2px] scale-[1.03]",
        card.isJester && "from-amber-400 to-amber-900 text-slate-950",
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onToggle}
    >
      <div className="flex flex-col items-center leading-tight">
        <span className="text-[0.7rem] opacity-80">{title}</span>
        <span className="mt-0.5 text-sm">{label}</span>
      </div>
    </button>
  );
}
