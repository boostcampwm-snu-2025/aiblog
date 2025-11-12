import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { PromptLang } from "../../types/promptSettings";
import { boxStyles } from "./boxStyles";

type LanguageSelectBoxProps = {
	value: PromptLang;
	onChange: (v: PromptLang) => void;
};

const LanguageSelectBox = ({ value, onChange }: LanguageSelectBoxProps) => {
	return (
		<Box sx={boxStyles}>
			<FormControl size="small" sx={{ minWidth: 160 }}>
				<InputLabel id="lang-label">Language</InputLabel>
				<Select
					labelId="lang-label"
					label="Language"
					value={value}
					onChange={(e) => onChange(e.target.value as PromptLang)}
					renderValue={(v) => (
						<Box sx={boxStyles}>
							<span>{v === "ko" ? "Korean" : "English"}</span>
						</Box>
					)}
				>
					<MenuItem value="ko">
						<Box sx={boxStyles}>
							<span>Korean</span>
						</Box>
					</MenuItem>
					<MenuItem value="en">
						<Box sx={boxStyles}>
							<span>English</span>
						</Box>
					</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};

export default LanguageSelectBox;
