import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { PATHS } from "@/constants/paths";

import CreatePostPage from "@/pages/CreatePostPage";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import PostDetailPage from "@/pages/PostDetailPage";
import SearchPage from "@/pages/Search";
import Layout from "@/shared/layout/Layout";

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
          { path: PATHS.post.detail.path, element: <PostDetailPage /> },
        ],
      },
      { path: PATHS.search.path, element: <SearchPage /> },
      {
        path: PATHS.notFound.path,
        element: <NotFound />,
      },
      {
        path: "*",
        element: <Navigate to={PATHS.notFound.getHref()} replace />,
      },
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
