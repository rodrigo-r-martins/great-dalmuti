import { useEffect, useMemo } from "react";
import { useSocket } from "./hooks/useSocket";
import { useGameSocketEvents } from "./hooks/useGameSocketEvents";
import { getOrCreatePlayerId } from "./utils/playerId";
import { useGameStore, useView, useConnected } from "./store/gameStore";
import { AppHeader } from "./components/AppHeader";
import { ConnectionStatus } from "./components/ConnectionStatus";
import { GameViewRouter } from "./components/GameViewRouter";

export default function App() {
  const { connected, emit, on, off } = useSocket();
  
  // Memoize socketApi to prevent unnecessary re-renders
  const socketApi = useMemo(() => ({ emit, on, off }), [emit, on, off]);

  // Zustand store
  const setSocketApi = useGameStore((state) => state.setSocketApi);
  const setConnected = useGameStore((state) => state.setConnected);
  const setPlayerId = useGameStore((state) => state.setPlayerId);
  const playerId = useGameStore((state) => state.playerId);

  // Initialize socket API and connection status in store
  useEffect(() => {
    setSocketApi(socketApi);
  }, [socketApi, setSocketApi]);

  useEffect(() => {
    setConnected(connected);
  }, [connected, setConnected]);

  // Initialize player ID
  useEffect(() => {
    if (!playerId) {
      setPlayerId(getOrCreatePlayerId());
    }
  }, [playerId, setPlayerId]);

  // Set up socket event listeners
  useGameSocketEvents();

  const view = useView();
  const connectedState = useConnected();

  return (
    <div className="flex flex-col gap-6">
      {view === "menu" && <AppHeader connected={connectedState} />}

      {view !== "menu" && (
        <div className="flex items-center justify-center">
          <ConnectionStatus connected={connectedState} size="sm" />
        </div>
      )}

      <GameViewRouter />
    </div>
  );
}
