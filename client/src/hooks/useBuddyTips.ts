import { useEffect, useState } from "react";
import { useGame, usePlayerId, useSocketApi } from "../store/gameStore";

interface BuddyTipsPayload {
  playerId?: string;
  tips: string[];
}

/**
 * Manages buddy tips from the server
 * Now uses Zustand store instead of props
 */
export function useBuddyTips(): string[] {
  const [buddyTips, setBuddyTips] = useState<string[]>([]);
  const socketApi = useSocketApi();
  const game = useGame();
  const playerId = usePlayerId();
  const { emit, on, off } = socketApi ?? {};

  useEffect(() => {
    if (!on || !off) return;

    function handleBuddyTips(...args: unknown[]) {
      const payload = args[0] as BuddyTipsPayload | undefined;
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

  return buddyTips;
}
