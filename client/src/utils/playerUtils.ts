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
    const totalPlayers = game.players.length;

    if (pos === 0) {
      return "👑 The Great Dalmuti";
    }
    
    // Greater Peon is the one who didn't finish
    if (pos === -1) {
      return "Greater Peon";
    }

    // Lesser Dalmuti (2nd place, if more than 3 players)
    if (pos === 1 && totalPlayers > 3) {
      return "👑 Lesser Dalmuti";
    }

    // Lesser Peon (second to last place)
    // If there are N players, finishedPlayers has N-1 elements.
    // Index N-2 in finishedPlayers is the second to last player overall.
    if (pos === totalPlayers - 2 && totalPlayers >= 4) {
      return "Lesser Peon";
    }

    return "Merchant";
  }

  return "";
}
