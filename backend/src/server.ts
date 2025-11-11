import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRouter from "./routes/github.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.use("/api/github", githubRouter);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
