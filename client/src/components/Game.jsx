import { useEffect, useState } from "react";
import { PlayerHand } from "./PlayerHand";

export function Game({ game, playerId, onPlayCards, onPass, error, socketApi }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBuddy, setShowBuddy] = useState(true);
  const [buddyTips, setBuddyTips] = useState([]);

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";
  const isHost = game.hostId === playerId;

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

  const lastPlay = game.lastPlay;

  const { emit, on, off } = socketApi ?? {};

  useEffect(() => {
    if (!on || !off) return;

    function handleBuddyTips(payload) {
      if (!payload) return;
      if (payload.playerId && payload.playerId !== playerId) return;
      setBuddyTips(Array.isArray(payload.tips) ? payload.tips : []);
    }

    on("buddyTips", handleBuddyTips);
    return () => {
      off("buddyTips", handleBuddyTips);
    };
  }, [on, off, playerId]);

  useEffect(() => {
    if (!emit || !game) return;
    emit("requestTips", { roomId: game.roomId, playerId });
  }, [emit, game, playerId]);

  function handleEndGameClick() {
    if (!emit || !isHost) return;
    const confirmed = window.confirm(
      "Are you sure you want to end the game for everyone?",
    );
    if (!confirmed) return;
    emit("endGame", { roomId: game.roomId, playerId });
  }

  function handleLeaveGameClick() {
    if (!emit) return;
    const confirmed = window.confirm(
      "Are you sure you want leave this game?",
    );
    if (!confirmed) return;
    emit("leaveGame", { roomId: game.roomId, playerId });
  }

  return (
    <div className="flex flex-col gap-4">
      {/* The Table (center stage) */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <h2 className="text-base font-semibold tracking-tight text-slate-200">
            Room {game.roomId}
          </h2>
          <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/15 px-3 py-1 text-xs font-medium text-amber-100 shadow-sm shadow-amber-500/40">
            <span className="text-amber-300">♦</span>
            <span>
              {game.players[game.currentPlayer]?.name ?? "?"}
              {"'s turn"}
            </span>
          </div>
        </div>
        <p className="mt-2 text-sm text-slate-200">
          You are{" "}
          <strong className="font-semibold">
            {game.players[myIndex]?.name ?? "Unknown"}
          </strong>
          {isMyTurn && <span className="text-emerald-300"> – your turn!</span>}
        </p>

        {lastPlay ? (
          <div className="mt-3 flex flex-col gap-1 text-sm">
            <span className="text-slate-300">
              Last play by {game.players[lastPlay.player]?.name ?? "?"}:
            </span>
            <span className="font-mono text-slate-100">
              {lastPlay.cards.map((card) =>
                card.isJester ? "J" : String(card.value),
              ).join(" ")}
            </span>
          </div>
        ) : (
          <p className="mt-3 text-xs text-slate-400">
            No cards played yet this trick.
          </p>
        )}

        {game.gameState === "roundEnd" && (
          <p className="mt-3 text-xs text-amber-300">
            Round finished! A new round will be implemented later.
          </p>
        )}

        {error && (
          <p className="mt-3 text-xs font-medium text-amber-400">
            {error}
          </p>
        )}
      </div>

      {/* The Hand (bottom section) */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <h3 className="text-base font-semibold tracking-tight">Your hand</h3>
        <PlayerHand hand={myHand} selectedIds={selectedIds} onToggleCard={toggleCard} />

        <div className="mt-3 flex justify-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            disabled={!isMyTurn || selectedIds.length === 0}
            className="inline-flex items-center justify-center rounded-full border border-amber-400/80 bg-amber-500/25 px-4 py-2 text-sm font-medium text-amber-100 shadow-md shadow-amber-500/40 transition hover:bg-amber-500/35 disabled:cursor-default disabled:opacity-50"
          >
            Play selected
          </button>
          <button
            type="button"
            onClick={handlePass}
            disabled={!isMyTurn}
            className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/90 px-4 py-2 text-sm font-medium text-slate-100 shadow-md shadow-black/50 transition hover:border-sky-400 hover:shadow-sky-500/30 disabled:cursor-default disabled:opacity-50"
          >
            Pass
          </button>
        </div>

        <div className="mt-4 flex justify-between gap-3 text-xs text-slate-300">
          {isHost ? (
            <button
              type="button"
              onClick={handleEndGameClick}
              className="inline-flex items-center justify-center rounded-full border border-rose-500/70 bg-rose-500/20 px-3 py-1.5 font-medium text-rose-100 shadow-md shadow-rose-500/40 transition hover:bg-rose-500/30"
            >
              End game for everyone
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLeaveGameClick}
              className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/90 px-3 py-1.5 font-medium text-slate-100 shadow-md shadow-black/50 transition hover:border-amber-400 hover:shadow-amber-500/30"
            >
              Leave game
            </button>
          )}
        </div>
      </div>

      {/* The Court (players around the table) */}
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-4 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <h3 className="text-sm font-semibold tracking-tight text-slate-200">
          The Court
        </h3>
        <ul className="mt-2 flex list-none flex-col gap-1.5 text-sm sm:flex-row sm:flex-wrap">
          {game.players.map((player, index) => {
            const isYou = player.id === playerId;
            const isFinished = game.finishedPlayers.includes(index);
            const isCurrent = index === game.currentPlayer;
            const cardsLeft = game.playerHands[index]?.length ?? 0;

            let role = "";
            if (player.id === game.hostId) {
              role = "Host";
            } else if (game.gameState === "roundEnd") {
              const pos = game.finishedPlayers.indexOf(index);
              if (pos === 0) {
                role = "Greater Dalmuti";
              } else if (pos === 1) {
                role = "Lesser Dalmuti";
              } else if (pos === game.players.length - 1) {
                role = "Greater Peon";
              } else if (pos === game.players.length - 2) {
                role = "Lesser Peon";
              } else if (pos >= 0) {
                role = "Merchant";
              }
            }

            return (
              <li
                key={player.id}
                className={
                  "flex items-center justify-between rounded-md px-2 py-1 sm:min-w-[10rem] " +
                  (isCurrent
                    ? "border border-amber-400/70 bg-amber-500/15 text-amber-100"
                    : "border border-transparent bg-slate-900/60 text-slate-100") +
                  (isFinished ? " opacity-60" : "") +
                  (isYou ? " font-semibold" : "")
                }
              >
                <div className="flex flex-col">
                  <span>
                    {player.name}
                    {isYou && " (you)"}
                  </span>
                  <span className="text-[0.7rem] text-slate-400">
                    {role || (isFinished ? "Finished" : "Playing")}
                  </span>
                </div>
                <span className="ml-2 inline-flex items-center gap-1 rounded-full bg-slate-800/80 px-2 py-0.5 text-[0.7rem] text-slate-200">
                  <span className="text-xs">🃏</span>
                  <span>{cardsLeft}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Dalmuti Buddy (contextual helper) */}
      <div className="mt-2 w-full max-w-sm self-end rounded-2xl border border-slate-700/60 bg-slate-900/95 p-4 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold tracking-tight">
              Dalmuti Buddy
            </h3>
            <p className="mt-0.5 text-xs text-slate-400">
              Simple suggestions to help you learn which plays are valid.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowBuddy((value) => !value)}
            className="inline-flex items-center justify-center rounded-full border border-slate-600/70 bg-slate-900/90 px-3 py-1.5 text-xs font-medium text-slate-100 shadow-md shadow-black/40 transition hover:border-sky-400 hover:shadow-sky-500/30"
          >
            {showBuddy ? "Hide tips" : "Show tips"}
          </button>
        </div>

        {showBuddy && (
          <>
            {buddyTips.length === 0 ? (
              <p className="mt-3 text-xs text-slate-400">
                Waiting for tips from the server...
              </p>
            ) : (
              <ul className="mt-3 list-disc space-y-1.5 pl-6 text-xs text-slate-200">
                {buddyTips.map((tip, index) => (
                  <li key={index}>{tip}</li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
