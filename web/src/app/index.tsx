import { GitCommit, GitPullRequest, Search } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Skeleton } from "~/components/ui/skeleton";

import CommitCard from "./commit-card";
import PrCard from "./pr-card";
import { useGithubRepository } from "./service";

function App() {
  const {
    commits,
    commitsStatus,
    handleSearch,
    owner,
    pulls,
    pullsStatus,
    repo,
    searchQuery,
    setSearchQuery,
  } = useGithubRepository();

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            GitHub Repository Activity
          </h1>
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

        {searchQuery && commitsStatus !== "idle" && (
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
              <CardDescription>
                Latest commits to the repository
              </CardDescription>
            </CardHeader>
            <CardContent>
              {commitsStatus === "pending" && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="border-l-2 border-blue-200 pl-4 py-2"
                      key={i}
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-1" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  ))}
                </div>
              )}
              {commitsStatus === "success" && (
                <div className="space-y-4">
                  {commits?.slice(0, 10).map((commit) => (
                    <CommitCard commit={commit} key={commit.sha} />
                  ))}
                </div>
              )}
              {commitsStatus === "empty" && (
                <div className="text-sm text-gray-500">No commits found</div>
              )}
              {commitsStatus === "error" && (
                <div className="text-sm text-red-600">
                  <p className="font-semibold mb-1">Failed to load commits</p>
                </div>
              )}
              {commitsStatus === "idle" && (
                <div className="text-sm text-gray-500">
                  Enter a repository to view commits
                </div>
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
              {pullsStatus === "pending" && (
                <div className="space-y-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      className="border-l-2 border-green-200 pl-4 py-2"
                      key={i}
                    >
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-3 w-1/2 mb-2" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {pullsStatus === "success" && (
                <div className="space-y-4">
                  {pulls?.slice(0, 10).map((pr) => (
                    <PrCard key={pr.id} pr={pr} />
                  ))}
                </div>
              )}
              {pullsStatus === "empty" && (
                <div className="text-sm text-gray-500">
                  No pull requests found
                </div>
              )}
              {pullsStatus === "error" && (
                <div className="text-sm text-red-600">
                  <p className="font-semibold mb-1">Failed to load pull requests</p>
                </div>
              )}
              {pullsStatus === "idle" && (
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
