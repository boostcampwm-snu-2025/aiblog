# API Endpoints Guide

## Available Endpoints

### GitHub API (GraphQL)

#### Get Commits
```bash
GET /api/github/repos/:owner/:repo/commits?limit=10
```

**Example:**
```bash
curl "http://localhost:3000/api/github/repos/facebook/react/commits?limit=5"
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "sha": "abc123...",
      "commit": {
        "message": "Add new feature",
        "author": {
          "name": "John Doe",
          "email": "john@example.com",
          "date": "2024-01-15T10:00:00Z"
        }
      },
      "html_url": "https://github.com/facebook/react/commit/abc123"
    }
  ],
  "message": "Fetched 5 commits from facebook/react"
}
```

#### Get Pull Requests
```bash
GET /api/github/repos/:owner/:repo/pulls?limit=10
```

**Example:**
```bash
curl "http://localhost:3000/api/github/repos/microsoft/vscode/pulls?limit=5"
```

---

## Test Repositories

Here are some good repos to test with:

```bash
# Popular repos
facebook/react
microsoft/vscode
nodejs/node
vercel/next.js
vuejs/vue
travelerjin99/*  # Your repos!

# Examples:
curl "http://localhost:3000/api/github/repos/travelerjin99/your-repo/commits?limit=5"
curl "http://localhost:3000/api/github/repos/vercel/next.js/pulls?limit=3"
```

---

## Rate Limits

### Without Token:
- 60 requests per hour
- Shared across all unauthenticated requests

### With Token:
- 5,000 requests per hour
- Per token

**Check your rate limit:**
```bash
curl -H "Authorization: token YOUR_TOKEN" https://api.github.com/rate_limit
```
