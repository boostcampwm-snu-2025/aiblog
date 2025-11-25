import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@shared";

export function Header() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link
          to="/"
          className="text-xl font-bold text-gray-900 hover:text-gray-700 transition-colors"
        >
          Smart Blog
        </Link>

        <nav className="flex items-center gap-2">
          <Link to="/saved">
            <Button
              variant={isActive("/saved") ? "default" : "ghost"}
              size="sm"
            >
              Saved Posts
            </Button>
          </Link>
          <Link to="/settings">
            <Button
              variant={isActive("/settings") ? "default" : "ghost"}
              size="sm"
            >
              Settings
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  );
}
