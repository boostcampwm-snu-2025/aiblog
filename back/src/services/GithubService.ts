import { Octokit } from "octokit";

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

export interface CommitFile {
  filename: string;
  status: "added" | "modified" | "deleted" | "renamed";
  additions: number;
  deletions: number;
  changes: number;
  patch: string;
}

export interface CommitDetails {
  hash: string;
  message: string;
  date: string; // ISO date-time
  stats: CommitStats;
  files: CommitFile[];
}

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
      .map((r: any) => r.full_name as string)
      .filter(Boolean)
      .sort((a: string, b: string) => a.localeCompare(b));
  };

  public listCommits = async (
    repoOrg: string,
    repoName: string
  ): Promise<CommitListItem[]> => {
    const commits = await this.octokit.paginate(
      "GET /repos/{owner}/{repo}/commits",
      {
        owner: repoOrg,
        repo: repoName,
        per_page: 100,
      }
    );

    return commits.map((c: any) => {
      const date: string =
        c.commit?.author?.date || c.commit?.committer?.date || new Date(0).toISOString();
      const message: string = c.commit?.message || "";
      return {
        hash: c.sha as string,
        date,
        message,
      };
    });
  };

  public getCommitDetails = async (
    repoOrg: string,
    repoName: string,
    commitHash: string
  ): Promise<CommitDetails> => {
    const { data } = await this.octokit.request(
      "GET /repos/{owner}/{repo}/commits/{ref}",
      {
        owner: repoOrg,
        repo: repoName,
        ref: commitHash,
      }
    );

    const stats: CommitStats = {
      total: data.stats?.total ?? 0,
      additions: data.stats?.additions ?? 0,
      deletions: data.stats?.deletions ?? 0,
    };

    const files: CommitFile[] = (data.files ?? []).map((f: any) => {
      let status: CommitFile["status"] = "modified";
      switch (f.status) {
        case "added":
          status = "added";
          break;
        case "modified":
          status = "modified";
          break;
        case "removed":
          status = "deleted";
          break;
        case "renamed":
          status = "renamed";
          break;
        default:
          status = "modified";
      }
      return {
        filename: f.filename as string,
        status,
        additions: f.additions ?? 0,
        deletions: f.deletions ?? 0,
        changes: f.changes ?? 0,
        patch: f.patch ?? "",
      };
    });

    const date: string =
      (data.commit as any)?.author?.date || (data.commit as any)?.committer?.date || new Date(0).toISOString();

    return {
      hash: data.sha as string,
      message: data.commit?.message ?? "",
      date,
      stats,
      files,
    };
  };
}
