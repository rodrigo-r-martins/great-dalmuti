export function ConnectionStatus({ connected, size = "md" }) {
  const isSmall = size === "sm";
  
  const containerClasses = isSmall
    ? "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm"
    : "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md";
  
  const statusClasses = connected
    ? "bg-forest-green-light/20 text-white"
    : "bg-error/20 text-white";
  
  const borderWidth = isSmall ? "border" : "border-2";
  const borderColor = connected
    ? "border-forest-green-light"
    : "border-error";

  return (
    <div className={`${containerClasses} ${statusClasses} ${borderWidth} ${borderColor}`}>
      <span
        className={
          "h-2 w-2 rounded-full " +
          (connected 
            ? (isSmall ? "bg-forest-green-light" : "bg-forest-green-light animate-pulse")
            : "bg-error")
        }
      />
      <span>{connected ? "✓" : "✗"}</span>
      {connected 
        ? (isSmall ? "Connected" : "Connected to server") 
        : "Disconnected"}
    </div>
  );
}
