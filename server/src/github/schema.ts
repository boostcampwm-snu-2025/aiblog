import z from "zod";

export const repoSchema = z.object({
	owner: z.string(),
	repo: z.string(),
});

export const branchSchema = z.object({
	...repoSchema.shape,
	branch: z.string(),
});

export const pullRequestSchema = z.object({
	...repoSchema.shape,
	pull_number: z.coerce.number().min(1),
});

export const commitSchema = z.object({
	...repoSchema.shape,
	ref: z.string(),
});

export const querySchema = z.object({
	q: z.string().min(1),
});

export const pageSchema = z.object({
	page: z.coerce.number().optional(),
	per_page: z.coerce.number().optional(),
});
