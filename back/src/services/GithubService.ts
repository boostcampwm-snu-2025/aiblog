import { Octokit } from "octokit";
import type { CommitFile, CommitItem } from "@/types/index.ts";
import { type Endpoints } from "@octokit/types";
import { getCommitDate } from "@/utils/github.ts";

type CommitDetailResponse =
  Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"]["data"];
type FileItem = Exclude<CommitDetailResponse["files"], undefined>[number];
type RepoItem = Endpoints["GET /user/repos"]["response"]["data"][number];

export interface CommitListItem {
  hash: string;
  date: string; // ISO date-time
  message: string;
}

export interface CommitStats {
  total: number;
  additions: number;
  deletions: number;
}

export interface CommitDetails {
  hash: string;
  message: string;
  date: string; // ISO date-time
  stats: CommitStats;
  files: CommitFile[];
}
const convertStatus = (status: FileItem["status"]): CommitFile["status"] => {
  const statusMap: Record<FileItem["status"], CommitFile["status"]> = {
    modified: "modified",
    added: "added",
    removed: "deleted",
    renamed: "renamed",
    copied: "modified",
    changed: "modified",
    unchanged: "modified",
  } as const;
  return statusMap[status];
};

export class GithubService {
  private octokit: Octokit;

  constructor(token?: string) {
    const auth = token ?? process.env.GITHUB_PAT;
    if (!auth) {
      throw new Error("GITHUB_PAT is not set in environment");
    }
    this.octokit = new Octokit({ auth });
  }

  public listRepos = async (): Promise<string[]> => {
    const repos = await this.octokit.paginate("GET /user/repos", {
      per_page: 100,
      affiliation: "owner,collaborator,organization_member",
      sort: "pushed",
      direction: "desc",
    });

    return repos
      .map((r: RepoItem) => r.full_name)
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  };

  public listCommits = async (
    repoOrg: string,
    repoName: string,
  ): Promise<CommitListItem[]> => {
    const commits = await this.octokit.paginate(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: repoOrg,
        repo: repoName,
        per_page: 100,
      },
    );

    return commits.map((c: CommitItem) => {
      const date = getCommitDate(c);
      const message: string = c.commit.message || "";
      return {
        hash: c.sha,
        date,
        message,
      };
    });
  };

  public getCommitDetails = async (
    repoOrg: string,
    repoName: string,
    commitHash: string,
  ): Promise<CommitDetails> => {
    const { data } = await this.octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner: repoOrg,
        repo: repoName,
        ref: commitHash,
      },
    );

    const stats: CommitStats = {
      total: data.stats?.total ?? 0,
      additions: data.stats?.additions ?? 0,
      deletions: data.stats?.deletions ?? 0,
    };

    const files: CommitFile[] = (data.files ?? []).map((f: FileItem) => {
      let status: CommitFile["status"] = convertStatus(f.status);
      return {
        filename: f.filename,
        status,
        additions: f.additions,
        deletions: f.deletions,
        changes: f.changes,
        patch: f.patch ?? "",
      };
    });

    const date = getCommitDate(data);

    return {
      hash: data.sha,
      message: data.commit.message,
      date,
      stats,
      files,
    };
  };
}
