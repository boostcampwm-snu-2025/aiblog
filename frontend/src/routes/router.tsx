import { createBrowserRouter, RouterProvider } from "react-router";

import Layout from "@/components/layout/Layout";
import { PATHS } from "@/constants/path";

import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SearchPage from "./pages/Search";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: PATHS.home.path,
        element: <Home />,
      },
      {
        path: PATHS.posts.path,
        children: [
          {
            path: PATHS.posts.create.path,
            children: [{ path: PATHS.posts.create.search.path, element: <SearchPage /> }],
          },
        ],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
