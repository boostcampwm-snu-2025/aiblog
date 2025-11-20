import express from "express";
import cors from "cors";
import githubRouter from "./routes/github.js";
import aiRouter from "./routes/post.js";
import { config } from "./config/env.js";

const app = express();
const PORT = config.server.port;
const CLIENT_URL = config.server.clientUrl;

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Routes
app.get("/api/health", (_, res) => {
  res.json({ status: "OK" });
});

app.use("/api/github", githubRouter);
app.use("/api/post", aiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
