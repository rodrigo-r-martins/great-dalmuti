# The Great Dalmuti

An online multiplayer implementation of the classic card game **The Great Dalmuti**, featuring a beautiful medieval-themed UI and real-time gameplay powered by Socket.IO.

![The Great Dalmuti](https://img.shields.io/badge/version-1.0.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Socket.IO](https://img.shields.io/badge/Socket.IO-4.8-green)

## 🎮 About the Game

The Great Dalmuti is a strategic card game where players compete to get rid of their cards first. The player who finishes first becomes "The Great Dalmuti" in the next round, while the last player becomes "The Greater Peon" and must pay a "tax" by giving their best cards to the Dalmuti.

**Key Features:**

- 🎯 Real-time multiplayer gameplay
- 🎨 Beautiful medieval-themed UI with Tailwind CSS
- 🔊 Audio feedback for turn notifications
- 📱 Responsive design for desktop and mobile
- 🎭 Role-based player titles (Dalmuti, Peon, Merchant)
- 💡 Contextual tips from "Dalmuti Buddy"
- 📖 In-game rules modal

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm
- **TypeScript** (for server development)

### Installation

1. **Clone the repository:**

   ```bash
   git clone <repository-url>
   cd great-dalmuti
   ```

2. **Install server dependencies:**

   ```bash
   cd server
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Running the Application

1. **Start the server:**

   ```bash
   cd server
   npm run dev
   ```

   The server will start on `http://localhost:3001` by default.

2. **Start the client (in a new terminal):**

   ```bash
   cd client
   npm run dev
   ```

   The client will start on `http://localhost:5173` (or another port if 5173 is taken).

3. **Open your browser:**
   Navigate to the client URL (e.g., `http://localhost:5173`)

4. **Create or join a game:**
   - Enter your name
   - Create a new game room or join an existing one using a room code
   - Share the room code with friends to play together!

## 📁 Project Structure

```
great-dalmuti/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks (TypeScript)
│   │   ├── utils/          # Utility functions (TypeScript)
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Node.js/Express backend
│   ├── game/              # Game logic
│   │   ├── core/          # GameRoom, DeckBuilder
│   │   ├── models/        # Type definitions
│   │   └── __tests__/     # Unit tests
│   ├── socket/            # Socket.IO handlers
│   ├── package.json
│   └── tsconfig.json
│
├── shared/                # Shared TypeScript types
│   └── types.ts           # Common type definitions
│
└── README.md
```

## 🛠️ Tech Stack

### Frontend

- **React 19.2** - UI framework
- **TypeScript** - Type safety for hooks and utils
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **Socket.IO Client** - Real-time communication

### Backend

- **Node.js** - Runtime
- **Express** - Web server
- **TypeScript** - Type safety
- **Socket.IO** - WebSocket server
- **Vitest** - Testing framework

### Shared

- **TypeScript** - Shared type definitions between client and server

## 🎯 Game Rules

For detailed game rules, see [GAME_INSTRUCTIONS.md](./GAME_INSTRUCTIONS.md).

**Quick Summary:**

- Players take turns playing sets of cards (same value)
- Lower numbers beat higher numbers
- Jesters (13) are wild cards when played with other cards
- First player to empty their hand wins the round
- Winners become Dalmuti, losers become Peons
- Peons pay "taxes" by giving their best cards to Dalmuti

## 🧪 Development

### Running Tests

```bash
cd server
npm test
```

### Building for Production

**Server:**

```bash
cd server
npm run build
npm start
```

**Client:**

```bash
cd client
npm run build
npm run preview
```

### TypeScript

The project uses TypeScript for:

- All server code
- Client hooks and utilities
- Shared type definitions

The client components remain in JavaScript (`.jsx`) for flexibility, while hooks and utils are fully typed.

## 🎨 Design

The UI features a medieval theme with:

- Royal purple and gold color palette
- Custom card designs with rank-based styling
- Smooth animations and transitions
- Responsive layout for all screen sizes

See [DESIGN.md](./DESIGN.md) and [NEW_DESIGN_IMPLEMENTATION.md](./NEW_DESIGN_IMPLEMENTATION.md) for design details.

## 📝 Scripts

### Client Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Server Scripts

- `npm run dev` - Start development server (ts-node)
- `npm run build` - Compile TypeScript
- `npm start` - Run compiled server
- `npm test` - Run tests

## 🔧 Configuration

### Environment Variables

**Client:**

- `VITE_SOCKET_URL` - Socket.IO server URL (default: `http://localhost:3001`)

**Server:**

- `PORT` - Server port (default: `3001`)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

ISC

## 🙏 Acknowledgments

- Based on the classic card game "The Great Dalmuti" by Wizards of the Coast
- UI design inspired by medieval and fantasy themes

---

**Enjoy playing The Great Dalmuti!** 👑
