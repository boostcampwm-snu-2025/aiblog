import { useNavigate, useSearchParams } from "react-router";

import { PATHS } from "@/constants/paths";
import type { PostEditorData } from "@/entities/post";
import { createPost } from "@/features/post/api/createPost";
import { useAiPost } from "@/features/post/api/useQueryAiPost";
import PostEditor from "@/features/post/components/PostEditor";
import { ErrorFallback, LoadingFallback } from "@/shared/ui/Fallback";

export default function CreatePostPage() {
  const [searchParams] = useSearchParams();
  const owner = searchParams.get("owner") ?? "";
  const repository = searchParams.get("repository") ?? "";
  const prNumber = Number(searchParams.get("prNumber") ?? "0");
  const navigate = useNavigate();

  const hasSearchParams = owner !== "" && repository !== "" && prNumber > 0;

  const { data: aiPost, status } = useAiPost({
    params: { owner, repository, prNumber },
    queryConfig: { enabled: hasSearchParams },
  });

  if (status === "error") return <ErrorFallback />;

  if (hasSearchParams && status === "pending") {
    return <LoadingFallback message="ai가 포스팅을 생성하는 중입니다." />;
  }

  const handleCreatePost = (post: PostEditorData) => {
    const newPost = createPost(post);
    navigate(PATHS.post.detail.getHref(newPost.id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold">새 글 작성</h1>
      <PostEditor initValue={aiPost} onSaveClick={handleCreatePost} />
    </div>
  );
}
