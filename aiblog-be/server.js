import { createServer } from "node:http";
import app from "./app.js";

const PORT = 3000;

createServer(app).listen(PORT, () => {
	console.log(`> API server listening on http://localhost:${PORT}`);
});
