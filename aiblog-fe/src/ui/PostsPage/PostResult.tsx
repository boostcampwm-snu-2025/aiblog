import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { PostGenerateResponse } from "../../types/githubPostData";
import { markdownBaseStyles, markdownComponents } from "../markdown";

interface PostResultProps {
	data: PostGenerateResponse;
}

const postResultStyles: Record<string, CSSProperties> = {
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
		lineHeight: 1.75,
		color: "var(--gray-800)",
		fontSize: 15,
	},
};

const PostResult = ({ data }: PostResultProps) => {
	return (
		<div style={postResultStyles.wrap}>
			<div style={postResultStyles.title}>Generated Post</div>
			<div style={{ ...postResultStyles.markdown, ...markdownBaseStyles }}>
				<ReactMarkdown
					remarkPlugins={[remarkGfm]}
					components={markdownComponents}
				>
					{data.post.content}
				</ReactMarkdown>
			</div>
		</div>
	);
};

export default PostResult;
