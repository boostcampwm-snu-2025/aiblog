import type { CSSProperties } from "react";
import type { AboutResponse } from "../../types/about";

interface AboutCardProps {
	data: AboutResponse;
}

const aboutStyles: Record<string, CSSProperties> = {
	wrap: {
		display: "grid",
		gap: 12,
		padding: 16,
		border: "1px solid var(--pink-200)",
		borderRadius: 12,
		background: "var(--white)",
	},
	header: { display: "flex", alignItems: "center", gap: 12 },
	avatar: {
		width: 48,
		height: 48,
		borderRadius: 12,
		border: "1px solid var(--gray-200)",
	},
	nameRow: { display: "flex", flexDirection: "column" },
	title: { margin: 0, fontWeight: 800, color: "var(--gray-900)" },
	sub: { margin: 0, color: "var(--gray-700)" },
	chipRow: { display: "flex", gap: 8, flexWrap: "wrap" },
	chip: {
		fontSize: 12,
		padding: "4px 10px",
		borderRadius: 999,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-800)",
	},
	aboutBox: {
		padding: 12,
		borderRadius: 10,
		border: "1px solid var(--gray-200)",
		background:
			"color-mix(in srgb, var(--pink-500) 6%, white)" as unknown as string,
		color: "var(--gray-900)",
		whiteSpace: "pre-wrap",
		lineHeight: 1.6,
	},
};

const AboutCard = ({ data }: AboutCardProps) => {
	const github = data.sources?.github;

	return (
		<article className="card" style={aboutStyles.wrap}>
			<div style={aboutStyles.header}>
				{github?.avatar_url && (
					<img
						src={github.avatar_url}
						alt={github.name || github.login || "avatar"}
						style={aboutStyles.avatar}
					/>
				)}
				<div style={aboutStyles.nameRow}>
					<h3 style={aboutStyles.title}>
						{github?.name || github?.login || "GitHub User"}
					</h3>
					{github?.bio && <p style={aboutStyles.sub}>{github.bio}</p>}
				</div>
			</div>

			<div style={aboutStyles.chipRow}>
				{github?.company && (
					<span style={aboutStyles.chip}>{github.company}</span>
				)}
				{github?.location && (
					<span style={aboutStyles.chip}>{github.location}</span>
				)}
				{typeof github?.public_repos === "number" && (
					<span style={aboutStyles.chip}>repos: {github.public_repos}</span>
				)}
			</div>

			<div style={aboutStyles.aboutBox}>{data.about}</div>
		</article>
	);
};

export default AboutCard;
