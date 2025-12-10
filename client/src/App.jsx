import { io } from "socket.io-client";
import { useEffect } from "react";

const socket = io("http://localhost:3001");

export default function App() {
  
  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server!");
    });
  }, []);

  return <div>Connected!</div>;
}
