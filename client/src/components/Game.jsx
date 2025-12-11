import { useState } from "react";
import { useTurnSound } from "../hooks/useTurnSound";
import { useBuddyTips } from "../hooks/useBuddyTips";
import { useGameActions } from "../hooks/useGameActions";
import { GameHeader } from "./GameHeader";
import { TheCourt } from "./TheCourt";
import { LastPlay } from "./LastPlay";
import { PlayerHandSection } from "./PlayerHandSection";
import { DalmutiBuddy } from "./DalmutiBuddy";

export function Game({ game, playerId, onPlayCards, onPass, error, socketApi }) {
  const [selectedIds, setSelectedIds] = useState([]);

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";
  const isHost = game.hostId === playerId;

  // Hooks
  useTurnSound(isMyTurn, game.gameState);
  const buddyTips = useBuddyTips(socketApi, game, playerId);
  const gameActions = useGameActions(socketApi, game, playerId, isHost);

  function toggleCard(cardId) {
    setSelectedIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId],
    );
  }

  function handlePlay() {
    if (!isMyTurn || selectedIds.length === 0) return;
    onPlayCards(selectedIds);
    setSelectedIds([]);
  }

  function handlePass() {
    if (!isMyTurn) return;
    onPass();
    setSelectedIds([]);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <GameHeader game={game} isMyTurn={isMyTurn} />
      <TheCourt game={game} playerId={playerId} />
      <LastPlay lastPlay={game.lastPlay} players={game.players} />
      <PlayerHandSection
        hand={myHand}
        selectedIds={selectedIds}
        onToggleCard={toggleCard}
        onPlay={handlePlay}
        onPass={handlePass}
        isMyTurn={isMyTurn}
        gameState={game.gameState}
        isHost={isHost}
        error={error}
        gameActions={gameActions}
      />
      <DalmutiBuddy tips={buddyTips} />
    </div>
  );
}
