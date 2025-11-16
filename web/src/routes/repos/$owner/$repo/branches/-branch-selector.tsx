import { useSuspenseQuery } from "@tanstack/react-query";
import { useEffect } from "react";

import { readBranches } from "~/api/github";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface Props {
  branch: string;
  onBranchChange: (branch: string) => void;
  owner: string;
  repo: string;
}

function BranchSelector({ branch, onBranchChange, owner, repo }: Props) {
  const { data: branches } = useSuspenseQuery(readBranches(owner, repo));

  useEffect(() => {
    if (branches.length === 0) {
      console.error(`No branches found in repository "${owner}/${repo}".`);
    } else if (!branches.map((b) => b.name).includes(branch)) {
      console.warn(
        `Branch "${branch}" not found in repository "${owner}/${repo}". Defaulting to "${branches[0].name}".`,
      );
      onBranchChange(branches[0].name);
    }
  }, [branch, branches, owner, repo, onBranchChange]);

  return (
    <div className="mb-6 space-y-2">
      <label className="text-sm font-medium">Select Branch</label>
      <Select name="branch" onValueChange={onBranchChange} value={branch}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {branches.map((b) => (
            <SelectItem key={b.name} value={b.name}>
              {b.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default BranchSelector;
