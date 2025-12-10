import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { registerGameSocketHandlers } from "./socket/gameSocketServer";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

registerGameSocketHandlers(io);

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
