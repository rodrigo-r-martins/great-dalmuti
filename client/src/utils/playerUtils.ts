import type { GameSnapshot } from "../../../shared/types";

/**
 * Gets the role/title for a player based on their position
 */
export function getPlayerRole(
  playerIndex: number,
  game: GameSnapshot,
  hostId: string | null,
): string {
  if (game.players[playerIndex]?.id === hostId) {
    return "👑 Host";
  }

  if (game.gameState === "roundEnd") {
    const pos = game.finishedPlayers.indexOf(playerIndex);
    if (pos === 0) {
      return "👑 The Great Dalmuti";
    } else if (pos === 1) {
      return "👑 Lesser Dalmuti";
    } else if (pos === game.players.length - 1) {
      return "Greater Peon";
    } else if (pos === game.players.length - 2) {
      return "Lesser Peon";
    } else if (pos >= 0) {
      return "Merchant";
    }
  }

  return "";
}
