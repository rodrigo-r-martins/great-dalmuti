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

    return () => {
      off("roomCreated", handleRoomCreated);
      off("playerJoined", handlePlayerJoined);
      off("gameStarted", handleGameUpdated);
      off("cardsPlayed", handleGameUpdated);
      off("playerPassed", handleGameUpdated);
      off("error", handleError);
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
    content = <Lobby game={game} playerId={playerId} onStartGame={handleStartGame} />;
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
      <header className="text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl">
          The Great Dalmuti
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Multiplayer card game – server authoritative
        </p>
        <p
          className={
            "mt-2 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium " +
            (connected
              ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/40"
              : "bg-rose-500/10 text-rose-300 ring-1 ring-rose-500/40")
          }
        >
          <span
            className={
              "h-2 w-2 rounded-full " +
              (connected ? "bg-emerald-400" : "bg-rose-400")
            }
          />
          {connected ? "Connected to server" : "Disconnected"}
        </p>
      </header>

      {content}
    </div>
  );
}
