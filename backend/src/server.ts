import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRouter from "./routes/github.js";
import aiRouter from "./routes/ai.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || "";

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/github", githubRouter);
app.use("/api/ai", aiRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
