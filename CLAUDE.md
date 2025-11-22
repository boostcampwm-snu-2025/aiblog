# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A GitHub repository explorer with AI-powered commit summaries. Users can search repositories, browse branches/PRs, view commits with diffs, and generate AI summaries of commit changes.

**Tech Stack:**
- **Server**: Express, Octokit (GitHub API), Google GenAI (Gemini), Zod, Biome
- **Web**: React 19, TanStack Router (file-based routing), TanStack Query, Vite, Tailwind CSS, shadcn/ui

**Package Manager**: pnpm 10.12.1 (required)

## Development Commands

### Server (/server)
```bash
cd server
pnpm dev              # Start development server with nodemon
pnpm build            # Build TypeScript to dist/
pnpm start            # Run production build
pnpm lint             # Lint with Biome
pnpm format           # Format with Biome
pnpm check            # Lint and format with Biome
```

### Web (/web)
```bash
cd web
pnpm dev              # Start Vite dev server
pnpm build            # Type check and build for production
pnpm generate-routes  # Regenerate TanStack Router routes (auto-runs on dev)
pnpm lint             # Lint with ESLint
pnpm format           # Format with Prettier
```

## Architecture

### Monorepo Structure

The project is split into two packages:
- `/server` - Express API server that proxies GitHub API calls and provides AI summaries
- `/web` - React SPA that consumes the server API

In production, the server serves the built web frontend from `web/dist` as static files.

### Server Architecture

**Entry point**: [server/src/app.ts](server/src/app.ts)
- Mounts two routers: `/api/github` and `/api/summaries`
- Serves static web frontend from `../../web/dist`
- CORS enabled for development
- Includes development delay middleware (3000ms) to simulate network latency

**Layered Architecture**:
The server follows a clean layered architecture pattern:
1. **Routes** ([server/src/routes/](server/src/routes/)) - Define API endpoints and wire up middleware
2. **Controllers** ([server/src/controllers/](server/src/controllers/)) - Handle requests, validate params with Zod, call services, format responses
3. **Services** ([server/src/services/](server/src/services/)) - Contain business logic, orchestrate operations across multiple services
4. **Repositories** ([server/src/repositories/](server/src/repositories/)) - Handle data persistence (file system operations)

**GitHub API Proxy**:
- Routes: [server/src/routes/github.routes.ts](server/src/routes/github.routes.ts)
- Controller: [server/src/controllers/github.controller.ts](server/src/controllers/github.controller.ts)
- Service: [server/src/services/github.service.ts](server/src/services/github.service.ts)
- Uses `asyncGithubHandler` wrapper ([server/src/middleware/async-handler.ts](server/src/middleware/async-handler.ts)) that:
  - Executes async GitHub API calls
  - Preserves GitHub API status codes in responses
  - Forwards rate limit headers from Octokit to client
  - Centralizes error handling
- Request parameters validated with Zod schemas in [server/src/schemas/github.schema.ts](server/src/schemas/github.schema.ts)
- Reusable schemas: `repoSchema`, `branchSchema`, `commitSchema`, `pullRequestSchema`, `pageSchema`

**Available GitHub endpoints**:
- `/api/github/repos/:owner/:repo` - Repository details
- `/api/github/repos/:owner/:repo/branches` - List branches
- `/api/github/repos/:owner/:repo/branches/:branch/commits` - Branch commits
- `/api/github/repos/:owner/:repo/commits/:ref` - Commit details
- `/api/github/repos/:owner/:repo/pulls` - Pull requests
- `/api/github/repos/:owner/:repo/pulls/:pull_number/commits` - PR commits
- `/api/github/search/repositories` - Search repositories
- `/api/github/users/:username/repos` - User repositories
- `/api/github/orgs/:org/repos` - Organization repositories

**AI Summary Feature**:
- Routes: [server/src/routes/summary.routes.ts](server/src/routes/summary.routes.ts)
- Controller: [server/src/controllers/summary.controller.ts](server/src/controllers/summary.controller.ts)
- Service: [server/src/services/summary.service.ts](server/src/services/summary.service.ts)
- Repository: [server/src/repositories/summary.repository.ts](server/src/repositories/summary.repository.ts)
- AI Service: [server/src/services/ai.service.ts](server/src/services/ai.service.ts)

**Summary endpoints**:
- `GET /api/summaries` - List all saved summaries with metadata
- `GET /api/summaries/:owner/:repo/commits/:ref` - Get a specific summary
- `POST /api/summaries/:owner/:repo/commits/:ref` - Generate and save new summary
- `DELETE /api/summaries/:owner/:repo/commits/:ref` - Delete a summary

**Summary workflow**:
1. Controller validates params and calls service
2. Service checks if summary exists (409 Conflict if it does)
3. Service fetches commit data from GitHub via `githubService`
4. Service calls `aiService.generateCommitSummary()` with commit message and file diffs
5. AI service constructs prompt and calls Gemini 2.5 Pro
6. Repository saves summary to file system (`data/:owner/:repo/:ref.txt`)

**Error Handling**:
- Layered: `ZodError` → 400, `RequestError` (Octokit) → preserves status, others → 500
- Error middleware ([server/src/middleware/error-handler.ts](server/src/middleware/error-handler.ts)) applied at end of each router
- Custom service errors: `SummaryExistsError` (409), `SummaryNotFoundError` (404)

### Web Architecture

**File-Based Routing** (TanStack Router):
- Routes auto-generated from `/web/src/routes/**` structure
- Files prefixed with `-` are components/layouts, not routes
- Path parameters use `$variableName` syntax (e.g., `$owner`, `$repo`)
- Generated file: [web/src/routeTree.gen.ts](web/src/routeTree.gen.ts) (don't edit manually)
- Re-run `pnpm generate-routes` if you add/remove route files

**Key Route Files**:
- [routes/\_\_root.tsx](web/src/routes/__root.tsx) - Root layout with QueryClient context
- [routes/index.tsx](web/src/routes/index.tsx) - Repository search page
- [routes/repos/$owner/$repo/index.tsx](web/src/routes/repos/$owner/$repo/index.tsx) - Repository detail
- [routes/repos/$owner/$repo/branches/$branch.tsx](web/src/routes/repos/$owner/$repo/branches/$branch.tsx) - Branch commits
- [routes/repos/$owner/$repo/commits/$ref/index.tsx](web/src/routes/repos/$owner/$repo/commits/$ref/index.tsx) - Commit detail with AI summary
- [routes/repos/$owner/$repo/pull-requests/index.tsx](web/src/routes/repos/$owner/$repo/pull-requests/index.tsx) - PR list
- [routes/repos/$owner/$repo/pull-requests/$prNumber/index.tsx](web/src/routes/repos/$owner/$repo/pull-requests/$prNumber/index.tsx) - PR detail
- [routes/summaries/index.tsx](web/src/routes/summaries/index.tsx) - List all saved summaries
- [routes/summaries/$owner/$repo/$ref/index.tsx](web/src/routes/summaries/$owner/$repo/$ref/index.tsx) - View saved summary

**API Integration** ([web/src/api/](web/src/api/)):
- [api/github.ts](web/src/api/github.ts) - Query options factory for GitHub endpoints
  - Each function returns TanStack Query `queryOptions` object
  - Type-safe with Octokit types
  - Uses native `fetch` with abort signal support
- [api/summaries.ts](web/src/api/summaries.ts) - Query and mutation options for AI summaries
  - `readCommitSummaries()` - List all summaries
  - `readCommitSummary()` - Get specific summary
  - `createCommitSummary()` - Generate new summary (POST)
  - `deleteCommitSummary()` - Delete summary (DELETE)
  - Mutations automatically invalidate relevant queries on success

**Data Fetching Pattern**:
1. Route loaders prefetch queries before navigation:
   ```tsx
   loader: ({ context: { queryClient }, params }) => {
     queryClient.prefetchQuery(readRepository(owner, repo))
   }
   ```
2. Components consume with `useSuspenseQuery`:
   ```tsx
   const { data } = useSuspenseQuery(readRepository(owner, repo))
   ```
3. Mutations for write operations:
   ```tsx
   const mutation = useMutation({
     mutationFn: () => summarizeCommit(owner, repo, ref)
   })
   ```

**Component Organization**:
- [components/ui/](web/src/components/ui/) - Radix UI wrappers with Tailwind styling
- [components/](web/src/components/) - Shared feature components (e.g., `commit.tsx`)
- [routes/](web/src/routes/) - Route-specific components prefixed with `-` (e.g., `-summary.tsx`)

**Utilities**:
- [lib/utils.ts](web/src/lib/utils.ts) - `cn()` helper for combining Tailwind classes

## Key Conventions

### Adding New API Endpoints

Follow the layered architecture pattern:

1. **Schema**: Define/reuse Zod validation schema in [server/src/schemas/](server/src/schemas/)
2. **Service**: Add business logic in [server/src/services/](server/src/services/)
3. **Controller**: Create controller function that validates params and calls service
4. **Route**: Wire up route in [server/src/routes/](server/src/routes/) with appropriate middleware
5. **Client**: Add query/mutation function in [web/src/api/](web/src/api/) returning `queryOptions` or `mutationOptions`
6. **Types**: Use Octokit types for GitHub responses, define custom types for other endpoints

### Adding New Routes

1. Create file in [web/src/routes/](web/src/routes/) following path structure
2. Export route using `createFileRoute()` or `createLazyFileRoute()`
3. Add loader to prefetch queries if needed
4. Run `pnpm generate-routes` to update [routeTree.gen.ts](web/src/routeTree.gen.ts)
5. Use `-prefixed` files for route-specific components

### Error Handling

- **Server**: Throw errors in route handlers; middleware catches and formats
- **Client**: Use TanStack Query's status-based rendering (`pending`, `error`, `success`)
- Display errors with [Alert](web/src/components/ui/alert.tsx) component

### Styling

- Use Tailwind utility classes
- Use `cn()` helper for conditional/merged classes
- shadcn/ui components in [components/ui/](web/src/components/ui/)

### Type Safety

- Both packages use TypeScript strict mode
- Server: Zod for runtime validation
- Client: Octokit types for GitHub API responses
- No type errors should exist on build

## Environment Variables

Required in [server/.env](server/.env):
```
GITHUB_TOKEN=your_github_token
GEMINI_API_KEY=your_gemini_key
PORT=3001  # optional, defaults to 3001
```

## Testing Changes

1. Start server: `cd server && pnpm dev`
2. Start web: `cd web && pnpm dev`
3. Open http://localhost:5173 (Vite dev server proxies API calls to server)
4. Test API endpoints directly at http://localhost:3001/api/...

## Common Patterns

### Prefetching Data in Route Loaders
```tsx
export const Route = createFileRoute("/path")({
  loader: ({ context: { queryClient }, params }) => {
    queryClient.prefetchQuery(readSomething(params.id))
  },
})
```

### Suspense Queries in Components
```tsx
const { data } = useSuspenseQuery(readSomething(id))
// No loading/error states needed - handled by Suspense boundary
```

### Mutations with Loading States
```tsx
const mutation = useMutation(createCommitSummary(queryClient))
<Button
  disabled={mutation.isPending}
  onClick={() => mutation.mutate({ owner, repo, ref })}
>
  {mutation.isPending && <LoaderCircle className="animate-spin" />}
  Generate Summary
</Button>
```

### File-Based Data Storage
Summaries are stored in the file system at `server/data/:owner/:repo/:ref.txt`. The repository layer abstracts file operations:
```tsx
// Save
await summaryRepository.save(owner, repo, ref, content)

// Read
const content = await summaryRepository.read(owner, repo, ref)

// Check existence
const exists = await summaryRepository.exists(owner, repo, ref)
```
