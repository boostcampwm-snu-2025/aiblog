import { createBrowserRouter, Navigate, RouterProvider } from "react-router";

import { PATHS } from "@/constants/paths";

import CreatePostPage from "@/pages/CreatePostPage";
import HomePage from "@/pages/HomePAge";
import NotFoundPage from "@/pages/NotFoundPage";
import PostDetailPage from "@/pages/PostDetailPage";
import SearchPage from "@/pages/SearchPage";
import Layout from "@/shared/layout/Layout";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: PATHS.home.path,
        element: <HomePage />,
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
        element: <NotFoundPage />,
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
