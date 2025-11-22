import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import express from "express";
import env from "./config/env.js";
import { devDelayMiddleware } from "./middleware/dev-delay";
import githubRouter from "./routes/github.routes";
import summaryRouter from "./routes/summary.routes";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));

if (env.NODE_ENV === "development") {
	app.use(cors({ origin: "*" }));
	app.use(devDelayMiddleware(3000));
}
app.use(express.json());

app.use("/api/github", githubRouter);
app.use("/api/gemini", summaryRouter);

app.use((_req, res) => {
	res.sendFile(path.join(__dirname, "../../web/dist/index.html"));
});

app.listen(env.PORT, () => {
	console.log(` Server on http://localhost:${env.PORT}`);
});
