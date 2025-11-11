import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import githubRouter from "./routes/github.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/github", githubRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});