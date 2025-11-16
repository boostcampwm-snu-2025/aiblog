import "./App.css";
import { useState } from "react";

import Navigation from "./component/Navigation";
import Search from "./component/Search";
import LoadingBar from "./component/LoadingBar";

import { useRepos } from "./hooks/useRepos";
import { useCommits } from "./hooks/useCommits";

import ReposPage from "./pages/ReposPage";
import CommitsPage from "./pages/CommitsPage";
import BlogPage from "./pages/BlogPage";

export default function App() {
  const [username, setUsername] = useState("zoo-zer0");
  const [repoName, setRepoName] = useState("");
  const [view, setView] = useState<"repos" | "commits" | "blog">("repos");
  const [blogContent, setBlogContent] = useState("");

  const { repos, loading: reposLoading } = useRepos();
  const {
    commits,
    loading: commitsLoading,
  } = useCommits(username, repoName);

  const loading = reposLoading || commitsLoading;

  const handleSearch = (username: string, repo: string) => {
    setUsername(username);
    setRepoName(repo);
    setView(repo ? "commits" : "repos");
  };

  async function handleGenerateBlog(username: string, repo: string) {
    setView("blog");

    const res = await fetch("http://localhost:3001/generate-blog", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, repo }),
    });
    const data = await res.json();
    setBlogContent(data.blog);
  }

  return (
    <>
      <Navigation />
      <Search username={username} repoName={repoName} onSearch={handleSearch} />

      {loading ? (
        <LoadingBar loading />
      ) : view === "repos" ? (
        <ReposPage
          repos={repos}
          username={username}
          onSearch={handleSearch}
          onGenerate={handleGenerateBlog}
        />
      ) : view === "commits" ? (
        <CommitsPage
          username={username}
          repoName={repoName}
          commits={commits}
        />
      ) : view === "blog" ? (
        <BlogPage content={blogContent} />
      ) : null}
    </>
  );
}
