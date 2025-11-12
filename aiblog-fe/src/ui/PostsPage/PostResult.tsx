import type { CSSProperties } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
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
		lineHeight: 1.75,
		color: "var(--gray-800)",
		fontSize: 15,
	},
};

const markdownComponents = {
	h1: (props: any) => (
		<h1
			style={{
				fontSize: 20,
				fontWeight: 700,
				marginTop: 16,
				marginBottom: 10,
				color: "var(--gray-900)",
			}}
			{...props}
		/>
	),
	h2: (props: any) => (
		<h2
			style={{
				fontSize: 18,
				fontWeight: 700,
				marginTop: 14,
				marginBottom: 8,
				color: "var(--gray-900)",
			}}
			{...props}
		/>
	),
	h3: (props: any) => (
		<h3
			style={{
				fontSize: 16,
				fontWeight: 600,
				marginTop: 12,
				marginBottom: 6,
				color: "var(--gray-800)",
			}}
			{...props}
		/>
	),
	p: (props: any) => (
		<p style={{ margin: "8px 0", lineHeight: 1.7 }} {...props} />
	),
	li: (props: any) => (
		<li style={{ marginLeft: 18, marginBottom: 4 }} {...props} />
	),
	strong: (props: any) => (
		<strong style={{ color: "var(--gray-900)" }} {...props} />
	),
	code: (props: any) => (
		<code
			style={{
				background: "var(--gray-100)",
				padding: "2px 5px",
				borderRadius: 4,
				fontSize: "90%",
			}}
			{...props}
		/>
	),
	pre: (props: any) => (
		<pre
			style={{
				background: "var(--gray-100)",
				padding: 10,
				borderRadius: 6,
				overflowX: "auto",
				marginTop: 8,
				marginBottom: 12,
			}}
			{...props}
		/>
	),
};

const PostResult = ({ data }: PostResultProps) => {
	return (
		<div style={resultStyles.wrap}>
			<div style={resultStyles.title}>Generated Post</div>
			<div style={resultStyles.markdown}>
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
