import { Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import type { PromptTone } from "../../types/promptSettings";
import { boxStyles } from "./boxStyles";

type ToneSelectBoxProps = {
	value: PromptTone;
	onChange: (v: PromptTone) => void;
};

const ToneSelectBox = ({ value, onChange }: ToneSelectBoxProps) => {
	const toneLabel = (t: PromptTone) =>
		t === "concise" ? "Concise" : t === "friendly" ? "Friendly" : "Formal";

	return (
		<Box sx={boxStyles}>
			<FormControl size="small" sx={{ minWidth: 160 }}>
				<InputLabel id="tone-label">Tone</InputLabel>
				<Select
					labelId="tone-label"
					label="Tone"
					value={value}
					onChange={(e) => onChange(e.target.value as PromptTone)}
					renderValue={(v) => (
						<Box sx={boxStyles}>
							<span>{toneLabel(v as PromptTone)}</span>
						</Box>
					)}
				>
					<MenuItem value="concise">
						<Box sx={boxStyles}>
							<span>Concise</span>
						</Box>
					</MenuItem>
					<MenuItem value="friendly">
						<Box sx={boxStyles}>
							<span>Friendly</span>
						</Box>
					</MenuItem>
					<MenuItem value="formal">
						<Box sx={boxStyles}>
							<span>Formal</span>
						</Box>
					</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
};

export default ToneSelectBox;
