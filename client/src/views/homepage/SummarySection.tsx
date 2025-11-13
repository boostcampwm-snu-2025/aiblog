import React from "react";
import { type CommitNode } from "../../libs/types";
import SectionTitle from "../../components/SectionTitle";
import Card from "../../components/Card";
import Typography from "../../components/Typography";
import LoadingSpinner from "../../components/LoadingSpinner";
import Button from "../../components/Button";
import { cn } from "../../libs/utils";

interface SummarySectionProps {
    selectedCommit: CommitNode | null;
    aiSummary: string;
    isAiLoading: boolean;
    onSavePost: () => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({
    selectedCommit,
    aiSummary,
    isAiLoading,
    onSavePost,
}) => {
    const isSaveDisabled =
        isAiLoading || !aiSummary || aiSummary.startsWith("Error:");

    return (
        <section className="px-8 w-full">
            <SectionTitle>Selected Commit</SectionTitle>
            <Card>
                {!selectedCommit && (
                    <Typography variant="meta" className="text-center">
                        Select a commit to see details.
                    </Typography>
                )}
                {selectedCommit && (
                    <div className="space-y-6">
                        {/* 선택된 커밋 정보 */}
                        <div>
                            <Typography
                                as="h3"
                                variant="body"
                                className="font-semibold text-gray-900 dark:text-gray-900 truncate"
                            >
                                {selectedCommit.node.messageHeadline}
                            </Typography>
                            <Typography as="p" variant="meta" className="mt-1">
                                By {selectedCommit.node.author.name} on{" "}
                                {new Date(
                                    selectedCommit.node.committedDate
                                ).toLocaleDateString()}
                            </Typography>
                        </div>

                        <hr className="border-gray-700" />

                        {/* AI 요약 섹션 */}
                        <div>
                            <SectionTitle className="text-gray-900 dark:text-gray-900">
                                AI Summary
                            </SectionTitle>
                            {isAiLoading && (
                                <div className="flex justify-center items-center py-4">
                                    <LoadingSpinner
                                        theme="primary"
                                        size="base"
                                    />
                                </div>
                            )}
                            {/* 요약 전/에러 시 (meta), 요약 성공 시 (body) */}
                            {!isAiLoading && aiSummary && (
                                <Typography
                                    variant={
                                        aiSummary.startsWith("Error:")
                                            ? "meta"
                                            : "body"
                                    }
                                    className={cn(
                                        "leading-relaxed",
                                        aiSummary.startsWith("Error:")
                                            ? "text-red-400" // 에러는 빨간색
                                            : "text-gray-900 dark:text-gray-900" // 성공시 검정색
                                    )}
                                >
                                    {aiSummary}
                                </Typography>
                            )}
                            {!isAiLoading && !aiSummary && (
                                <Typography
                                    variant="meta"
                                    className="text-center"
                                >
                                    Click 'Generate Summary' on a commit.
                                </Typography>
                            )}
                        </div>

                        {/* 저장 버튼 */}
                        <Button
                            variant="primary"
                            onClick={onSavePost}
                            disabled={isSaveDisabled}
                            className="w-full"
                        >
                            Save as Blog Post
                        </Button>
                    </div>
                )}
            </Card>
        </section>
    );
};

export default SummarySection;
