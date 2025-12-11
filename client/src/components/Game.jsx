import { useEffect, useState } from "react";
import { PlayerHand } from "./PlayerHand";

export function Game({ game, playerId, onPlayCards, onPass, error, socketApi }) {
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBuddy, setShowBuddy] = useState(true);
  const [buddyTips, setBuddyTips] = useState([]);

  const myIndex = game.players.findIndex((p) => p.id === playerId);
  const myHand = myIndex >= 0 ? game.playerHands[myIndex] ?? [] : [];
  const isMyTurn = myIndex === game.currentPlayer && game.gameState === "playing";

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

  return (
    <div className="grid gap-4 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_minmax(0,2fr)]">
      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <h2 className="text-lg font-semibold tracking-tight">Room {game.roomId}</h2>
        <p className="mt-2 text-sm text-slate-200">
          Turn:{" "}
          <strong className="font-semibold">
            {game.players[game.currentPlayer]?.name ?? "?"}
          </strong>
        </p>
        <p className="mt-1 text-sm text-slate-200">
          You are:{" "}
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

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <h3 className="text-base font-semibold tracking-tight">Your hand</h3>
        <PlayerHand hand={myHand} selectedIds={selectedIds} onToggleCard={toggleCard} />

        <div className="mt-3 flex justify-center gap-3">
          <button
            type="button"
            onClick={handlePlay}
            disabled={!isMyTurn || selectedIds.length === 0}
            className="inline-flex items-center justify-center rounded-full border border-emerald-500/70 bg-emerald-500/20 px-4 py-2 text-sm font-medium text-emerald-100 shadow-md shadow-emerald-500/40 transition hover:bg-emerald-500/30 disabled:cursor-default disabled:opacity-50"
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
      </div>

      <div className="rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
        <h3 className="text-base font-semibold tracking-tight">Players</h3>
        <ul className="mt-2 flex list-none flex-col gap-1 text-sm">
          {game.players.map((player, index) => {
            const isYou = player.id === playerId;
            const isFinished = game.finishedPlayers.includes(index);
            const isCurrent = index === game.currentPlayer;

            return (
              <li
                key={player.id}
                className={
                  "flex items-center justify-between rounded-md px-2 py-1 " +
                  (isYou ? "font-semibold text-sky-200" : "text-slate-100") +
                  (isCurrent ? " underline decoration-amber-400" : "") +
                  (isFinished ? " line-through opacity-60" : "")
                }
              >
                {player.name}
                {isYou && " (you)"}
                {isFinished && " – out"}
              </li>
            );
          })}
        </ul>
    </div>

      <div className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-900/90 p-5 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md md:col-span-3">
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
