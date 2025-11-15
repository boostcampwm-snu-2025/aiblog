import { useSuspenseQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { AlertCircle } from "lucide-react";

import { readCommit } from "~/api/github";
import { Alert, AlertDescription } from "~/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import File from "./-file";
import Summary from "./-summary";

interface Props {
  owner: string;
  ref: string;
  repo: string;
}

function Commit({ owner, ref, repo }: Props) {
  const { data, status } = useSuspenseQuery(readCommit(owner, repo, ref));

  return {
    error: (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertDescription>Failed to load commit details</AlertDescription>
      </Alert>
    ),
    success: (
      <div className="space-y-6">
        <div>
          <h1 className="mb-2 text-3xl font-bold">
            {data.commit.message.split("\n")[0]}
          </h1>
          <div className="text-gray-600">
            <span className="font-semibold">
              {data.commit.author?.name || "Unknown"}
            </span>
            {" committed "}
            {dayjs(data.commit.author?.date).format("MMM D, YYYY h:mm A")}
            {" · "}
            <span className="font-mono text-sm">
              {data.sha.substring(0, 7)}
            </span>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Commit Message</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-sm whitespace-pre-wrap">
              {data.commit.message}
            </pre>
          </CardContent>
        </Card>

        <Summary owner={owner} ref={ref} repo={repo} />

        <Card>
          <CardHeader>
            <CardTitle>File Changes</CardTitle>
            <CardDescription>
              {data.files?.length || 0} file(s) changed,{" "}
              <span className="text-green-600">
                +{data.stats?.additions || 0}
              </span>{" "}
              insertions,{" "}
              <span className="text-red-600">
                -{data.stats?.deletions || 0}
              </span>{" "}
              deletions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.files?.map((file) => (
                <File file={file} key={file.filename} />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    ),
  }[status];
}

export default Commit;
