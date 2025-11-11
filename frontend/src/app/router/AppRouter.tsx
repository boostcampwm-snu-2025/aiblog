import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import GithubPage from "../../features/github/pages/GithubPage";
import MyPostsPage from "../../features/posts/pages/MyPostsPage";
import Header from "../layout/Header";
import { useEffect } from "react";

function usePageTitle(title: string) {
  useEffect(() => {
    document.title = `Smart Blog | ${title}`;
  }, [title]);
}

function GithubRouteWrapper() {
  usePageTitle("GitHub Activity");
  return <GithubPage />;
}

function PostsRouteWrapper() {
  usePageTitle("My Posts");
  return <MyPostsPage />;
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Header />
      <main className="p-6">
        <Routes>
          <Route path="/" element={<Navigate to="/github" />} />
          <Route path="/github" element={<GithubRouteWrapper />} />
          <Route path="/posts" element={<PostsRouteWrapper />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}