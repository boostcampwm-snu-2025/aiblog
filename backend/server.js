import express from 'express';
import cors from 'cors';
import githubRouter from './routes/repos.js';
import llmRouter from './routes/llm.js';
import blogsRouter from './routes/blogs.js';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/github', githubRouter);
app.use('/llm', llmRouter);
app.use('/blogs', blogsRouter);

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
