import React from "react";
import { GameSnapshot, PublicPlayer } from "../../../shared/types";

interface RoundResultsModalProps {
  game: GameSnapshot;
  isHost: boolean;
  onStartNextRound: () => void;
  onLeaveGame: () => void;
}

export function RoundResultsModal({
  game,
  isHost,
  onStartNextRound,
  onLeaveGame,
}: RoundResultsModalProps) {
  if (game.gameState !== "roundEnd") return null;

  const getFullRanking = (): { player: PublicPlayer; role: string; rank: number }[] => {
    const ranking: { player: PublicPlayer; role: string; rank: number }[] = [];
    const totalPlayers = game.players.length;
    const finishedSet = new Set(game.finishedPlayers);
    
    // Players who finished
    game.finishedPlayers.forEach((playerIndex, idx) => {
      let role = "Merchant";
      if (idx === 0) {
        role = "Greater Dalmuti";
      } else if (idx === 1 && totalPlayers > 3) {
        role = "Lesser Dalmuti";
      } else if (idx === totalPlayers - 2 && totalPlayers >= 4) {
        role = "Lesser Peon";
      }

      ranking.push({
        player: game.players[playerIndex],
        role,
        rank: idx + 1,
      });
    });

    // The player who didn't finish
    const lastPlayerIndex = game.players.findIndex((_, idx) => !finishedSet.has(idx));
    if (lastPlayerIndex !== -1) {
      ranking.push({
        player: game.players[lastPlayerIndex],
        role: "Greater Peon",
        rank: totalPlayers,
      });
    }

    return ranking;
  };

  const results = getFullRanking();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-in">
      <div className="bg-slate-800 border-2 border-amber-500 rounded-xl shadow-2xl max-w-md w-full overflow-hidden animate-zoom-in">
        <div className="bg-amber-500 p-4 text-slate-900 font-bold text-center text-2xl uppercase tracking-wider">
          Round Results
        </div>
        
        <div className="p-6 space-y-4">
          <div className="space-y-3">
            {results.map((result, idx) => (
              <div 
                key={result.player.id} 
                style={{ animationDelay: `${idx * 150}ms` }}
                className={`flex items-center justify-between p-3 rounded-lg border-l-4 transition-all animate-slide-in-left ${
                  result.rank === 1 
                    ? "bg-amber-500/20 border-amber-500" 
                    : result.rank === results.length 
                      ? "bg-slate-700/50 border-slate-500" 
                      : "bg-slate-700/30 border-amber-500/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${
                    result.rank === 1 ? "bg-amber-500 text-slate-900" : "bg-slate-600 text-slate-200"
                  }`}>
                    {result.rank}
                  </span>
                  <div>
                    <div className="font-semibold text-slate-100">{result.player.name}</div>
                    <div className="text-xs text-amber-400 font-medium uppercase tracking-tighter">
                      {result.role}
                    </div>
                  </div>
                </div>
                {result.rank === 1 && (
                  <span className="text-2xl animate-bounce-slow">👑</span>
                )}
              </div>
            ))}
          </div>

          <div className="pt-6 flex flex-col gap-3">
            {isHost ? (
              <button
                onClick={onStartNextRound}
                className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-lg shadow-lg shadow-amber-500/20 transition-all active:scale-95 text-lg uppercase tracking-wide"
              >
                Start Next Round
              </button>
            ) : (
              <div className="text-center text-slate-400 italic py-2">
                Waiting for host to start next round...
              </div>
            )}
            
            <button
              onClick={onLeaveGame}
              className="w-full py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold rounded-lg transition-all active:scale-95"
            >
              Leave Game
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

