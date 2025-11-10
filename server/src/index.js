require('dotenv').config();
const express = require('express');
const cors = require('cors');
const githubRouter = require('./routes/github');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GitHub Blog API server running');
});

// GitHub API 라우트 연결
app.use('/api/github', githubRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
