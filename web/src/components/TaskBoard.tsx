import { useState } from "react";
import EditableText from "./EditableText";
import DroppableZone from "./DropableZone";

// --- Helper function ---
function moveItems(
  ids: string[],
  from: Item[],
  to: Item[],
  setFrom: React.Dispatch<React.SetStateAction<Item[]>>,
  setTo: React.Dispatch<React.SetStateAction<Item[]>>
) {
  if (ids.length === 0) return;

  const idSet = new Set(ids);
  const picked: Item[] = [];
  const remainingFrom: Item[] = [];

  for (const it of from) {
    (idSet.has(it.id) ? picked : remainingFrom).push(it);
  }

  if (picked.length === 0) return;

  const existing = new Set(to.map((i) => i.id));
  const deduped = picked.filter((i) => !existing.has(i.id));

  setFrom(remainingFrom);
  setTo((prev) => [...prev, ...deduped]);
}

// --- Main component ---
export default function TaskBoard() {
  const [title, setTitle] = useState("My Tasks");

  const [left, setLeft] = useState<Item[]>([
    { id: "a", label: "Alpha" },
    { id: "b", label: "Beta" },
    { id: "c", label: "Gamma" },
  ]);
  const [right, setRight] = useState<Item[]>([]);

  return (
    <section
      className="switcher"
      style={{ "--switcher-threshold": "40rem" } as React.CSSProperties}
    >
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
  );
}
