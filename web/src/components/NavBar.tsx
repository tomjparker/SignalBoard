import { NavLink } from "react-router-dom";
import React from "react";

export default function NavBar() {
  return (
    <header className="navbar">
      <nav className="navbar-inner">
        <div className="navbar-brand">
          <NavLink to="/" className="navbar-logo">
            SignalBoard
          </NavLink>
        </div>

        <ul className="navbar-links">
          <li>
            <NavLink to="/" end className="navlink">
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/boards" className="navlink">
              Boards
            </NavLink>
          </li>
          <li>
            <NavLink to="/components" className="navlink">
              Components
            </NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
