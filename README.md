# AIblog - AI-Powered GitHub Activity Blog Generator

Transform GitHub commits into blog posts using AI-powered summaries.

## Demo

<video src="https://github.com/user-attachments/assets/fe420cf9-9c89-4872-a2ee-dadfffd6ea50" controls width="600"></video>

## Project Structure

```
AIblog/
├── client/                    # React Frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── context/           # Global state (BlogContext)
│   │   ├── hooks/             # Custom React hooks
│   │   └── types/             # TypeScript types
│   └── package.json
├── server/                    # Express Backend
│   ├── src/
│   │   ├── controllers/       # Request handlers
│   │   ├── routes/            # API routes
│   │   ├── services/          # Business logic (GitHub, Gemini AI)
│   │   └── types/             # TypeScript types
│   ├── .env.example
│   └── package.json
└── package.json               # Root workspace
```

## Setup

### Prerequisites
- Node.js >= 18.0.0
- GitHub Personal Access Token
- Google Gemini API Key

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd AIblog
npm install
```

2. Configure environment variables
```bash
cd server
cp .env.example .env
# Edit .env with your API keys:
# - GITHUB_TOKEN
# - GEMINI_API_KEY
```

3. Run development servers
```bash
# From root directory
npm run dev
```

- Client: http://localhost:5173
- Server: http://localhost:3000

## Features

### GitHub Integration
- Fetch recent commits from any public repository
- View commit details (author, date, message)
- Generate AI summaries from commit data

### AI-Powered Summaries
- Generate blog posts from commits using Google Gemini AI
- Edit generated content before saving
- Preview markdown rendering

### Blog Management
- Save posts to localStorage
- View saved posts in blog-style layout
- Pagination (5 posts per page)
- Delete posts with confirmation

## Architecture

### Frontend
- **React 19** with TypeScript
- **Context API + useReducer** for global state
- **Custom hooks** for async operations
- **localStorage sync** for persistence
- **Async state pattern** (idle/loading/success/error)

### Backend
- **Express.js** REST API
- **GitHub GraphQL API** for commit data
- **Google Gemini AI** for content generation
- **TypeScript** for type safety

## API Endpoints

### GitHub
- `GET /api/github/repos/:owner/:repo/commits` - Fetch commits

### LLM
- `POST /api/llm/generate/commit` - Generate blog post from commit
- `POST /api/llm/chat` - Chat with Gemini AI

## Tech Stack

**Frontend:** React, TypeScript, TailwindCSS, react-markdown
**Backend:** Express, TypeScript, @octokit/graphql, @google/generative-ai
**State Management:** Context API, useReducer
**Storage:** localStorage
