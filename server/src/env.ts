import dotenv from "dotenv";
import z from "zod";

dotenv.config();

const env = z
	.object({
		PORT: z.coerce.number().default(3001),
		GITHUB_TOKEN: z.string(),
		GEMINI_API_KEY: z.string(),
	})
	.parse(process.env);

export default env;
