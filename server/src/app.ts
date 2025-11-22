import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import env from "./env.js";
import geminiRouter from "./gemini/index.js";
import githubRouter from "./github/index.js";
import { delay } from "./utils.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));
if (env.NODE_ENV === "development") {
	app.use(cors({ origin: "*" }));
	app.use(async (_req, _res, next) => {
		await delay(3000);
		next();
	});
}
app.use(express.json());

app.use("/api/github", githubRouter);
app.use("/api/gemini", geminiRouter);

// SPA fallback: serve index.html for all non-API routes
app.use((_req, res) => {
	res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
});

app.listen(env.PORT, () => {
	console.log(` Server on http://localhost:${env.PORT}`);
});
