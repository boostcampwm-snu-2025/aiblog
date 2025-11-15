import z from "zod";

export const repoSchema = z.object({
	owner: z.string(),
	repo: z.string(),
});

export const branchSchema = repoSchema.extend({
	branch: z.string(),
});

export const pullRequestSchema = repoSchema.extend({
	pull_number: z.coerce.number().min(1),
});

export const commitSchema = repoSchema.extend({
	ref: z.string(),
});
