import express, { Application } from "express";
import cors from "cors";
import repoRoutes from "./routes/repo.routes";
import { errorHandler, notFoundHandler } from "./middleware/error.middleware";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/repos", repoRoutes);
app.use(notFoundHandler);

app.use(errorHandler);

export default app;
