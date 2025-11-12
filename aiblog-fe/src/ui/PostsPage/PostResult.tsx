import type { CSSProperties } from "react";
import type { PostGenerateResponse } from "../../types/githubPostData";

interface PostResultProps {
	data: PostGenerateResponse;
}

const resultStyles: { [key: string]: CSSProperties } = {
	wrap: {
		padding: 16,
		borderRadius: 12,
		border: "1px solid var(--gray-300)",
		background: "var(--gray-50)",
	},
	title: {
		fontWeight: 800,
		fontSize: 18,
		color: "var(--gray-900)",
		marginBottom: 12,
	},
	markdown: {
		whiteSpace: "pre-wrap",
		lineHeight: 1.6,
		color: "var(--gray-800)",
	},
};

const PostResult = ({ data }: PostResultProps) => {
	return (
		<div style={resultStyles.wrap}>
			<div style={resultStyles.title}>Generated Post</div>
			<div style={resultStyles.markdown}>{data.post.content}</div>
		</div>
	);
};

export default PostResult;
