import { useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { useGameSocketEvents } from "./hooks/useGameSocketEvents";
import { useGameHandlers } from "./hooks/useGameHandlers";
import { getOrCreatePlayerId } from "./utils/playerId";
import { AppHeader } from "./components/AppHeader";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { GameViewRouter } from "./components/GameViewRouter";

const VIEW_MENU = "menu";

export default function App() {
  const { connected, emit, on, off } = useSocket();
  const socketApi = { emit, on, off };

  const [view, setView] = useState(VIEW_MENU);
  const [roomId, setRoomId] = useState("");
  const [playerId] = useState(() => getOrCreatePlayerId());
  const [playerName, setPlayerName] = useState("");
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  // Hooks
  useGameSocketEvents(socketApi, setGame, setView, setError, setRoomId);
  const handlers = useGameHandlers(socketApi, roomId, playerId, setError);

  return (
    <div className="flex flex-col gap-6">
      {view === VIEW_MENU && <AppHeader connected={connected} />}

      {view !== VIEW_MENU && (
        <div className="flex items-center justify-center">
          <ConnectionStatus connected={connected} size="sm" />
        </div>
      )}

      <GameViewRouter
        view={view}
        game={game}
        connected={connected}
        roomId={roomId}
        playerId={playerId}
        playerName={playerName}
        error={error}
        socketApi={socketApi}
        handlers={handlers}
        onRoomIdChange={setRoomId}
        onPlayerNameChange={setPlayerName}
      />
    </div>
  );
}
