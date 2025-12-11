import type { Server as SocketIOServer, Socket } from "socket.io";
import { GameRoom } from "../game";

type CreateRoomPayload = {
  roomId: string;
  playerId: string;
  playerName: string;
};

type JoinRoomPayload = {
  roomId: string;
  playerId: string;
  playerName: string;
};

type StartGamePayload = {
  roomId: string;
};

type PlayCardsPayload = {
  roomId: string;
  playerId: string;
  cardIds: string[];
};

type PassPlayPayload = {
  roomId: string;
  playerId: string;
};

type RequestTipsPayload = {
  roomId: string;
  playerId: string;
};

const rooms = new Map<string, GameRoom>();

export function registerGameSocketHandlers(io: SocketIOServer): void {
  io.on("connection", (socket: Socket) => {
    console.log("Player connected:", socket.id);

    socket.on("createRoom", ({ roomId, playerId, playerName }: CreateRoomPayload) => {
      let room = rooms.get(roomId);

      if (room) {
        socket.emit("error", { message: "Room already exists" });
        return;
      }

      room = new GameRoom(roomId);
      const added = room.addPlayer(playerId, playerName, socket.id);

      if (!added) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      rooms.set(roomId, room);

      socket.join(roomId);
      socket.emit("roomCreated", room.getState());
    });

    socket.on("joinRoom", ({ roomId, playerId, playerName }: JoinRoomPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const added = room.addPlayer(playerId, playerName, socket.id);

      if (!added) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      socket.join(roomId);
      io.to(roomId).emit("playerJoined", room.getState());
    });

    socket.on("startGame", ({ roomId }: StartGamePayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const started = room.startGame();

      if (started) {
        io.to(roomId).emit("gameStarted", room.getState());
      }
    });

    socket.on("playCards", ({ roomId, playerId, cardIds }: PlayCardsPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const result = room.playCards(playerId, cardIds);

      if (result.success) {
        io.to(roomId).emit("cardsPlayed", room.getState());
      } else if (result.error) {
        socket.emit("error", { message: result.error });
      }
    });

    socket.on("passPlay", ({ roomId, playerId }: PassPlayPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const result = room.passPlay(playerId);

      if (result.success) {
        io.to(roomId).emit("playerPassed", room.getState());
      } else if (result.error) {
        socket.emit("error", { message: result.error });
      }
    });

    socket.on("requestTips", ({ roomId, playerId }: RequestTipsPayload) => {
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      const tips = room.getBuddyTipsForPlayer(playerId);
      socket.emit("buddyTips", { roomId, playerId, tips });
    });

    socket.on("disconnect", () => {
      console.log("Player disconnected:", socket.id);
      // TODO: Handle cleanup and player removal from rooms
    });
  });
}
