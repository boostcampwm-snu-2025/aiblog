import { Typography, TextField } from '@mui/material';

export function CommitNoteInput({ value, onChange }) {
  return (
    <>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Notes for AI Summary
      </Typography>
      <TextField
        fullWidth
        multiline
        rows={8}
        variant="outlined"
        placeholder="What was the context for this change? What was important about it? Your notes here will guide the AI summary."
        value={value}
        onChange={onChange}
      />
    </>
  );
}