import type { Endpoints, OctokitResponse } from "@octokit/types";
import { octokit } from "../config/clients.js";

type Commit = Endpoints["GET /repos/{owner}/{repo}/commits/{ref}"]["response"];

export async function getCommit(
	owner: string,
	repo: string,
	ref: string,
): Promise<OctokitResponse<Commit["data"]>> {
	return octokit.rest.repos.getCommit({ owner, repo, ref });
}

export async function listBranches(owner: string, repo: string) {
	return octokit.rest.repos.listBranches({ owner, repo });
}

export async function listCommits(owner: string, repo: string, sha: string) {
	return octokit.rest.repos.listCommits({ owner, repo, sha });
}

export async function getRepository(owner: string, repo: string) {
	return octokit.rest.repos.get({ owner, repo });
}

export async function listPullRequests(owner: string, repo: string) {
	return octokit.rest.pulls.list({ owner, repo });
}

export async function listPullRequestCommits(
	owner: string,
	repo: string,
	pull_number: number,
) {
	return octokit.rest.pulls.listCommits({ owner, repo, pull_number });
}

export async function listOrgRepos(
	org: string,
	page?: number,
	per_page?: number,
) {
	return octokit.rest.repos.listForOrg({ org, page, per_page });
}

export async function listUserRepos(
	username: string,
	page?: number,
	per_page?: number,
) {
	return octokit.rest.repos.listForUser({ username, page, per_page });
}

export async function searchRepositories(
	q: string,
	page?: number,
	per_page?: number,
) {
	return octokit.rest.search.repos({ q, page, per_page });
}
