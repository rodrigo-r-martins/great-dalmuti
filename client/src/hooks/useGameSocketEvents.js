import { useEffect } from "react";

const VIEW_MENU = "menu";
const VIEW_LOBBY = "lobby";
const VIEW_GAME = "game";

/**
 * Manages socket event listeners for game state changes
 */
export function useGameSocketEvents(socketApi, setGame, setView, setError, setRoomId) {
  const { on, off } = socketApi ?? {};

  useEffect(() => {
    if (!on || !off) return;

    function handleRoomCreated(nextState) {
      setGame(nextState);
      setRoomId(nextState.roomId);
      setView(VIEW_LOBBY);
      setError(null);
    }

    function handlePlayerJoined(nextState) {
      setGame(nextState);
      setView(VIEW_LOBBY);
      setError(null);
    }

    function handleGameUpdated(nextState) {
      setGame(nextState);
      setError(null);
      if (nextState.gameState === "playing" || nextState.gameState === "roundEnd") {
        setView(VIEW_GAME);
      }
    }

    function handleError(payload) {
      const message = payload?.message ?? "Unknown error";
      console.error("Server error:", message);
      setError(message);
    }

    function handleLeftGame() {
      setGame(null);
      setView(VIEW_MENU);
    }

    on("roomCreated", handleRoomCreated);
    on("playerJoined", handlePlayerJoined);
    on("gameStarted", handleGameUpdated);
    on("cardsPlayed", handleGameUpdated);
    on("playerPassed", handleGameUpdated);
    on("error", handleError);
    on("gameEnded", handleGameUpdated);
    on("leftGame", handleLeftGame);

    return () => {
      off("roomCreated", handleRoomCreated);
      off("playerJoined", handlePlayerJoined);
      off("gameStarted", handleGameUpdated);
      off("cardsPlayed", handleGameUpdated);
      off("playerPassed", handleGameUpdated);
      off("error", handleError);
      off("gameEnded", handleGameUpdated);
      off("leftGame", handleLeftGame);
    };
  }, [on, off, setGame, setView, setError, setRoomId]);
}
