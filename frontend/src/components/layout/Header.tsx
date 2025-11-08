import { NavLink } from "react-router";

import { PATHS } from "@/constants/path";

export default function Header() {
  return (
    <header className="flex w-full justify-between border-b border-gray-200 bg-white px-10 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Smart Blog</h1>
      <nav className="flex items-center gap-6">
        <NavItem to={PATHS.home.getHref()} text="글목록" />
        <NavItem to={PATHS.posts.create.search.getHref()} text="글쓰기" />
      </nav>
    </header>
  );
}

type NavItemProps = {
  to: string;
  text: string;
};

const NavItemStyle = {
  default: "text-gray-600",
  active: "font-semibold text-gray-900",
};

// TODO: variant 사용
function NavItem({ to, text }: NavItemProps) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? NavItemStyle.active : NavItemStyle.default)}>
      {text}
    </NavLink>
  );
}
