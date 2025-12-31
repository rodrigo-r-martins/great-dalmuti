import { describe, expect, it } from "vitest";
import type { Card } from "../../shared/types";
import { GameRoom } from "../core/GameRoom";

function createRoomWithPlayers(count: number): GameRoom {
  const room = new GameRoom("room-1");

  for (let i = 0; i < count; i += 1) {
    const id = `p${i + 1}`;
    room.addPlayer(id, `Player ${i + 1}`, `socket-${i + 1}`);
  }

  return room;
}

describe("GameRoom", () => {
  it("does not start game with fewer than 3 players", () => {
    const room = createRoomWithPlayers(2);

    const started = room.startGame();
    expect(started).toBe(false);
  });

  it("starts game with 3 or more players and deals hands", () => {
    const room = createRoomWithPlayers(3);

    const started = room.startGame();
    expect(started).toBe(true);

    const state = room.getState();
    expect(state.gameState).toBe("playing");
    expect(state.playerHands).toHaveLength(3);

    const totalCards = state.playerHands.reduce((sum: number, hand: Card[]) => sum + hand.length, 0);
    expect(totalCards).toBe(80);
  });

  it("rejects play when it is not the player's turn", () => {
    const room = createRoomWithPlayers(3);
    room.startGame();

    const state = room.getState();
    const notCurrentPlayerIndex = (state.currentPlayer + 1) % state.players.length;
    const notCurrentPlayer = state.players[notCurrentPlayerIndex];

    const result = room.playCards(notCurrentPlayer.id, []);
    expect(result.success).toBe(false);
    expect(result.error).toBe("Not your turn");
  });

  it("rejects invalid plays according to rules", () => {
    const room = createRoomWithPlayers(3);
    room.startGame();

    // First, make a valid opening play to establish a lastPlay
    let state = room.getState();
    const openingPlayer = state.players[state.currentPlayer];
    const openingHand = state.playerHands[state.currentPlayer];
    const openingCard = openingHand[0];
    const openingResult = room.playCards(openingPlayer.id, [openingCard.id]);

    expect(openingResult.success).toBe(true);

    state = room.getState();

    // attempt to play empty set (always invalid)
    const nextPlayerIndex = state.currentPlayer;
    const nextPlayer = state.players[nextPlayerIndex];
    const resultEmpty = room.playCards(nextPlayer.id, []);
    expect(resultEmpty.success).toBe(false);

    // Now create an invalid combination for the same next player:
    // number of cards does not match lastPlay.count
    const nextHand = state.playerHands[nextPlayerIndex];
    if (nextHand.length >= 2) {
      const [c1, c2] = nextHand;
      const resultInvalidCombo = room.playCards(nextPlayer.id, [c1.id, c2.id]);
      expect(resultInvalidCombo.success).toBe(false);
    }
  });

  it("accepts a valid first play and updates state", () => {
    const room = createRoomWithPlayers(3);
    room.startGame();

    let state = room.getState();
    const currentPlayer = state.players[state.currentPlayer];
    const hand = state.playerHands[state.currentPlayer];

    const card = hand[0];
    const result = room.playCards(currentPlayer.id, [card.id]);

    expect(result.success).toBe(true);

    state = room.getState();
    expect(state.lastPlay).not.toBeNull();
    expect(state.lastPlay?.player).toBe(0);
    expect(state.currentPlayer).toBe(1);
  });

  it("marks player as finished and ends round when only one remains", () => {
    const room = createRoomWithPlayers(3);
    room.startGame();

    // force-finish two players by emptying their hands via direct plays
    // We don't assert exact sequence of card values, only that we can
    // repeatedly play single cards until hands are empty and the engine
    // eventually marks the round as ended.
    for (let playerIndex = 0; playerIndex < 2; playerIndex += 1) {
      // rotate until it is this player's turn
      // (this is a bit brute-force but safe for tests)
      // eslint-disable-next-line no-constant-condition
      while (true) {
        const state = room.getState();
        if (state.currentPlayer === playerIndex) {
          const hand = state.playerHands[playerIndex];
          if (hand.length === 0) {
            break;
          }

          const card = hand[0];
          const result = room.playCards(state.players[playerIndex].id, [card.id]);
          expect(result.success).toBe(true);

          if (result.roundEnd) {
            return;
          }
        } else {
          // player passes to move turn forward
          const current = room.getState().players[room.getState().currentPlayer];
          const passResult = room.passPlay(current.id);
          expect(passResult.success).toBe(true);
        }
      }
    }

    const finalState = room.getState();
    expect(finalState.gameState).toBe("roundEnd");
    expect(finalState.finishedPlayers.length).toBe(2);
  });
});
