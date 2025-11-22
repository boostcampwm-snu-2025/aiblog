import { useState } from "react";
import axios from "axios";

import RepoForm from "./RepoForm";
import CommitListSection from "./CommitListSection";
import SummarySection from "./SummarySection";
import PromptModal from "./PromptModal";
import { type CommitNode, type GitHubApiResponse } from "../../libs/types";
import { useSavedPosts } from "../context/SavedPostContext";

// 개발 환경(DEV)에서는 Vite 프록시를 사용하므로 상대 경로('')를 사용합니다.
// 프로덕션 빌드(PROD) 시에만 .env의 실제 API 주소를 사용합니다.
const API_BASE_URL =
    import.meta.env.PROD && import.meta.env.VITE_API_BASE_URL
        ? import.meta.env.VITE_API_BASE_URL
        : ""; // 개발 환경에서는 빈 문자열 (상대 경로)

// 기본 프롬프트
const DEFAULT_PROMPT = `
You are a helpful programming assistant.
Summarize the following GitHub commit message concisely, focusing on the main action and purpose.
Respond in 1-2 sentences. Keep the summary technical but clear.
`.trim();

const HomePage: React.FC = () => {
    const [owner, setOwner] = useState<string>("");
    const [repo, setRepo] = useState<string>("");
    const [commits, setCommits] = useState<CommitNode[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedCommit, setSelectedCommit] = useState<CommitNode | null>(
        null
    );
    const [aiSummary, setAiSummary] = useState<string>("");
    const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [customPrompt, setCustomPrompt] = useState<string>(DEFAULT_PROMPT);

    const { addPost } = useSavedPosts();

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setError(null);
        setCommits([]);
        setSelectedCommit(null);
        setAiSummary("");

        try {
            const response = await axios.post<GitHubApiResponse>(
                `${API_BASE_URL}/api/github`,
                {
                    owner,
                    repo,
                }
            );

            if (response.data.errors) {
                throw new Error(response.data.errors[0].message);
            }

            const data =
                response.data?.data?.repository?.defaultBranchRef?.target
                    ?.history?.edges;

            if (data) {
                setCommits(data);
                if (data.length > 0) {
                    setSelectedCommit(data[0]);
                }
            } else {
                setError("Repository not found or no commits.");
            }
        } catch (err) {
            setError("Failed to fetch data from server.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateSummary = async (commit: CommitNode) => {
        setSelectedCommit(commit);
        setIsAiLoading(true);
        setAiSummary("");

        try {
            const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
                commitMessage: commit.node.messageHeadline,
                customPrompt: customPrompt, //  현재 state의 커스텀 프롬프트 전달
            });

            setAiSummary(response.data.summary);
        } catch (err) {
            console.error("Failed to generate summary:", err);
            setAiSummary("Error: Failed to generate summary.");
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleSavePost = () => {
        if (!selectedCommit || !aiSummary) return;

        // 저장할 데이터 객체 생성
        const newPost = {
            id: selectedCommit.node.oid, // 커밋 해시를 ID로 사용
            commit: selectedCommit,
            aiSummary: aiSummary,
            savedAt: new Date().toISOString(),
        };

        // Context(전역 상태)에 추가
        addPost(newPost);

        // 사용자 알림
        alert("블로그 글이 저장되었습니다! (Saved Posts 메뉴에서 확인 가능)");
    };

    // 커밋을 선택하고, 기존 AI 요약 내용과 로딩 상태를 초기화합니다.
    const handleSelectCommit = (commit: CommitNode) => {
        setSelectedCommit(commit);
        setAiSummary("");
        setIsAiLoading(false);
    };

    // 모달 저장 핸들러
    const handleSavePrompt = (newPrompt: string) => {
        setCustomPrompt(newPrompt);
    };

    return (
        <>
            <RepoForm
                owner={owner}
                repo={repo}
                loading={loading}
                onSubmit={handleSubmit}
                onOwnerChange={setOwner}
                onRepoChange={setRepo}
            />

            <div className="flex items-start divide-x justify-between py-8">
                <CommitListSection
                    loading={loading}
                    error={error}
                    commits={commits}
                    selectedCommit={selectedCommit}
                    onGenerateSummary={handleGenerateSummary}
                    onSelect={handleSelectCommit}
                    onOpenPromptModal={() => setIsModalOpen(true)}
                />

                <SummarySection
                    selectedCommit={selectedCommit}
                    aiSummary={aiSummary}
                    isAiLoading={isAiLoading}
                    onSavePost={handleSavePost}
                />
            </div>
            <PromptModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSavePrompt}
                currentPrompt={customPrompt}
            />
        </>
    );
};

export default HomePage;
