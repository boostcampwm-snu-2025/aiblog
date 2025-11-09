import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { GitCommit, GitPullRequest, Search } from "lucide-react";
import { useState } from "react";

import { readCommits, readPulls } from "~/api/github";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";

dayjs.extend(relativeTime);

function App() {
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [ownerInput, repoInput] = searchQuery.split("/").map(s => s.trim());
    if (ownerInput && repoInput) {
      setOwner(ownerInput);
      setRepo(repoInput);
    }
  };

  const { data: commits, isLoading: isLoadingCommits } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readCommits(owner, repo),
    queryKey: ["commits", owner, repo],
  });

  const { data: pulls, isLoading: isLoadingPulls } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">GitHub Repository Activity</h1>
          <form className="flex gap-2" onSubmit={handleSearch}>
            <Input
              className="flex-1"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="owner/repository (e.g., facebook/react)"
              type="text"
              value={searchQuery}
            />
            <Button type="submit">
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </form>
        </div>

        {owner && repo && (
          <div className="mb-4">
            <h2 className="text-2xl font-semibold">
              {owner}/{repo}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Commits */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCommit className="w-5 h-5" />
                Recent Commits
              </CardTitle>
              <CardDescription>Latest commits to the repository</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingCommits ? (
                <div className="text-sm text-gray-500">Loading commits...</div>
              ) : commits && commits.length > 0 ? (
                <div className="space-y-4">
                  {commits.slice(0, 10).map((commit) => (
                    <div className="border-l-2 border-blue-500 pl-4 py-2" key={commit.sha}>
                      <div className="font-medium text-sm mb-1">
                        {commit.commit.message.split("\n")[0]}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">
                          {commit.commit.author?.name || "Unknown"}
                        </span>
                        {" · "}
                        {dayjs(commit.commit.author?.date).fromNow()}
                      </div>
                      <div className="text-xs text-gray-500 font-mono mt-1">
                        {commit.sha.substring(0, 7)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : owner && repo ? (
                <div className="text-sm text-gray-500">No commits found</div>
              ) : (
                <div className="text-sm text-gray-500">Enter a repository to view commits</div>
              )}
            </CardContent>
          </Card>

          {/* Recent Pull Requests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="w-5 h-5" />
                Pull Requests
              </CardTitle>
              <CardDescription>Open pull requests</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoadingPulls ? (
                <div className="text-sm text-gray-500">Loading pull requests...</div>
              ) : pulls && pulls.length > 0 ? (
                <div className="space-y-4">
                  {pulls.slice(0, 10).map((pr) => (
                    <div className="border-l-2 border-green-500 pl-4 py-2" key={pr.id}>
                      <div className="font-medium text-sm mb-1">
                        #{pr.number} {pr.title}
                      </div>
                      <div className="text-xs text-gray-600">
                        <span className="font-semibold">{pr.user?.login || "Unknown"}</span>
                        {" · "}
                        {dayjs(pr.created_at).fromNow()}
                      </div>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                          {pr.state}
                        </span>
                        {pr.draft && (
                          <span className="text-xs px-2 py-1 bg-gray-100 text-gray-800 rounded">
                            draft
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : owner && repo ? (
                <div className="text-sm text-gray-500">No pull requests found</div>
              ) : (
                <div className="text-sm text-gray-500">
                  Enter a repository to view pull requests
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;
