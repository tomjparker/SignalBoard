import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import App from './App'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BoardsPage from "./pages/boards";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/boards" element={<BoardsPage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
