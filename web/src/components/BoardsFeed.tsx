import { useEffect, useState } from "react";
import { BoardsAPI }from "../lib/api";

export default function BoardsFeed() {
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    BoardsAPI.list()
      .then((data) => setBoards(data))
      .catch((err: Error) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p>Loading boards...</p>;
  }

  if (error) {
    return <p className="muted text-sm">Error loading boards: {error}</p>;
  }

  if (boards.length === 0) {
    return <p>No boards available.</p>;
  }

  return (
    <section
      className="surface stack"
      style={{ "--stack-gap": "var(--space-6)" } as React.CSSProperties}
    >
      <h1 className="tracking-tight">Project Feed</h1>
      <ul className="stack">
        {boards.map((board) => (
          <li key={board.id} className="card p-3">
            <h3>{board.name}</h3>
            <small className="muted">/{board.slug}</small>
          </li>
        ))}
      </ul>
    </section>
  );
}