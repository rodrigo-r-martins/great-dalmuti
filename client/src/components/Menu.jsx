export function Menu({
  connected,
  roomId,
  playerName,
  onRoomIdChange,
  onPlayerNameChange,
  onCreateRoom,
  onJoinRoom,
  error,
}) {
  // Allow submits as soon as inputs are filled; socket.io will
  // buffer events until the connection is established.
  const canSubmit = roomId.trim() !== "" && playerName.trim() !== "";

  function handleCreate(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onCreateRoom({ roomId: roomId.trim(), playerName: playerName.trim() });
  }

  function handleJoin(e) {
    e.preventDefault();
    if (!canSubmit) return;
    onJoinRoom({ roomId: roomId.trim(), playerName: playerName.trim() });
  }

  return (
    <div className="rounded-2xl border border-slate-700/60 bg-panel-charcoal/95 p-6 text-slate-50 shadow-2xl shadow-black/60 backdrop-blur-md">
      <h2 className="text-xl font-semibold tracking-tight">Join or Create a Room</h2>
      <form className="mt-4 flex flex-col gap-4" onSubmit={handleCreate}>
        <label className="flex flex-col items-start gap-1.5 text-sm">
          <span className="text-slate-200">Player name</span>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Your name"
            className="w-full rounded-lg border border-slate-600/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </label>

        <label className="flex flex-col items-start gap-1.5 text-sm">
          <span className="text-slate-200">Room ID</span>
          <input
            type="text"
            value={roomId}
            onChange={(e) => onRoomIdChange(e.target.value)}
            placeholder="e.g. dalmuti-1"
            className="w-full rounded-lg border border-slate-600/70 bg-slate-900/80 px-3 py-2 text-sm text-slate-50 shadow-inner shadow-black/40 outline-none transition focus:border-sky-400 focus:ring-1 focus:ring-sky-400"
          />
        </label>

        <div className="flex flex-wrap gap-2 pt-1">
          <button
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center justify-center rounded-full border border-slate-500/60 bg-slate-900/90 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-black/50 transition hover:border-sky-400 hover:shadow-sky-500/30 disabled:cursor-default disabled:opacity-50"
          >
            Create room
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleJoin}
            className="inline-flex items-center justify-center rounded-full border border-slate-500/60 bg-slate-900/90 px-4 py-2 text-sm font-medium text-slate-50 shadow-md shadow-black/50 transition hover:border-emerald-400 hover:shadow-emerald-500/30 disabled:cursor-default disabled:opacity-50"
          >
            Join room
          </button>
        </div>

        {!connected && (
          <p className="mt-2 text-xs text-slate-400">
            Waiting for server connection...
          </p>
        )}

        {error && (
          <p className="mt-2 text-xs font-medium text-amber-400">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
