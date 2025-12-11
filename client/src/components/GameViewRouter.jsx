import { Menu } from "./Menu";
import { Lobby } from "./Lobby";
import { Game } from "./Game";
import { useGameStore } from "../store/gameStore";

export function GameViewRouter() {
  const view = useGameStore((state) => state.view);
  const game = useGameStore((state) => state.game);

  if (!game || view === "menu") {
    return <Menu />;
  }

  if (view === "lobby") {
    return <Lobby />;
  }

  return <Game />;
}
