export default function Header() {
  return (
    <header className="container flex items-center justify-between gap-4 py-3">

      <nav className="flex row gap-3 nowrap" aria-label="primary">
        <a href="#">Docs</a>
        <a href="#">Components</a>
        <a href="#">GitHub</a>
      </nav>
    </header>
  );
}
