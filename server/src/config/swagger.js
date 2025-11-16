const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GitHub Blog API',
      version: '1.0.0',
      description: 'GitHub 활동 기반 AI 블로그 생성 API',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development server',
      },
    ],
    tags: [
      {
        name: 'GitHub',
        description: 'GitHub 활동 조회 API',
      },
      {
        name: 'Blog',
        description: 'AI 블로그 생성 API',
      },
    ],
  },
  apis: [
    './src/routes/blog.js',
    './src/routes/github.js'
  ], // 라우터 파일에서 주석 읽어오기
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
