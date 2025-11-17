export const runtime = "nodejs";

import { NextResponse } from "next/server";
import YAML from "yaml";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

type SummarizeRequest =
    | { type: "commit"; repo: string; sha: string }
    | { type: "pr"; repo: string; number: number };

const GITHUB_API_BASE = "https://api.github.com";

// -----------------------------
// GitHub helper
// -----------------------------
async function fetchFromGitHub<T>(url: string, token?: string): Promise<T> {
    const headers: Record<string, string> = {
        Accept: "application/vnd.github+json",
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(url, { headers });
    const body = await res.json();

    if (!res.ok) {
        throw new Error(body.message || `GitHub HTTP ${res.status}`);
    }

    return body as T;
}

// -----------------------------
// Utility: Safe patch truncation
// -----------------------------
function cleanPatch(patch?: string): string {
    if (!patch) return "(no patch provided)";
    if (patch.length > 4000) {
        return (
            patch.slice(0, 4000) +
            "\n\n... (diff truncated for length; file extremely large)\n"
        );
    }
    return patch;
}

// =============================
//        ROUTE HANDLER
// =============================
export async function POST(req: Request) {
    console.log("🔵 [API] /api/summarize called");

    try {
        const body = (await req.json()) as SummarizeRequest;
        console.log("🟢 [API] Request body:", body);

        const { type, repo } = body;

        if (!type || !repo) {
            return NextResponse.json(
                { error: "Missing 'type' or 'repo' in request body" },
                { status: 400 }
            );
        }

        // Parse owner/name
        const [owner, name] = repo.split("/");
        if (!owner || !name) {
            return NextResponse.json(
                { error: "Repo must be in 'owner/name' format" },
                { status: 400 }
            );
        }

        // Load local.yaml secrets OR env vars
        let apiKey = process.env.OPENAI_API_KEY || "";
        let githubToken: string | undefined;

        try {
            const yamlPath = path.join(process.cwd(), "local.yaml");
            const file = fs.readFileSync(yamlPath, "utf8");
            const config = YAML.parse(file);

            if (config.OPENAI_API_KEY) apiKey = config.OPENAI_API_KEY;
            if (config.GITHUB_TOKEN) githubToken = config.GITHUB_TOKEN;
            console.log("🟢 [API] Using local.yaml config");
        } catch {
            console.log("🟡 [API] local.yaml not found, using env vars only");
        }

        if (!apiKey) {
            return NextResponse.json(
                { error: "OPENAI_API_KEY is not configured" },
                { status: 500 }
            );
        }

        const openai = new OpenAI({ apiKey });

        let prompt = "";

        // ==================================
        //          COMMIT MODE
        // ==================================
        if (type === "commit") {
            const { sha } = body;

            console.log(`🔵 [API] Fetching commit: ${owner}/${name}@${sha}`);

            const commitUrl = `${GITHUB_API_BASE}/repos/${owner}/${name}/commits/${sha}`;
            const commitData = await fetchFromGitHub<any>(
                commitUrl,
                githubToken
            );

            const commitMessage = commitData.commit?.message ?? "";
            const authorName =
                commitData.commit?.author?.name ??
                commitData.author?.login ??
                "unknown";
            const htmlUrl = commitData.html_url;

            const files = commitData.files ?? [];

            // Build real diff summary
            const filesSummary = files
                .slice(0, 30) // limit number of files
                .map((f: any) => {
                    const patch = cleanPatch(f.patch);

                    return `### ${f.filename}
Additions: ${f.additions}  |  Deletions: ${f.deletions}

\`\`\`diff
${patch}
\`\`\`
`;
                })
                .join("\n");

            prompt = `
You are an expert technical writer.

Write a detailed but factual Markdown blog post based **only** on the information below.
Do NOT invent features or code that is not present.

---

## Repository
${owner}/${name}

## Commit
SHA: ${sha}
Author: ${authorName}
URL: ${htmlUrl}

## Commit Message
${commitMessage}

## Files Modified (with real diffs)
${filesSummary}

---

Write a clean, structured post that includes:
- the problem this commit solves
- what was changed (based on actual diff)
- why those changes matter
- any architectural or logical improvements
- readable explanations for other developers
`;
        }

        // ==================================
        //        PULL REQUEST MODE
        // ==================================
        else if (type === "pr") {
            const { number } = body;

            const prUrl = `${GITHUB_API_BASE}/repos/${owner}/${name}/pulls/${number}`;
            const prFilesUrl = `${GITHUB_API_BASE}/repos/${owner}/${name}/pulls/${number}/files?per_page=300`;

            console.log(`🔵 [API] Fetching PR: ${owner}/${name}#${number}`);

            const [prData, prFiles] = await Promise.all([
                fetchFromGitHub<any>(prUrl, githubToken),
                fetchFromGitHub<any[]>(prFilesUrl, githubToken),
            ]);

            const title = prData.title || "";
            const bodyText = prData.body || "";
            const state = prData.state;
            const mergedAt = prData.merged_at;
            const author = prData.user?.login ?? "unknown";
            const htmlUrl = prData.html_url;

            const filesSummary = prFiles
                .slice(0, 50)
                .map((f) => {
                    const patch = cleanPatch(f.patch);

                    return `### ${f.filename}
Additions: ${f.additions}  |  Deletions: ${f.deletions}

\`\`\`diff
${patch}
\`\`\`
`;
                })
                .join("\n");

            prompt = `
You are a senior technical writer summarizing a GitHub pull request.

Use ONLY the data below.  
Do NOT hallucinate or guess functionality not present in the diff.

---

## Repository
${owner}/${name}

## Pull Request #${number}
Title: ${title}
Author: ${author}
State: ${state}
${mergedAt ? `Merged At: ${mergedAt}` : ""}
URL: ${htmlUrl}

## PR Description
${bodyText}

## Modified Files (with real diffs)
${filesSummary}

---

Write a Markdown blog post that explains:
- the purpose of this PR
- the exact changes made (based on real diffs)
- important refactoring or architectural changes
- impact on UX, backend, or logic
- insights useful to other developers
`;
        }

        console.log("🟡 [API] Prompt ready — sending to OpenAI");

        const completion = await openai.chat.completions.create({
            model: "gpt-4.1-mini",
            messages: [{ role: "user", content: prompt }],
        });

        const content = completion.choices[0].message.content;

        console.log("🟢 [API] Blog generated successfully");

        return NextResponse.json({ blog: content });
    } catch (err: any) {
        console.error("🔴 [API] Error:", err);
        return NextResponse.json(
            { error: err.message || "Unknown server error" },
            { status: 500 }
        );
    }
}
