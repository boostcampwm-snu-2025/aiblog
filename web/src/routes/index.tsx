import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { type FormEvent, Suspense, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import OrgReposResults from "./-org-repos-results";
import SearchReposResults from "./-search-repos-results";
import UserReposResults from "./-user-repos-results";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

type SearchType = "org" | "repositories" | "user";

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<SearchType>("repositories");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [submittedType, setSubmittedType] = useState<null | SearchType>(null);
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const trimmedQuery = searchQuery.trim();
    if (trimmedQuery) {
      setSubmittedQuery(trimmedQuery);
      setSubmittedType(searchType);
    }
  };

  const handleSelectRepo = (owner: string, repo: string) => {
    navigate({
      params: { owner, repo },
      to: "/repos/$owner/$repo",
    }).catch(console.error);
  };

  return (
    <div className="p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="mb-4 text-4xl font-bold">
            GitHub Repository Activity
          </h1>
          <form className="space-y-4" onSubmit={handleSearch}>
            <RadioGroup
              onValueChange={(value) => setSearchType(value as SearchType)}
              value={searchType}
            >
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
                onChange={(e) => setSearchQuery(e.target.value)}
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
          <Suspense>
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
