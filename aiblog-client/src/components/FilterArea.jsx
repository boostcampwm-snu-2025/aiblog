import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

export function FilterArea() {
  const { filterType, setFilterType, isLoading } = useAppContext();

  return (
    <FormControl component="fieldset" sx={{ mt: 2 }} disabled={isLoading}>
      <FormLabel component="legend">Data Type</FormLabel>
      <RadioGroup
        row
        aria-label="data type filter"
        name="filterType"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
      >
        <FormControlLabel value="all" control={<Radio />} label="All" />
        <FormControlLabel value="commits" control={<Radio />} label="Commits" />
        <FormControlLabel value="prs" control={<Radio />} label="PRs" />
      </RadioGroup>
    </FormControl>
  );
}