import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import z from "zod";

dotenv.config();

const env = z
	.object({
		PORT: z.string().default("3001"),
		GITHUB_TOKEN: z.string(),
	})
	.parse(process.env);

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));
app.use(cors());
app.use(express.json());

app.listen(env.PORT, () => {
	console.log(` Server on http://localhost:${env.PORT}`);
});
