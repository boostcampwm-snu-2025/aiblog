import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import env from "./env.js";
import geminiRouter from "./gemini/index.js";
import githubRouter from "./github/index.js";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRouter);
app.use("/api/gemini", geminiRouter);

app.listen(env.PORT, () => {
	console.log(` Server on http://localhost:${env.PORT}`);
});
