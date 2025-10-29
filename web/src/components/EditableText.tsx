import { useState, useRef, useEffect } from "react";

export default function EditableText({
  value,
  onChange,
  placeholder = "Click to edit…",
}: {
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  function commit() {
    if (draft !== value) onChange(draft.trim());
    setEditing(false);
  }
  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (!editing) {
    return (
      <button
        type="button"
        className="inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-neutral-100"
        onClick={() => setEditing(true)}
        aria-label="Edit text"
        title="Click to edit"
      >
        <span className={value ? "" : "muted"}>
          {value || placeholder}
        </span>
        <span aria-hidden>✏️</span>
      </button>
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <input
        ref={inputRef}
        className="border rounded px-2 py-1"
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
      />
      <button className="text-sm" onClick={commit}>Save</button>
      <button className="text-sm" onClick={cancel}>Cancel</button>
    </div>
  );
}