import { useState } from "react";
import { useTurnSound } from "../hooks/useTurnSound";
import { useBuddyTips } from "../hooks/useBuddyTips";
import { useGameActions } from "../hooks/useGameActions";
import { useGame, usePlayerId, useError } from "../store/gameStore";
import { useGameActions as useGameActionsFromStore } from "../store/gameActions";
import { GameHeader } from "./GameHeader";
import { TheCourt } from "./TheCourt";
import { LastPlay } from "./LastPlay";
import { PlayerHandSection } from "./PlayerHandSection";
import { DalmutiBuddy } from "./DalmutiBuddy";
import { RoundResultsModal } from "./RoundResultsModal";

export function Game() {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const game = useGame();
  const playerId = usePlayerId();
  const error = useError();

  if (!game) return null;

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn =
    myIndex === game.currentPlayer && game.gameState === "playing";
  const isHost = game.hostId === playerId;

  // Hooks
  useTurnSound(isMyTurn, game.gameState);
  const buddyTips = useBuddyTips();

  // Game actions for host controls (end game, leave game, start next round)
  const gameActions = useGameActions();

  // Game actions for playing cards and passing
  const { handlePlayCards, handlePass } = useGameActionsFromStore();

  function toggleCard(cardId: string) {
    setSelectedIds((current) =>
      current.includes(cardId)
        ? current.filter((id) => id !== cardId)
        : [...current, cardId]
    );
  }

  function handlePlay() {
    if (!isMyTurn || selectedIds.length === 0) return;
    handlePlayCards(selectedIds);
    setSelectedIds([]);
  }

  function handlePassClick() {
    if (!isMyTurn) return;
    handlePass();
    setSelectedIds([]);
  }

  return (
    <div className="animate-fade-in flex flex-col gap-6">
      <GameHeader />
      <TheCourt />
      <LastPlay lastPlay={game.lastPlay} players={game.players} />
      <PlayerHandSection
        hand={myHand}
        selectedIds={selectedIds}
        onToggleCard={toggleCard}
        onPlay={handlePlay}
        onPass={handlePassClick}
        isMyTurn={isMyTurn}
        gameState={game.gameState}
        isHost={isHost}
        error={error}
        gameActions={gameActions}
      />
      <DalmutiBuddy tips={buddyTips} />
      
      {game.gameState === "roundEnd" && (
        <RoundResultsModal
          game={game}
          isHost={isHost}
          onStartNextRound={gameActions.handleStartNextRound}
          onLeaveGame={gameActions.handleLeaveGame}
        />
      )}
    </div>
  );
}
