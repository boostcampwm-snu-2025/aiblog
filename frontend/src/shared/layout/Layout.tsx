import { Outlet } from "react-router";

import Header from "./Header";

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col items-center">
      <Header />
      <main className="w-full flex-1">
        <Outlet />
      </main>
    </div>
  );
}
