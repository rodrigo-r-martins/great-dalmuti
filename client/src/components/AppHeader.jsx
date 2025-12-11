import { ConnectionStatus } from "./ConnectionStatus";

export function AppHeader({ connected }) {
  return (
    <header className="text-center animate-fade-in">
      <div className="mb-2">
        <h1 className="font-display text-5xl sm:text-6xl font-bold text-white mb-2 drop-shadow-lg">
          👑 The Great Dalmuti
        </h1>
        <p className="text-lg text-gold-light/90 font-medium">
          Medieval Card Game Mayhem
        </p>
      </div>
      <ConnectionStatus connected={connected} />
    </header>
  );
}
