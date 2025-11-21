import { useSuspenseQueries } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";

import { readBranches, readPulls, readRepository } from "~/api/github";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface Props {
  owner: string;
  repo: string;
}

function RepositoryContent({ owner, repo }: Props) {
  const [{ data: repository }, { data: branches }, { data: pulls }] =
    useSuspenseQueries({
      queries: [
        readRepository(owner, repo),
        readBranches(owner, repo),
        readPulls(owner, repo),
      ],
    });

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Branches</CardTitle>
            <CardDescription>View commits by branch</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className="text-blue-600 hover:underline"
              params={{
                branch: repository.default_branch,
                owner,
                repo,
              }}
              to="/repos/$owner/$repo/branches/$branch"
            >
              View Branches ({branches.length})
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Pull Requests</CardTitle>
            <CardDescription>View commits by pull request</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className="text-blue-600 hover:underline"
              params={{ owner, repo }}
              to="/repos/$owner/$repo/pull-requests"
            >
              View Pull Requests ({pulls.length})
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default RepositoryContent;
