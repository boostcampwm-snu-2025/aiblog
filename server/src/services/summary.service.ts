import * as summaryRepository from "../repositories/summary.repository.js";
import * as aiService from "./ai.service.js";
import * as githubService from "./github.service.js";

export class SummaryExistsError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SummaryExistsError";
	}
}

export class SummaryNotFoundError extends Error {
	constructor(message: string) {
		super(message);
		this.name = "SummaryNotFoundError";
	}
}

export async function generateAndSave(
	owner: string,
	repo: string,
	ref: string,
): Promise<string> {
	const exists = await summaryRepository.exists(owner, repo, ref);
	if (exists) {
		throw new SummaryExistsError("Summary already exists");
	}

	const commitResponse = await githubService.getCommit(owner, repo, ref);
	const commitMessage = commitResponse.data.commit.message;

	const summary = await aiService.generateCommitSummary(
		commitMessage,
		commitResponse.data.files ?? [],
	);

	await summaryRepository.save(owner, repo, ref, summary);

	return summary;
}

export async function get(
	owner: string,
	repo: string,
	ref: string,
): Promise<string> {
	return summaryRepository.read(owner, repo, ref);
}

export async function remove(
	owner: string,
	repo: string,
	ref: string,
): Promise<void> {
	const deleted = await summaryRepository.remove(owner, repo, ref);
	if (!deleted) {
		throw new SummaryNotFoundError("Summary not found");
	}
}

export async function listAll() {
	return summaryRepository.listAll();
}
