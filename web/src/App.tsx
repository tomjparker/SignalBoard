import { useState, useRef, useEffect } from 'react';
import { BoardsAPI, type Board } from "./lib/api";
// import Eclipse from "@/assets";
// import Sun from "@/assets/sun-icon.png";

/**
 * Imported global CSS once already in main.tsx:
 */

function EditableText({
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

function DraggableCard({ item }: { item: Item }) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="card px-3 py-2 cursor-move"
      role="listitem"
      aria-label={`Drag ${item.label}`}
      title="Drag me"
    >
      {item.label}
    </div>
  );
}

function DroppableZone({
  title,
  items,
  onDropIds,
  hint = "Drag items here",
}: {
  title: string;
  items: Item[];
  onDropIds: (ids: string[]) => void;
  hint?: string;
}) {
  const [hover, setHover] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const dt = e.dataTransfer;
    const id = dt.getData("text/plain"); // simple single-id drop
    if (id) onDropIds([id]);
    setHover(false);
  }

  return (
    <section
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={handleDrop}
      className={`stack surface p-3 ${hover ? "ring-2 ring-blue-500" : ""}`}
      style={{ "--stack-gap": "var(--space-3)" }}
      aria-label={title}
    >
      <h3 className="tracking-tight">{title}</h3>
      {items.length === 0 ? (
        <div className="muted text-sm">{hint}</div>
      ) : (
        <div className="grid" style={{ "--grid-min": "12rem" }}>
          {items.map((it) => (
            <DraggableCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}

type Item = { id: string; label: string };

type SetItems = React.Dispatch<React.SetStateAction<Item[]>>;

function moveItems(
  ids: string[],
  from: Item[],
  to: Item[],
  setFrom: SetItems,
  setTo: SetItems
) {
  if (ids.length === 0) return;

  const idSet = new Set(ids); // Using a set here ensures performance doesnt slow down as the list grows - its a bit like a hashtable which is 0(1)

  const picked: Item[] = [];
  const remainingFrom: Item[] = [];
  for (const it of from) {
    (idSet.has(it.id) ? picked : remainingFrom).push(it);
  }

  if (picked.length === 0) return;

  // Optional: prevent duplicates in the target
  const existing = new Set(to.map(i => i.id));
  const deduped = picked.filter(i => !existing.has(i.id));

  setFrom(remainingFrom);
  setTo(prev => [...prev, ...deduped]);
}

export default function App() {
  const [count, setCount] = useState(0)
  const [title, setTitle] = useState("Template Site");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [boards, setBoards] = useState<Board[]>([]);

  // inside App()
  const [left, setLeft] = useState<Item[]>([
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
    { id: "c", label: "Gamma" },
  ]);
  const [right, setRight] = useState<Item[]>([]);

  useEffect(() => {
    BoardsAPI.list()
      .then((data) => setBoards(data))
      .catch((error: Error) => setError(error.message))
      .finally(() => setLoading(false));

      console.log("Board fetch error:", error)
  }, []);

  return (
    <div className="page">
      {/* Header */}
      <header className="container flex items-center justify-between gap-4">
        <a href="/" className="eyebrow muted">ui-library</a>

        <nav className="flex row gap-3 nowrap" aria-label="primary">
          <a href="#">Docs</a>
          <a href="#">Components</a>
          <a href="#">GitHub</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="container cover">
        <div
          className="center stack align-center"
          style={
            {
              '--center-max': '70ch',
              '--stack-gap': 'var(--space-6)',
            }}
        >
          <div>
            <img
              className="img-contain"
              src={"../public/sun.jpg"}
              alt="sun icon"
              width={256}
              height={256}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
            {/* <svg src={Eclipse}/> */}
          </div>

          <h1 className="tracking-tight align-center">Template Site</h1>
          <p className="lead align-center muted">
            Layout primitives, sane tokens, and zero-surprise utilities for fast UI work.
          </p>

          <div className="flex row items-center justify-center gap-4">
            <button onClick={() => setCount((c) => c + 1)}>Count is {count}</button>
            <a href="#" className="text-sm">Read the docs</a>
          </div>
        </div>
      </section>

      {/* Feature grid */}
      <main
        className="container stack"
        style={{ '--stack-gap': 'var(--space-7)' }}
      >
        <section
          className="surface stack"
          style={{ '--stack-gap': 'var(--space-6)' }}
        >
          <h1 className="tracking-tight">Project Feed</h1>
          {loading ? (
            <p>Loading boards...</p>
          ) : boards.length === 0 ? (
            <p>No boards available</p>
          ) : (
            <ul className="stack">
              {boards.map((board) => (
                <li key={board.id} className="card p-3">
                  <h3>{board.name}</h3>
                  <small className="muted">/{board.slug}</small>
                </li>
              ))}
            </ul>
          )}
        
        </section>
        <section
          className="surface stack"
          style={{ '--stack-gap': 'var(--space-6)' }}
        >
          <h2 className="tracking-tight">Primitives</h2>

          <div
            className="grid"
            style={{
              '--grid-min': '18rem',
              '--grid-gap': 'var(--space-6)'
            }}
          >
            <article className="card stack" style={{ '--stack-gap': 'var(--space-3)' }}>
              <p className="eyebrow muted">Primitive</p>
              <h3 className="tracking-tight">Stack</h3>
              <p>Vertical rhythm with <code>gap</code>, great for forms and sections.</p>
            </article>

            <article className="card stack" style={{ '--stack-gap': 'var(--space-3)' }}>
              <p className="eyebrow muted">Primitive</p>
              <h3 className="tracking-tight">Cluster</h3>
              <p>Inline groups with wrapping + gaps for buttons, chips, tags.</p>
              <div className="cluster" style={{ '--cluster-gap': 'var(--space-2)' }}>
                <button>Alpha</button><button>Beta</button><button>Gamma</button>
              </div>
            </article>

            <article className="card stack" style={{ '--stack-gap': 'var(--space-3)' }}>
              <p className="eyebrow muted">Primitive</p>
              <h3 className="tracking-tight">Grid</h3>
              <p>Auto-fit responsive columns via <code>--grid-min</code>.</p>
            </article>
          </div>
        </section>

        {/* Sidebar layout */}
        <section className="sidebar" style={{ '--sidebar-gap': 'var(--space-6)' }}>
          <aside className="stack" style={{ '--stack-gap': 'var(--space-3)' }}>
            <h4 className="tracking-tight">Filters</h4>
            <label className="flex row items-center gap-2">
              <input type="checkbox" /> Compact spacing
            </label>
            <label className="flex row items-center gap-2">
              <input type="checkbox" /> Show borders
            </label>
          </aside>

          <div className="grid" style={{ '--grid-min': '15rem' }}>
            <article className="card">Result A</article>
            <article className="card">Result B</article>
            <article className="card">Result C</article>
            <article className="card">Result D</article>
          </div>
        </section>

        <section className="switcher" style={{ '--switcher-threshold': '40rem' }}>
          <h1 className="tracking-tight align-center">
            <EditableText value={title} onChange={setTitle} />
          </h1>
          <DroppableZone
            title="Backlog"
            items={left}
            onDropIds={(ids) => moveItems(ids, right, left, setRight, setLeft)}
            hint="Drag from the other column"
          />
          <DroppableZone
            title="Selected"
            items={right}
            onDropIds={(ids) => moveItems(ids, left, right, setLeft, setRight)}
            hint="Drop items to add here"
          />
        </section>

        {/* Switcher: row -> column under threshold */}
        <section className="switcher" style={{ '--switcher-threshold': '28rem' }}>
          <div className="card">Panel 1</div>
          <div className="card">Panel 2</div>
          <div className="card">Panel 3</div>
        </section>
      </main>

      {/* Footer */}
      <footer
        className="container cluster"
        style={{ '--cluster-justify': 'space-between' }}
      >
        <small className="muted">© {new Date().getFullYear()} Tom Parker</small>
        <div className="cluster gap-2">
          <a href="#" className="text-sm">Twitter</a>
          <a href="#" className="text-sm">Discord</a>
          <a href="#" className="text-sm">GitHub</a>
        </div>
      </footer>
    </div>
  )
}