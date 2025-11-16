require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const githubRouter = require('./routes/github');
const blogRouter = require('./routes/blog');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('GitHub Blog API server running');
});

// Swagger API 문서
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'GitHub Blog API Docs'
}));

// GitHub API 라우트 연결
app.use('/api/github', githubRouter);

// Blog API 라우트 연결
app.use('/api/blog', blogRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
