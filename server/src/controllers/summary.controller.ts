import type { Request, Response } from "express";
import { summarySchema } from "../schemas/summary.schema";
import * as summaryService from "../services/summary.service";

export async function listSummaries(_req: Request, res: Response) {
	const summaries = await summaryService.listAll();
	res.status(200).json(summaries);
}

export async function getSummary(req: Request, res: Response) {
	const params = summarySchema.parse(req.params);
	const summary = await summaryService.get(
		params.owner,
		params.repo,
		params.ref,
	);
	res.status(200).send(summary);
}

export async function createSummary(req: Request, res: Response) {
	const params = summarySchema.parse(req.params);

	try {
		const summary = await summaryService.generateAndSave(
			params.owner,
			params.repo,
			params.ref,
		);
		res.status(201).send(summary);
	} catch (error) {
		if (error instanceof summaryService.SummaryExistsError) {
			res.status(409).json({ message: error.message });
			return;
		}
		throw error;
	}
}

export async function deleteSummary(req: Request, res: Response) {
	const params = summarySchema.parse(req.params);

	try {
		await summaryService.remove(params.owner, params.repo, params.ref);
		res.status(204).send();
	} catch (error) {
		if (error instanceof summaryService.SummaryNotFoundError) {
			res.status(404).json({ message: error.message });
			return;
		}
		throw error;
	}
}
