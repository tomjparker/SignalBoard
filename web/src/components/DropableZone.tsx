import { useState } from "react";

interface DroppableZoneProps {
  title: string;
  items: Item[];
  onDropIds: (ids: string[]) => void;
  hint?: string;
}

interface DraggableCardProps {
  item: Item;
}

export function DraggableCard({ item }: DraggableCardProps) {
  return (
    <div
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
      }}
      className="card px-3 py-2 cursor-move"
      role="listitem"
      title="Drag me"
    >
      {item.label}
    </div>
  );
}

export default function DroppableZone({
  title,
  items,
  onDropIds,
  hint = "Drag items here",
}: DroppableZoneProps) {
  const [hover, setHover] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
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
      style={{ "--stack-gap": "var(--space-3)" } as React.CSSProperties}
    >
      <h3 className="tracking-tight">{title}</h3>
      {items.length === 0 ? (
        <div className="muted text-sm">{hint}</div>
      ) : (
        <div className="grid" style={{ "--grid-min": "12rem" } as React.CSSProperties}>
          {items.map((it) => (
            <DraggableCard key={it.id} item={it} />
          ))}
        </div>
      )}
    </section>
  );
}
