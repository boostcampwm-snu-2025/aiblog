import { useState } from "react";
import type { CSSProperties } from "react";
import type {
	PostGenerateResponse,
	PostGenerateRequest,
} from "../../types/githubPostData";
import { generatePost } from "../../utils/api/post";
import PostForm from "./PostForm";
import PostResult from "./PostResult";

const postsPageStyles: Record<string, CSSProperties> = {
	wrap: { display: "grid", gap: 16 },
	error: {
		padding: 12,
		borderRadius: 10,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-800)",
	},
	loading: { padding: 12, color: "var(--gray-700)" },
};

const PostsPage = () => {
	const [data, setData] = useState<PostGenerateResponse | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [loading, setLoading] = useState(false);

	async function handleGenerate(req: PostGenerateRequest) {
		setLoading(true);
		setError(null);
		try {
			const res = await generatePost(req);
			setData(res);
		} catch (e: any) {
			setError(e?.message ?? "Failed to generate post");
			setData(null);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div style={postsPageStyles.wrap}>
			<PostForm onSubmit={handleGenerate} loading={loading} />
			{error && <div style={postsPageStyles.error}>{error}</div>}
			{loading && <div style={postsPageStyles.loading}>Generating...</div>}
			{!loading && !error && data && <PostResult data={data} />}
		</div>
	);
};

export default PostsPage;
