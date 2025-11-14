import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import githubRouter from './routes/github.js';
import llmRouter from './routes/llm.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use('/api/github', githubRouter); 
app.use('/api/llm', llmRouter); 
app.listen(PORT, () => {
  console.log(`✅ Express server is running on http://localhost:${PORT}.`);
});