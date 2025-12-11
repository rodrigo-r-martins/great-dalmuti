import { Menu } from "./Menu";
import { Lobby } from "./Lobby";
import { Game } from "./Game";

const VIEW_MENU = "menu";
const VIEW_LOBBY = "lobby";
const VIEW_GAME = "game";

export function GameViewRouter({
  view,
  game,
  connected,
  roomId,
  playerId,
  playerName,
  error,
  socketApi,
  handlers,
  onRoomIdChange,
  onPlayerNameChange,
}) {
  if (!game || view === VIEW_MENU) {
    return (
      <Menu
        connected={connected}
        roomId={roomId}
        playerName={playerName}
        onRoomIdChange={onRoomIdChange}
        onPlayerNameChange={onPlayerNameChange}
        onCreateRoom={handlers.handleCreateRoom}
        onJoinRoom={handlers.handleJoinRoom}
        error={error}
      />
    );
  }

  if (view === VIEW_LOBBY) {
    return (
      <Lobby
        game={game}
        playerId={playerId}
        onStartGame={handlers.handleStartGame}
        onLeaveRoom={handlers.handleLeaveRoom}
      />
    );
  }

  return (
    <Game
      game={game}
      playerId={playerId}
      onPlayCards={handlers.handlePlayCards}
      onPass={handlers.handlePass}
      error={error}
      socketApi={socketApi}
    />
  );
}
