import { NavBar, Header, Footer, BoardsFeed } from "@/components";

export default function BoardsPage() {
  return (
    <>
    <div className="background-base"/>
    <div className="page">
      <main>
        <Header />

        <section className="container stack align-center">
          <div className="grid">
            {/* <h1 className="tracking-tight align-center">{title}</h1> */}
          </div>

          <h1 className="tracking-tight">Boards</h1>
          <BoardsFeed />
        </section>

        <Footer />
      </main>
    </div>
    </>
  );
}
