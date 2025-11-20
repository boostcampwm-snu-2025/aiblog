import { Navigate, useParams } from "react-router";

import { PATHS } from "@/constants/paths";
import { getPost } from "@/features/post/api/getPost";
import PostDetail from "@/features/post/components/PostDetail";

export default function PostDetailPage() {
  const { postId } = useParams<{ postId: string }>();

  const post = !postId ? null : getPost(postId);

  if (!post) {
    return <Navigate to={PATHS.notFound.getHref()} replace />;
  }

  return <PostDetail post={post} />;
}
