import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { MY_GITHUB_URL } from "../../constants/url";

import type { AboutResponse } from "../../types/about";
import type { PromptLang, PromptTone } from "../../types/promptSettings";
import { fetchAbout } from "../../utils/api/about";

import AboutCard from "./AboutCard";

import { Select, MenuItem, FormControl, InputLabel, Box } from "@mui/material";

const aboutPageStyles: {
	wrap: CSSProperties;
	form: CSSProperties;
	row: CSSProperties;
	label: CSSProperties;
	input: CSSProperties;
	select: CSSProperties;
	menuBox: CSSProperties;
	btnRow: CSSProperties;
	btnRowWrapper: CSSProperties;
	error: CSSProperties;
	loading: CSSProperties;
} = {
	wrap: { display: "grid", gap: 20 },
	form: {
		display: "grid",
		gap: 20,
		padding: 16,
		border: "1px solid var(--pink-200)",
		borderRadius: 12,
		background: "var(--white)",
	},
	row: { display: "grid", gap: 6 },
	label: { fontWeight: 700, color: "var(--gray-800)", marginLeft: "8px" },
	input: {
		border: "1px solid var(--gray-300)",
		borderRadius: 8,
		padding: "10px 12px",
		outline: "none",
	},
	select: {
		border: "1px solid var(--gray-300)",
		borderRadius: 8,
		padding: "10px 12px",
		outline: "none",
		maxWidth: 220,
	},
	menuBox: { display: "flex", alignItems: "center", gap: 1 },
	btnRow: {
		display: "flex",
		gap: 8,
		alignItems: "center",
		justifyContent: "space-between",
	},
	btnRowWrapper: { display: "flex", gap: 24, marginRight: 30 },
	error: {
		padding: 12,
		borderRadius: 10,
		border: "1px solid var(--pink-300)",
		background: "var(--pink-50)",
		color: "var(--pink-800)",
	},
	loading: { padding: 12, color: "var(--gray-700)" },
};

const AboutPage = () => {
	const githubUrl = MY_GITHUB_URL;
	const [lang, setLang] = useState<PromptLang>("ko");
	const [tone, setTone] = useState<PromptTone>("concise");

	const [data, setData] = useState<AboutResponse | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const canSubmit = useMemo(() => githubUrl.trim().length > 0, [githubUrl]);

	async function handleGenerate() {
		if (!canSubmit) return;
		setLoading(true);
		setError(null);
		try {
			const res = await fetchAbout({ githubUrl, lang, tone });
			setData(res);
		} catch (e: any) {
			setError(e?.message ?? "Failed to generate about");
			setData(null);
		} finally {
			setLoading(false);
		}
	}

	return (
		<div style={aboutPageStyles.wrap}>
			{error && (
				<div className="card" style={aboutPageStyles.error}>
					{error}
				</div>
			)}
			{loading && !error && (
				<div className="card" style={aboutPageStyles.loading}>
					Loading...
				</div>
			)}
			{!loading && !error && data && <AboutCard data={data} />}
			<div className="card" style={aboutPageStyles.form}>
				<div style={aboutPageStyles.row}>
					<label style={aboutPageStyles.label}>Make New Bio:</label>
					<input
						style={aboutPageStyles.input}
						value={githubUrl}
						disabled={true}
					/>
				</div>

				<div style={aboutPageStyles.btnRow}>
					<div style={aboutPageStyles.btnRowWrapper}>
						<Box sx={aboutPageStyles.menuBox}>
							<FormControl size="small" sx={{ minWidth: 160 }}>
								<InputLabel id="lang-label">Language</InputLabel>
								<Select
									labelId="lang-label"
									label="Language"
									value={lang}
									onChange={(e) => setLang(e.target.value as any)}
									renderValue={(v) => (
										<Box sx={aboutPageStyles.menuBox}>
											<span>{v === "ko" ? "Korean" : "English"}</span>
										</Box>
									)}
								>
									<MenuItem value="ko">
										<Box sx={aboutPageStyles.menuBox}>
											<span>Korean</span>
										</Box>
									</MenuItem>
									<MenuItem value="en">
										<Box sx={aboutPageStyles.menuBox}>
											<span>English</span>
										</Box>
									</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<Box sx={aboutPageStyles.menuBox}>
							<FormControl size="small" sx={{ minWidth: 160 }}>
								<InputLabel id="tone-label">Tone</InputLabel>
								<Select
									labelId="tone-label"
									label="Tone"
									value={tone}
									onChange={(e) => setTone(e.target.value as any)}
									renderValue={(v) => (
										<Box sx={aboutPageStyles.menuBox}>
											<span>
												{v === "concise"
													? "Concise"
													: v === "friendly"
													? "Friendly"
													: "Formal"}
											</span>
										</Box>
									)}
								>
									<MenuItem value="concise">
										<Box sx={aboutPageStyles.menuBox}>
											<span>Concise</span>
										</Box>
									</MenuItem>
									<MenuItem value="friendly">
										<Box sx={aboutPageStyles.menuBox}>
											<span>Friendly</span>
										</Box>
									</MenuItem>
									<MenuItem value="formal">
										<Box sx={aboutPageStyles.menuBox}>
											<span>Formal</span>
										</Box>
									</MenuItem>
								</Select>
							</FormControl>
						</Box>
					</div>

					<button
						className="btn"
						onClick={handleGenerate}
						disabled={!canSubmit || loading}
					>
						{loading ? "Generating..." : "Generate Bio"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AboutPage;
