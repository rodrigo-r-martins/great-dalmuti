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
    <div className="panel">
      <h2>Join or Create a Room</h2>
      <form className="form" onSubmit={handleCreate}>
        <label className="form-field">
          <span>Player name</span>
          <input
            type="text"
            value={playerName}
            onChange={(e) => onPlayerNameChange(e.target.value)}
            placeholder="Your name"
          />
        </label>

        <label className="form-field">
          <span>Room ID</span>
          <input
            type="text"
            value={roomId}
            onChange={(e) => onRoomIdChange(e.target.value)}
            placeholder="e.g. dalmuti-1"
          />
        </label>

        <div className="form-actions">
          <button type="submit" disabled={!canSubmit}>
            Create room
          </button>
          <button type="button" disabled={!canSubmit} onClick={handleJoin}>
            Join room
          </button>
        </div>

        {!connected && (
          <p className="hint">Waiting for server connection...</p>
        )}

        {error && <p className="error-text">{error}</p>}
      </form>
    </div>
  );
}
