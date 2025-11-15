import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useState } from "react";

import { readBranches, readPulls } from "~/api/github";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const [ownerInput, repoInput] = searchQuery.split("/").map((s) => s.trim());
    if (ownerInput && repoInput) {
      setOwner(ownerInput);
      setRepo(repoInput);
    }
  };

  // Verify repository exists by fetching branches
  const { data: branches, status: branchesStatus } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readBranches(owner, repo),
    queryKey: ["branches", owner, repo],
  });

  // Fetch pull requests
  const { data: pulls, status: pullsStatus } = useQuery({
    enabled: !!owner && !!repo,
    queryFn: () => readPulls(owner, repo),
    queryKey: ["pulls", owner, repo],
  });

  const isLoading = branchesStatus === "pending" || pullsStatus === "pending";
  const isSuccess = branchesStatus === "success" && pullsStatus === "success";
  const isError = branchesStatus === "error" || pullsStatus === "error";

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">
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
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </form>
        </div>

        {isLoading && (
          <div className="text-center text-gray-600">Loading repository...</div>
        )}

        {isError && (
          <div className="text-center text-red-600">
            Failed to load repository. Please check the repository name.
          </div>
        )}

        {isSuccess && (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">
              {owner}/{repo}
            </h2>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Branches</CardTitle>
                  <CardDescription>View commits by branch</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    className="text-blue-600 hover:underline"
                    params={{ owner, repo }}
                    to="/$owner/$repo/branches"
                  >
                    View Branches ({branches?.length || 0})
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Pull Requests</CardTitle>
                  <CardDescription>
                    View commits by pull request
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link
                    className="text-blue-600 hover:underline"
                    params={{ owner, repo }}
                    to="/$owner/$repo/pull-requests"
                  >
                    View Pull Requests ({pulls?.length || 0})
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
