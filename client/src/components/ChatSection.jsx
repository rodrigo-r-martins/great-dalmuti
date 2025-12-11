export function ChatSection() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-ui-primary mb-3">💬 Chat</h3>
      <div className="bg-parchment-dark rounded-lg p-4 min-h-[120px] max-h-[200px] overflow-y-auto">
        <p className="text-sm text-ui-muted italic">Chat feature coming soon...</p>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          disabled
          className="input-field flex-1 text-sm"
        />
        <button
          disabled
          className="btn-secondary px-4 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </div>
  );
}
