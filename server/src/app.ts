import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// app.use(express.static(path.join(__dirname, "../../web/dist")));
app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(` Server on http://localhost:${PORT}`);
});
