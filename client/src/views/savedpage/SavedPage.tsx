import React from "react";
import SectionTitle from "../../components/SectionTitle";
import Typography from "../../components/Typography";
import { useSavedPosts } from "../context/SavedPostContext";
import SavedPostItem from "./SavedPostItem";

const SavedPostsPage: React.FC = () => {
    // 1. Context에서 저장된 글 목록(posts)과 삭제 함수(deletePost)를 가져옵니다.
    const { posts, deletePost } = useSavedPosts();

    const handleDelete = (id: string) => {
        if (confirm("정말 이 글을 삭제하시겠습니까?")) {
            deletePost(id);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-8">
            <SectionTitle className="mb-6 text-2xl">
                My Saved Posts
            </SectionTitle>

            {/* 2. 글이 없을 때 처리 */}
            {posts.length === 0 ? (
                <div className="text-center py-20">
                    <Typography variant="body" className="text-xl mb-2">
                        No saved posts yet.
                    </Typography>
                    <Typography variant="meta">
                        Go to the Home page and generate summaries to save them
                        here.
                    </Typography>
                </div>
            ) : (
                /* 3. 글이 있을 때 리스트 렌더링 */
                <div className="space-y-6">
                    {posts.map((post) => (
                        <SavedPostItem
                            key={post.id}
                            post={post}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SavedPostsPage;
