import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { Menu } from "./components/Menu";
import { Lobby } from "./components/Lobby";
import { Game } from "./components/Game";

const VIEW_MENU = "menu";
const VIEW_LOBBY = "lobby";
const VIEW_GAME = "game";

function getOrCreatePlayerId() {
  if (typeof window === "undefined") return "anonymous";

  const existing = window.localStorage.getItem("playerId");
  if (existing) return existing;

  const id = typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `player-${Math.random().toString(36).slice(2, 10)}`;

  window.localStorage.setItem("playerId", id);
  return id;
}

export default function App() {
  const { connected, emit, on, off } = useSocket();

  const [view, setView] = useState(VIEW_MENU);
  const [roomId, setRoomId] = useState("");
  const [playerId] = useState(getOrCreatePlayerId);
  const [playerName, setPlayerName] = useState("");
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  function handleLeftGame() {
    setGame(null);
    setView(VIEW_MENU);
  }

  useEffect(() => {
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
  }, [on, off]);

  function handleCreateRoom({ roomId: id, playerName: name }) {
    setError(null);
    emit("createRoom", { roomId: id, playerId, playerName: name });
  }

  function handleJoinRoom({ roomId: id, playerName: name }) {
    setError(null);
    emit("joinRoom", { roomId: id, playerId, playerName: name });
  }

  function handleStartGame() {
    if (!roomId) return;
    setError(null);
    emit("startGame", { roomId });
  }

  function handlePlayCards(cardIds) {
    if (!roomId) return;
    setError(null);
    emit("playCards", { roomId, playerId, cardIds });
  }

  function handlePass() {
    if (!roomId) return;
    setError(null);
    emit("passPlay", { roomId, playerId });
  }

  function handleLeaveRoom() {
    if (!roomId) return;
    setError(null);
    emit("leaveGame", { roomId, playerId });
  }

  let content = null;

  if (!game || view === VIEW_MENU) {
    content = (
      <Menu
        connected={connected}
        roomId={roomId}
        playerName={playerName}
        onRoomIdChange={setRoomId}
        onPlayerNameChange={setPlayerName}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        error={error}
      />
    );
  } else if (view === VIEW_LOBBY) {
    content = (
      <Lobby
        game={game}
        playerId={playerId}
        onStartGame={handleStartGame}
        onLeaveRoom={handleLeaveRoom}
      />
    );
  } else {
    content = (
      <Game
        game={game}
        playerId={playerId}
        onPlayCards={handlePlayCards}
        onPass={handlePass}
        error={error}
        socketApi={{ emit, on, off }}
      />
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {view === VIEW_MENU && (
        <header className="text-center animate-fade-in">
          <div className="mb-2">
            <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg">
              👑 The Great Dalmuti
            </h1>
            <p className="text-lg text-gold-light/90 font-medium">
              Medieval Card Game Mayhem
            </p>
          </div>
          <div
            className={
              "mt-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium shadow-md " +
              (connected
                ? "bg-forest-green-light/20 text-white border-2 border-forest-green-light"
                : "bg-error/20 text-white border-2 border-error")
            }
          >
            <span
              className={
                "h-2 w-2 rounded-full " +
                (connected ? "bg-forest-green-light animate-pulse" : "bg-error")
              }
            />
            <span>{connected ? "✓" : "✗"}</span>
            {connected ? "Connected to server" : "Disconnected"}
          </div>
        </header>
      )}

      {view !== VIEW_MENU && (
        <div className="flex items-center justify-center">
            <div
              className={
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium shadow-sm " +
                (connected
                  ? "bg-forest-green-light/20 text-white border border-forest-green-light"
                  : "bg-error/20 text-white border border-error")
              }
            >
              <span
                className={
                  "h-2 w-2 rounded-full " +
                  (connected ? "bg-forest-green-light" : "bg-error")
                }
              />
              <span>{connected ? "✓" : "✗"}</span>
              {connected ? "Connected" : "Disconnected"}
            </div>
        </div>
      )}

      {content}
    </div>
  );
}
