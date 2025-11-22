import React from "react";
import { type SavedPost } from "../../libs/types";
import Card from "../../components/Card";
import Typography from "../../components/Typography";
import Button from "../../components/Button";

interface SavedPostItemProps {
    post: SavedPost;
    onDelete: (id: string) => void;
}

const SavedPostItem: React.FC<SavedPostItemProps> = ({ post, onDelete }) => {
    const { id, commit, aiSummary, savedAt } = post;

    return (
        <Card className="mb-4">
            <div className="flex justify-between items-start gap-4">
                {/* 내용 영역 */}
                <div className="flex-1 min-w-0">
                    {/* 커밋 제목 */}
                    <Typography
                        as="h3"
                        variant="body"
                        className="font-bold text-lg text-gray-900 dark:text-white truncate"
                    >
                        {commit.node.messageHeadline}
                    </Typography>

                    {/* 메타 정보 (작성자, 저장일) */}
                    <Typography as="p" variant="meta" className="mt-1 text-sm">
                        By {commit.node.author.name} • Saved on{" "}
                        {new Date(savedAt).toLocaleDateString()}
                    </Typography>

                    <hr className="my-3 border-gray-200 dark:border-gray-700" />

                    {/* AI 요약 내용 */}
                    <Typography
                        variant="body"
                        className="text-gray-700 dark:text-gray-300 leading-relaxed"
                    >
                        {aiSummary}
                    </Typography>
                </div>

                {/* 삭제 버튼 */}
                <Button
                    variant="secondary" // 빨간색(secondary) 버튼 활용
                    size="small"
                    className="shrink-0"
                    onClick={() => onDelete(id)}
                >
                    Delete
                </Button>
            </div>
        </Card>
    );
};

export default SavedPostItem;
