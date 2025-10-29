import { Footer, Header, NavBar } from "@/components"

export default function ComponentsPage() {
    return (
    <>
      <div className="background-base"/>
      <div className="page">
        <NavBar/>
        <Header/>
        <div className="container mx-auto py-8 space-y-12">
          <h1 className="text-2xl font-semibold tracking-tight mb-6">
            UI Components Showcase
          </h1>

          <p className="lead align-center muted">
                Layout primitives, sane tokens, and zero-surprise utilities for fast UI work.
              </p>

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
          <Footer/>
        </div>
      </div>
    </>
    );
}