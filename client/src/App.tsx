import "./App.css";
import { useState } from "react";

import Navigation from "./component/Navigation";
import Search from "./component/Search";
import LoadingBar from "./component/LoadingBar";

import { useRepos } from "./hooks/useRepos";
import { useCommits } from "./hooks/useCommits";

import RepoList from "./component/RepoList";
import CommitList from "./component/CommitList";
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

  // Generate blog for a specific repo
  const handleGenerateBlog = async (username: string, repo: string) => {
    setView("blog");
    setBlogContent("Generating blog..."); // show loading in UI

    try {
      const res = await fetch("http://localhost:3000/api/generate-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, repo }),
      });
      const data = await res.json();

      if (data.blog) {
        setBlogContent(data.blog);
      } else {
        setBlogContent("Failed to generate blog.");
      }
    } catch (err) {
      console.error(err);
      setBlogContent("Error generating blog.");
    }
  };

  return (
    <>
      <Navigation />
      <Search username={username} repoName={repoName} onSearch={handleSearch} />

      {loading ? (
        <LoadingBar loading />
      ) : view === "repos" ? (
        <RepoList
          repos={repos}
          username={username}
          onClick={handleSearch}
          onGenerate={handleGenerateBlog}
        />
      ) : view === "commits" ? (
        <CommitList
          username={username}
          repoName={repoName}
          commits={commits}
        />
      ) : view === "blog" ? (
        <BlogPage content={blogContent} repoName={repoName} />
      ) : null}
    </>
  );
}
