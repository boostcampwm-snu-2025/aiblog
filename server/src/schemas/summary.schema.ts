import z from "zod";

export const summarySchema = z.object({
	owner: z.string(),
	repo: z.string(),
	ref: z.string(),
});
