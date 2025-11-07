import path from "node:path";
import { fileURLToPath } from "node:url";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../../web/dist")));
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
	console.log(` Server on http://localhost:${PORT}`);
});
