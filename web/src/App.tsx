import { useState } from 'react';
// import Eclipse from "@/assets";
// import Sun from "@/assets/sun-icon.png";

/**
 * Imported global CSS once already in main.tsx:
 */
export default function App() {
  const [count, setCount] = useState(0)

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