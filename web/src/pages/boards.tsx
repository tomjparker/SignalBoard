import { useState, useEffect } from "react";
import { BoardsAPI, type Board } from "../lib/api"

export default function BoardsPage() {
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [newName, setNewName] = useState("");

    useEffect(() => {
        BoardsAPI.list()
            .then(setBoards)
            .catch((error: Error) => setError(error.message))
            .finally(() => setLoading(false));
    }, []);

    async function handleCreate() {
        if (!newName.trim()) return;
        try {
            const slug = newName.toLowerCase().replace(/\s+/g, "-")
            const newBoard = await BoardsAPI.create({ name: newName, slug});
            setBoards([...boards, newBoard]);
            setNewName("");
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError(String(err));
            }
        }
    }

    if (loading) return <p>Loasing...</p>;
    if (error) return <p className="error">{error}</p>

    return (
        <section className="stack surface p-4">
            <h2>Boards</h2>

            <div className="row">
                <input type="text" placeholder="New board name" value={newName} onChange={(e) => setNewName(e.target.value)}/>
                <button onClick={handleCreate}>Create</button>
            </div>

            <ul className="stack">
                {boards.map((board) => (
                    <li key = {board.id} className="card p-3">
                        <h3>{board.name}</h3>
                        <small className="muted">/{board.slug}</small>
                    </li>
                ))}
            </ul>
        </section>
    );
}