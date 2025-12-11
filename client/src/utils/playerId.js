/**
 * Gets or creates a persistent player ID from localStorage
 */
export function getOrCreatePlayerId() {
  if (typeof window === "undefined") return "anonymous";

  const existing = window.localStorage.getItem("playerId");
  if (existing) return existing;

  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `player-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem("playerId", id);
  return id;
}
