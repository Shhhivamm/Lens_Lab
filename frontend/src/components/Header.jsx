const navigationItems = ["Dashboard", "My Reports", "Health Guide"];

function Header() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="/"
          className="text-xl font-bold tracking-tight text-teal-700"
        >
          LabLens
        </a>

        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-6 text-sm font-medium text-slate-600">
            {navigationItems.map((item) => (
              <li key={item}>
                <a className="transition hover:text-teal-700" href="/">
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;