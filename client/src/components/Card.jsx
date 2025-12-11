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

  // Determine card color based on rank
  function getCardColor() {
    if (card.isJester) {
      return {
        bg: "bg-gradient-to-br from-card-jester to-purple-600",
        border: "border-pink-500",
        text: "text-white",
      };
    }
    const value = card.value;
    if (value <= 2) {
      // Royal (1-2)
      return {
        bg: "bg-gradient-to-br from-card-royal via-purple-500 to-medieval-gold",
        border: "border-medieval-gold",
        text: "text-white",
      };
    } else if (value <= 4) {
      // Noble (3-4)
      return {
        bg: "bg-gradient-to-br from-card-noble to-blue-600",
        border: "border-blue-700",
        text: "text-white",
      };
    } else if (value <= 8) {
      // Merchant (5-8)
      return {
        bg: "bg-gradient-to-br from-card-merchant to-green-600",
        border: "border-green-700",
        text: "text-white",
      };
    } else {
      // Peasant (9-12)
      return {
        bg: "bg-gradient-to-br from-card-peasant to-orange-600",
        border: "border-orange-700",
        text: "text-white",
      };
    }
  }

  const colors = getCardColor();

  return (
    <button
      type="button"
      className={[
        "relative w-14 h-20 sm:w-16 sm:h-24 rounded-lg transition-all duration-200",
        "shadow-card hover:shadow-card-hover hover:-translate-y-2",
        "flex flex-col items-center justify-center p-1.5",
        colors.bg,
        colors.text,
        selected 
          ? "border-2 border-medieval-gold shadow-[0_0_10px_rgba(214,158,46,0.8)] -translate-y-1 scale-110 z-20"
          : `border-2 ${colors.border}`,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onToggle}
    >
      {/* Selected indicator overlay */}
      {selected && (
        <div className="absolute inset-0 rounded-lg bg-medieval-gold/20 border-2 border-medieval-gold pointer-events-none" />
      )}
      
      {/* Top corner rank */}
      <div className="absolute top-1 left-1 text-xs font-bold leading-none z-10">
        {label}
      </div>
      
      {/* Center value (large) */}
      <div className="text-2xl sm:text-3xl font-bold leading-none z-10">
        {label}
      </div>
      
      {/* Title below center number */}
      <div className="text-[0.5rem] sm:text-[0.6rem] font-semibold opacity-90 leading-tight text-center mt-1 z-10">
        {title}
      </div>
      
      {/* Bottom corner rank (rotated) */}
      <div className="absolute bottom-1 right-1 text-xs font-bold leading-none transform rotate-180 z-10">
        {label}
      </div>
    </button>
  );
}
