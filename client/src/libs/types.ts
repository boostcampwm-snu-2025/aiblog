export interface CommitNode {
    node: {
        messageHeadline: string;
        committedDate: string;
        author: {
            name: string;
            email: string;
        };
        oid: string; // server의 map에서 고유 key 사용
    };
}

// api/github (GraphQL)의 응답 타입
export interface GitHubApiResponse {
    data: {
        repository: {
            defaultBranchRef: {
                target: {
                    history: {
                        edges: CommitNode[];
                    };
                };
            };
        } | null; // 레포지토리가 없을 경우 null이 올 수 있음
    };
    // GraphQL 에러가 발생할 경우
    errors?: { message: string }[];
}
