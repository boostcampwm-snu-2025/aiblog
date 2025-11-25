import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, Search } from "lucide-react";
import { Suspense } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Skeleton } from "~/components/ui/skeleton";

import { useSearchState } from "./-index.service";
import OrgReposResults from "./-org-repos-results";
import SearchReposResults from "./-search-repos-results";
import UserReposResults from "./-user-repos-results";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const {
    handleQueryChange,
    handleSubmit,
    handleTypeChange,
    searchQuery,
    searchType,
    submittedQuery,
    submittedType,
  } = useSearchState();

  const navigate = useNavigate();

  const handleSelectRepo = (owner: string, repo: string) => {
    void navigate({
      params: { owner, repo },
      to: "/repos/$owner/$repo",
    });
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-4xl font-bold">GitHub Repository Activity</h1>
            <Link
              className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
              to="/summaries"
            >
              <BookOpen className="h-4 w-4" />
              View AI Summaries
            </Link>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <RadioGroup onValueChange={handleTypeChange} value={searchType}>
              <div className="flex gap-6">
                <div className="flex items-center space-x-2">
                  <Label>
                    <RadioGroupItem value="repositories" />
                    Search Repositories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label>
                    <RadioGroupItem value="user" />
                    User Repositories
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Label>
                    <RadioGroupItem value="org" />
                    Organization Repositories
                  </Label>
                </div>
              </div>
            </RadioGroup>
            <div className="flex gap-2">
              <Input
                className="flex-1"
                name={searchType}
                onChange={(e) => handleQueryChange(e.target.value)}
                placeholder={
                  {
                    org: "Enter organization name (e.g., microsoft)",
                    repositories:
                      "Search repositories (e.g., react, typescript)",
                    user: "Enter username (e.g., facebook)",
                  }[searchType]
                }
                type="text"
                value={searchQuery}
              />
              <Button type="submit">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </div>
          </form>
        </div>
        {submittedType && submittedQuery && (
          <Suspense
            fallback={
              <div className="space-y-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    className="rounded-lg border p-4 hover:bg-accent/50"
                    key={i}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <div className="flex gap-4 pt-2">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            {submittedType === "repositories" && (
              <SearchReposResults
                onSelectRepo={handleSelectRepo}
                query={submittedQuery}
              />
            )}
            {submittedType === "user" && (
              <UserReposResults
                onSelectRepo={handleSelectRepo}
                username={submittedQuery}
              />
            )}
            {submittedType === "org" && (
              <OrgReposResults
                onSelectRepo={handleSelectRepo}
                org={submittedQuery}
              />
            )}
          </Suspense>
        )}
      </div>
    </div>
  );
}
