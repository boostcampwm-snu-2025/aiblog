import type { Endpoints } from "@octokit/types";

interface Props {
  file: NonNullable<
    Endpoints["GET /repos/{owner}/{repo}/commits"]["response"]["data"][number]["files"]
  >[number];
}

function File({ file }: Props) {
  return (
    <div className="rounded-md border border-gray-200">
      <div className="border-b border-gray-200 bg-gray-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-medium">{file.filename}</span>
          <span className="text-xs text-gray-600">
            <span className="text-green-600">+{file.additions}</span>
            {" / "}
            <span className="text-red-600">-{file.deletions}</span>
          </span>
        </div>
      </div>
      <div className="overflow-x-auto p-4">
        <pre className="text-xs">
          <code>{file.patch}</code>
        </pre>
      </div>
    </div>
  );
}

export default File;
