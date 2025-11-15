import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { type FormEvent, useState } from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

export const Route = createFileRoute("/")({
  component: IndexPage,
});

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    const [ownerInput, repoInput] = searchQuery.split("/").map((s) => s.trim());
    if (ownerInput && repoInput) {
      navigate({
        params: { owner: ownerInput, repo: repoInput },
        to: "/repos/$owner/$repo",
      }).catch(console.error);
    }
  };

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
              name="repository"
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
      </div>
    </div>
  );
}
