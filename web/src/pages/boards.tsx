import { NavBar, Header, Footer, BoardsFeed } from "@/components";

export default function BoardsPage() {
  return (
    <>
    <div className="background-base"/>
    <div className="page">
      <NavBar />
      <main>
        <Header />

        <section className="surface stack p-6" style={{ "--stack-gap": "var(--space-5)" } as React.CSSProperties}>
          <h1 className="tracking-tight">Boards</h1>
          <BoardsFeed />
        </section>

        <Footer />
      </main>
    </div>
    </>
  );
}
