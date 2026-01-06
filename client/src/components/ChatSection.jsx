export function ChatSection() {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-ui-primary mb-3">💬 Chat</h3>
      <div className="bg-parchment-dark rounded-lg p-3 sm:p-4 h-32 sm:h-40 overflow-y-auto">
        <p className="text-sm text-ui-muted italic">Chat feature coming soon...</p>
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          placeholder="Type message..."
          disabled
          className="input-field flex-1 text-sm py-2 px-3"
        />
        <button
          disabled
          className="btn-secondary px-4 py-2 text-sm disabled:opacity-50 whitespace-nowrap"
        >
          Send
        </button>
      </div>
    </div>
  );
}
