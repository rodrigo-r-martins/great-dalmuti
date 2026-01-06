export function HowToPlayModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="card-table max-w-4xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-parchment z-10 py-2">
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-royal-purple-dark pr-4">
            📖 How to Play The Great Dalmuti
          </h2>
          <button
            onClick={onClose}
            className="text-2xl text-ui-muted hover:text-ui-primary transition-colors"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="prose prose-sm max-w-none">
          <div className="space-y-6 text-ui-secondary">
            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">1. Deck</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>The deck is a custom <strong>80-card</strong> deck.</li>
                <li>Card values: 1×1 (Dalmuti), 2×2, 3×3, 4×4, 5×5, 6×6, 7×7, 8×8, 9×9, 10×10, 11×11, 12×12, 2×13 (Jesters)</li>
                <li><strong>Rank:</strong> Lower numbers are better when comparing sets.</li>
                <li><strong>Jesters (13):</strong> When played with other cards, each Jester is a wild card. When played alone, it counts as value 13 (worst).</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">2. Objective</h3>
              <p>The goal of each hand is to <strong>shed all your cards</strong> as quickly as possible. The earlier you go out, the higher your rank for that hand.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">3. Playing a Trick</h3>
              <p>Play proceeds <strong>clockwise</strong>. On your turn you must either:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li><strong>Play</strong> a valid set of cards, or</li>
                <li><strong>Pass</strong></li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">4. Valid Sets</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>A <strong>set</strong> is one or more cards you play from your hand.</li>
                <li>All non-Jester cards in a set must have the <strong>same value</strong>.</li>
                <li>Jesters may be included as wild cards.</li>
                <li>The <strong>value of the set</strong> is the common value of its non-Jester cards, or 13 if all Jesters.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">5. First Play of a Trick</h3>
              <p>The player who leads a trick may play <strong>any non-empty valid set</strong>. A set of only Jesters is allowed and has value 13.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">6. Following Plays</h3>
              <p>Each subsequent play in that trick must:</p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Use the <strong>same number of cards</strong> as the current leading set.</li>
                <li>Be a <strong>valid set</strong> (all non-Jesters same value).</li>
                <li>Have a set value <strong>strictly lower</strong> than the current leading set.</li>
              </ul>
              <p className="mt-2">If you cannot or do not wish to play a valid lower set, you <strong>pass</strong>.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">7. Jesters (Wild Cards)</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>A Jester played alone is a <strong>13</strong> – the worst single card.</li>
                <li>Jesters can be used to <strong>complete better sets</strong>, for example: 6 + Jester counts as a pair of 6s.</li>
                <li>A set of only Jesters is legal to lead a trick, but is very weak and almost always beaten by any numbered set of the same size.</li>
              </ul>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">8. Passing and Ending a Trick</h3>
              <p>If you pass, you take no further part in that trick. A trick ends when <strong>all active players except the player who made the last valid play</strong> have passed. The player who made the last valid play <strong>wins the trick</strong> and will lead the next trick.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">9. Ending a Round</h3>
              <p>Whenever a player plays a set and their hand becomes empty, they are marked as <strong>finished</strong> for that round. The round ends when <strong>only one player</strong> still has cards.</p>
            </section>

            <section>
              <h3 className="text-xl font-bold text-ui-primary mb-2">10. Strategy Tips</h3>
              <ul className="list-disc pl-6 space-y-1">
                <li>Save your low cards (1s, 2s) for when you need to beat a play.</li>
                <li>Use Jesters wisely – they're powerful when combined with other cards, but weak alone.</li>
                <li>Pay attention to how many cards each player has left.</li>
                <li>Try to go out first to get the best rank!</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="btn-primary px-6 py-2"
          >
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
}
