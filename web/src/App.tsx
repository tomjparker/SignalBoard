import { useState } from "react";
import { Header, Footer, BoardsFeed, MediaBlock, NavBar } from "./components/index";
import Eclipse from "@/img/eclipse.svg?react";


// const logos = import.meta.glob("@/img/*.svg", { eager: true, import: "default" });

// {Object.entries(logos).map(([path, src]) => (
//   <Logo key={path} src={src as string} size={80} />
// ))}

export default function App() {
  const [count, setCount] = useState(0);
  const [title] = useState("Signal Board");

  return (
    <div className="page">
      <NavBar />
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

        <h1 className="tracking-tight align-center">{title}</h1>

        <div className="flex row items-center justify-center gap-4">
          <button onClick={() => setCount((c) => c + 1)}>
            Count is {count}
          </button>
          <a href="#" className="text-sm">
            Read the docs
          </a>
        </div>
          {/* <div>
            <Logo src={Eclipse} size={200} alt="Sun" className="rounded-full shadow-md" />
          </div> */}
          {/* <div>
            <Logo src="/sun.jpg" size={400} alt="Sun" className="rounded-full shadow-md" />
          </div> */}

          <MediaBlock
            src={Eclipse}
            alt="Eclipse Icon"
            title="Eclipse System"
            text="A responsive layout block for showcasing key features or projects. It automatically stacks on mobile and aligns side-by-side on desktop."
          />

          <MediaBlock
            src="/sun.jpg"
            alt="Sun Symbol"
            title="Scalable Design"
            text="Images and SVGs scale seamlessly with text. Use this for about sections, feature highlights, or onboarding cards."
            reverse
          /> 
        </div>
      </section>

      {/* BoardsFeed (self-contained component) */}
      <BoardsFeed />

      <Footer />
    </div>
  );
}
