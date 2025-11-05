import { TextField, InputAdornment, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import { useAppContext } from '@/contexts/AppContext';

export function RepoInput() {
  const { repoName, setRepoName, isLoading } = useAppContext();

  return (
    <TextField
      fullWidth
      label="Repository (e.g., owner/repo or URL)"
      variant="outlined"
      value={repoName}
      onChange={(e) => setRepoName(e.target.value)}
      disabled={isLoading}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            {repoName && (
              <IconButton
                aria-label="clear input"
                onClick={() => setRepoName('')}
                edge="end"
                disabled={isLoading}
              >
                <ClearIcon />
              </IconButton>
            )}
          </InputAdornment>
        ),
      }}
    />
  );
}