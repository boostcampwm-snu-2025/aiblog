import { createBrowserRouter, RouterProvider } from "react-router";

import { PATHS } from "@/constants/path";
import Layout from "@/shared/layout/Layout";

import CreatePostPage from "./pages/CreatePostPage";
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
        path: PATHS.post.path,
        children: [
          {
            path: PATHS.post.create.path,
            element: <CreatePostPage />,
          },
        ],
      },
      { path: PATHS.search.path, element: <SearchPage /> },
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
