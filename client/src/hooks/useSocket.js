import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3001";

// Singleton socket instance shared across the app
const socket = io(SOCKET_URL, {
  autoConnect: true,
});

export function useSocket() {
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    function handleConnect() {
      setConnected(true);
    }

    function handleDisconnect() {
      setConnected(false);
    }

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  const emit = useCallback((event, payload) => {
    socket.emit(event, payload);
  }, []);

  const on = useCallback((event, handler) => {
    socket.on(event, handler);
  }, []);

  const off = useCallback((event, handler) => {
    socket.off(event, handler);
  }, []);

  return { socket, connected, emit, on, off };
}
