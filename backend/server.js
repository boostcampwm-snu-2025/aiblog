import express from "express";
import cors from "cors";
import "dotenv/config";
import githubRouter from "./features/github/github.router.js";
import llmRouter from "./features/llm/llm.router.js";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRouter);
app.use("/api/llm", llmRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});