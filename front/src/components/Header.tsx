import { Link, useLocation } from "react-router";

export const Header = () => {
  const { pathname } = useLocation();
  const baseLink =
    "text-lg text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer";
  const activeLink = "text-lg font-semibold text-blue-600";
  const postsActive = pathname === "/" || pathname.startsWith("/post");
  const editActive = pathname.startsWith("/edit");

  return (
    <header className="flex flex-col sm:flex-row justify-between items-center py-6 border-b border-gray-200 mb-8 sm:mb-12">
      <Link
        to="/"
        className="flex items-center text-3xl font-bold text-gray-900 tracking-tight mb-4 sm:mb-0 no-underline"
      >
        <span className="text-blue-600 mr-2 font-mono">&gt;_</span>
        Git Log
      </Link>

      <nav className="flex space-x-6">
        <Link to="/" className={postsActive ? activeLink : baseLink}>
          Posts
        </Link>
        <Link to="/edit" className={editActive ? activeLink : baseLink}>
          Edit
        </Link>
      </nav>
    </header>
  );
};
