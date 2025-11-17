import express from "express";
import cors from "cors";

import testRoutes from "./routes/testRoutes.js";
import githubDataRoutes from "./routes/githubDataRoutes.js";
import aboutRoutes from "./routes/aboutRoutes.js";
import postRoutes from "./routes/postRoutes.js";

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

// routes
app.use("/test", testRoutes);
app.use("/github-data", githubDataRoutes);
app.use("/about", aboutRoutes);
app.use("/post", postRoutes);

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(err.status || 500).json({ error: err.message });
});

export default app;
