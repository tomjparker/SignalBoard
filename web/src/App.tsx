import { useState } from "react";
import { Header, Footer, MediaBlock, NavBar, AutoScroller } from "./components/index";
import Eclipse from "@/img/eclipse.svg?react";

// const logos = import.meta.glob("@/img/*.svg", { eager: true, import: "default" });

// {Object.entries(logos).map(([path, src]) => (
//   <Logo key={path} src={src as string} size={80} />
// ))}

export default function App() {
  // const [count, setCount] = useState(0);
  const [title] = useState("Basic Placards");

  return (
    <>
      <div className="background-base"/>
      <div className="page">
        <div className="scroll-watcher"></div>
        <Header />
        {/* Hero Section */}
        <section className="container stack align-center">
          <div className="grid">
            <h1 className="tracking-tight align-center">{title}</h1>
            </div>

          <div className="grid">
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
            />

            {/* Future blocks */}
            <MediaBlock
              src="/moon.png"
              alt="Moon Symbol"
              title="Adaptive Interfaces"
              text="Dynamic themes that respond to user preferences for dark mode and reduced motion."
            />
          </div>
        </section>
        <section className="container stack align-center">
          <AutoScroller />
        </section>
        <section className="container stack align-center">
          <AutoScroller />
        </section>

        <Footer />
      </div>
    </>
  );
}
