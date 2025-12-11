import { useState } from "react";

export function DalmutiBuddy({ tips }) {
  const [showBuddy, setShowBuddy] = useState(true);

  return (
    <div className="card-table">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h3 className="text-lg font-semibold text-ui-primary">
            Dalmuti Buddy
          </h3>
          <p className="text-xs text-ui-muted mt-1">
            Simple suggestions to help you learn which plays are valid.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowBuddy((value) => !value)}
          className="btn-secondary px-3 py-1.5 text-sm"
        >
          {showBuddy ? "Hide" : "Show"}
        </button>
      </div>

      {showBuddy && (
        <>
          {tips.length === 0 ? (
            <p className="text-sm text-ui-muted">
              Waiting for tips from the server...
            </p>
          ) : (
            <ul className="list-disc space-y-2 pl-5 text-sm text-ui-secondary">
              {tips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
