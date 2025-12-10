import express from "express";
import http from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import cors from "cors";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

io.on("connection", (socket: Socket) => {
  console.log("Player connected:", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});