import { useEffect, useRef } from "react";

/**
 * Plays a beep sound when it becomes the player's turn
 */
export function useTurnSound(isMyTurn, gameState) {
  const prevIsMyTurnRef = useRef(false);

  useEffect(() => {
    // Only play sound when transitioning from not-my-turn to my-turn
    if (isMyTurn && !prevIsMyTurnRef.current && gameState === "playing") {
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800; // Beep frequency in Hz
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);

        // Cleanup
        setTimeout(() => {
          oscillator.disconnect();
          gainNode.disconnect();
          audioContext.close();
        }, 400);
      } catch (error) {
        // Silently fail if audio context is not available
        console.debug("Could not play turn sound:", error);
      }
    }
    // Update the ref for next comparison
    prevIsMyTurnRef.current = isMyTurn;
  }, [isMyTurn, gameState]);
}
