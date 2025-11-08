import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios"; // 1. axios 임포트

// .env 파일 로드
dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

// app.use(cors());
// 1. CORS 설정 (디버깅을 위해 모든 출처/메소드를 허용합니다)
app.use(
    cors({
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST", "OPTIONS"], // 허용할 HTTP 메소드 명시
        allowedHeaders: ["Content-Type", "Authorization"], // 허용할 헤더 명시
    })
);

// 2. JSON 파싱
// React에서 { owner, repo } 같은 body를 보낼 때 필요합니다.
app.use(express.json());

// === 테스트용 API 엔드포인트 (디버깅을 위해 남겨둡니다) ===
app.get("/api/test", (req: Request, res: Response) => {
    console.log("[/api/test] - React에서 요청이 왔습니다!");
    res.json({ message: "안녕하세요! Express 서버에서 보낸 응답입니다." });
});

// === 🚀 1주차 핵심: GitHub 프록시 엔드포인트 ===
// [Server] 이슈: client한테 받은 repository 주소를 받고 Github API로 데이터 요청
app.post("/api/github", async (req: Request, res: Response) => {
    // 3. React(client)가 보낸 owner와 repo 이름을 받습니다.
    const { owner, repo } = req.body;

    // React가 owner, repo를 안 보냈으면 에러 처리
    if (!owner || !repo) {
        return res
            .status(400)
            .json({ error: "owner와 repo 이름이 필요합니다." });
    }

    // 4. GitHub GraphQL API에 보낼 쿼리
    const graphqlQuery = {
        query: `
      query GetCommits($owner: String!, $repo: String!) {
        repository(owner: $owner, name: $repo) {
          defaultBranchRef {
            name
            target {
              ... on Commit {
                history(first: 10) {
                  edges {
                    node {
                      messageHeadline
                      committedDate
                      author {
                        name
                        email
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    `,
        variables: { owner, repo }, // 쿼리에 변수 전달
    };

    // 5. [Server] 이슈: 토큰 보관
    const token = process.env.GITHUB_TOKEN;
    const githubApiUrl = "https://api.github.com/graphql";

    console.log(`[Server] /api/github: ${owner}/${repo}의 데이터 요청 중...`);

    try {
        // 6. [Server] 이슈: Github API로 데이터 요청 (axios 사용)
        const response = await axios.post(
            githubApiUrl,
            graphqlQuery, // 객체 그대로 전달
            {
                headers: {
                    Authorization: `Bearer ${token}`, // [중요] .env의 토큰 사용
                    "Content-Type": "application/json",
                },
            }
        );

        // 7. [Server] 이슈: Github한테 받은 데이터를 client로 전달
        console.log(
            "[Server] /api/github: GitHub로부터 응답 받음. Client로 전달."
        );
        res.status(200).json(response.data);
    } catch (error) {
        // 8. 에러 처리
        if (axios.isAxiosError(error)) {
            console.error(
                "[Server] /api/github: Axios 에러:",
                error.response?.data || error.message
            );
        } else {
            console.error("[Server] /api/github: GitHub API 요청 실패:", error);
        }

        res.status(500).json({
            error: "GitHub API 요청 중 오류가 발생했습니다.",
        });
    }
});

app.listen(port, () => {
    console.log(
        `[Server] 🏃‍♂️ Express 서버가 http://localhost:${port} 에서 실행 중입니다.`
    );
});
