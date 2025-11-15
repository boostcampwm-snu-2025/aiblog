import { NavLink } from "react-router";

import { PATHS } from "@/constants/path";

export default function Header() {
  return (
    <header className="flex w-full justify-between border-b border-gray-200 bg-white px-10 py-8">
      <h1 className="text-2xl font-bold text-gray-900">Smart Blog</h1>
      <nav className="flex items-center gap-6">
        <NavItem to={PATHS.home.getHref()} text="홈" />
        <NavItem to={PATHS.search.getHref()} text="검색" />
        <NavItem to={PATHS.post.create.getHref()} text="글쓰기" />
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

function NavItem({ to, text }: NavItemProps) {
  return (
    <NavLink to={to} className={({ isActive }) => (isActive ? NavItemStyle.active : NavItemStyle.default)}>
      {text}
    </NavLink>
  );
}
