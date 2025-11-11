import { Link, useLocation } from "react-router-dom";

export default function Header() {
  const { pathname } = useLocation();

  return (
    <header className="flex items-center justify-between px-6 py-3 bg-gray-900 text-white shadow">
      <h1 className="text-xl font-bold">Smart Blog w/ ChatGPT</h1>
      <nav className="flex gap-4">
        <Link
          to="/github"
          className={`hover:text-blue-400 ${
            pathname.startsWith("/github") ? "text-blue-400" : ""
          }`}
        >
          GitHub
        </Link>
        <Link
          to="/posts"
          className={`hover:text-blue-400 ${
            pathname.startsWith("/posts") ? "text-blue-400" : ""
          }`}
        >
          My Posts
        </Link>
      </nav>
    </header>
  );
}