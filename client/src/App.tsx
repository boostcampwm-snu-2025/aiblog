import { useState } from "react";
import axios from "axios";

// 1. GitHub에서 받은 커밋 데이터의 타입을 정의합니다. (TypeScript)
interface CommitNode {
    node: {
        messageHeadline: string;
        committedDate: string;
        author: {
            name: string;
            email: string;
        };
    };
}

function App() {
    // 2. Form 입력을 위한 state
    const [owner, setOwner] = useState<string>("Tapha-K"); // 기본값 (테스트용)
    const [repo, setRepo] = useState<string>("bye2money"); // 기본값 (테스트용)

    // 3. API 응답을 위한 state
    const [commits, setCommits] = useState<CommitNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 4. [Client] 이슈: 저장소 이름을 server로 보내는 API (Form 제출 시)
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault(); // Form의 기본 새로고침 동작을 막습니다.

        setLoading(true); // 로딩 시작
        setError(null);
        setCommits([]); // 이전 결과 지우기

        try {
            // 5. Express 서버의 /api/github 엔드포인트로 POST 요청
            const response = await axios.post(
                "http://localhost:8000/api/github",
                {
                    owner, // state에 저장된 owner
                    repo, // state에 저장된 repo
                }
            );

            // 6. [Client] 이슈: server에서 보낸 json을 fetch
            // (GraphQL 응답이 좀 복잡해서, 데이터만 추출합니다)
            const data =
                response.data?.data?.repository?.defaultBranchRef?.target
                    ?.history?.edges;

            if (data) {
                setCommits(data);
            } else {
                // GitHub가 에러를 보냈을 경우 (예: 레포지토리 없음)
                setError("레포지토리를 찾을 수 없거나 커밋이 없습니다.");
            }
        } catch (err) {
            // 7. Express 서버가 500 에러를 보내거나, 네트워크 에러 발생 시
            setError("서버 요청 중 오류가 발생했습니다.");
            console.error(err);
        } finally {
            // 8. 성공/실패 여부와 관계없이 로딩 종료
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>GitHub AI 블로거</h1>
            <p>GitHub 레포지토리의 최근 커밋 10개를 불러옵니다.</p>

            {/* 9. [Client] 이슈: 폼 UI 구현 */}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        GitHub Owner (소유자):
                        <input
                            type="text"
                            value={owner}
                            onChange={(e) => setOwner(e.target.value)}
                            required
                            style={{ marginLeft: "5px" }}
                        />
                    </label>
                </div>
                <div style={{ marginTop: "10px" }}>
                    <label>
                        Repository Name (이름):
                        <input
                            type="text"
                            value={repo}
                            onChange={(e) => setRepo(e.target.value)}
                            required
                            style={{ marginLeft: "5px" }}
                        />
                    </label>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    style={{ marginTop: "10px" }}
                >
                    {loading ? "불러오는 중..." : "커밋 가져오기"}
                </button>
            </form>

            {/* 10. [Client] 이슈: 로딩 및 에러 처리 UI */}
            {error && (
                <p style={{ color: "red", marginTop: "15px" }}>에러: {error}</p>
            )}

            {/* 11. [Client] 이슈: 간단한 리스트 형태로 렌더링 */}
            <div style={{ marginTop: "20px" }}>
                <h2>최근 커밋 리스트:</h2>
                <ul>
                    {commits.map((commit, index) => (
                        <li
                            key={index}
                            style={{
                                borderBottom: "1px solid #eee",
                                padding: "10px 0",
                            }}
                        >
                            <strong>{commit.node.messageHeadline}</strong>
                            <p
                                style={{
                                    margin: "5px 0 0",
                                    fontSize: "14px",
                                    color: "#555",
                                }}
                            >
                                By {commit.node.author.name} on{" "}
                                {new Date(
                                    commit.node.committedDate
                                ).toLocaleString()}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
