import { useState } from "react";
import { Header, Footer, BoardsFeed } from "./components";

/**
 * Imported global CSS once already in main.tsx
 */

export default function App() {
  const [count, setCount] = useState(0);
  const [title] = useState("Template Site");

  return (
    <div className="page">
      <Header />

      {/* Hero Section */}
      <section className="container cover">
        <div
          className="center stack align-center"
          style={{
            "--center-max": "70ch",
            "--stack-gap": "var(--space-6)",
          } as React.CSSProperties}
        >
          <div>
            <img
              className="img-contain"
              src="../public/sun.jpg"
              alt="sun icon"
              width={256}
              height={256}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>

          <h1 className="tracking-tight align-center">{title}</h1>
          <p className="lead align-center muted">
            Layout primitives, sane tokens, and zero-surprise utilities for fast UI work.
          </p>

          <div className="flex row items-center justify-center gap-4">
            <button onClick={() => setCount((c) => c + 1)}>
              Count is {count}
            </button>
            <a href="#" className="text-sm">
              Read the docs
            </a>
          </div>
        </div>
      </section>

      {/* BoardsFeed (self-contained component) */}
      <BoardsFeed />

      <Footer />
    </div>
  );
}
