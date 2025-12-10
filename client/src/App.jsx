import { useEffect, useState } from "react";
import "./App.css";
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
      />
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>The Great Dalmuti</h1>
        <p className="subtitle">Multiplayer card game – server authoritative</p>
        <p className={connected ? "status status--ok" : "status status--bad"}>
          {connected ? "Connected to server" : "Disconnected"}
        </p>
      </header>

      {content}
    </div>
  );
}
