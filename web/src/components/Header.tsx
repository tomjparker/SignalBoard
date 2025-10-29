import { NavLink } from "react-router-dom";
import React from "react";

export default function Header() {
  return (
    <header className="site-header">
      {/* Top bar: external links */}
      <div className="header-top">
        <h2 className="header-title">UI Library CSS</h2>
        <nav className="header-links" aria-label="External Links">
          <a href="/docs" target="_blank" rel="noopener noreferrer">Docs</a>
          <a href="https://github.com/yourname" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://linkedin.com/in/yourname" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </nav>
      </div>

      {/* Bottom bar: internal navigation */}
      <NavBar />
    </header>
  );
}

function NavBar() {
  return (
    <nav className="navbar" aria-label="Main Navigation">
      <ul className="navbar-links">
        <li><NavLink to="/" end className="navlink">Home</NavLink></li>
        <li><NavLink to="/boards" className="navlink">Boards</NavLink></li>
        <li><NavLink to="/components" className="navlink">Components</NavLink></li>
      </ul>
    </nav>
  );
}
