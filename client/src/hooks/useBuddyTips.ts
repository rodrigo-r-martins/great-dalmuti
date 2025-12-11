import { useEffect, useState } from "react";
import type { GameSnapshot } from "../../../shared/types";
import type { SocketApi } from "./useSocket";

interface BuddyTipsPayload {
  playerId?: string;
  tips: string[];
}

/**
 * Manages buddy tips from the server
 */
export function useBuddyTips(
  socketApi: SocketApi | null,
  game: GameSnapshot | null,
  playerId: string,
): string[] {
  const [buddyTips, setBuddyTips] = useState<string[]>([]);
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
