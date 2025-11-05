import express from "express";
import cors from "cors";

import { version } from "./data.js";
import { delay } from "./utils.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/test/version", async (req, res) => {
	await delay(1000);
	res.json({ version: version });
});

app.listen(PORT, () => {
	console.log(`> API server listening on http://localhost:${PORT}`);
});
