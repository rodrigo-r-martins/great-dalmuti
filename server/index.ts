import express from "express";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import cors from "cors";
import { registerGameSocketHandlers } from "./socket/gameSocketServer";

const PORT = process.env.PORT ? Number(process.env.PORT) : 3001;

// CORS configuration - allow both Vercel and localhost
const allowedOrigins = [
  process.env.CLIENT_URL,
  "https://great-dalmuti.vercel.app",
  "http://localhost:5173",
].filter(Boolean);

// Shared CORS origin validation function
function validateOrigin(origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void): void {
  // Allow requests with no origin (like mobile apps or curl requests)
  if (!origin) return callback(null, true);
  
  // Check if origin matches any allowed origin or is a Vercel preview deployment
  const isAllowed = allowedOrigins.includes(origin) || 
                    (origin.includes('great-dalmuti') && origin.includes('vercel.app'));
  
  if (isAllowed) {
    callback(null, true);
  } else {
    callback(new Error('Not allowed by CORS'));
  }
}

const app = express();
app.use(cors({
  origin: validateOrigin,
  credentials: true,
}));

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

const server = http.createServer(app);

const io = new SocketIOServer(server, {
  cors: { 
    origin: validateOrigin,
    credentials: true, 
    methods: ["GET", "POST"],
  },
});

registerGameSocketHandlers(io);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
