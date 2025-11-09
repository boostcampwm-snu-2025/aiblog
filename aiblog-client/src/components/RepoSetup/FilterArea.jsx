import {
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import { useMainPageContext } from '@/contexts/MainPageContext';

export function FilterArea() {
  const { filterType, setFilterType, isLoading } = useMainPageContext();

  const handleChange = (event) => {
    setFilterType(event.target.value);
  };

  return (
    <Box sx={{ pt: 1 }}>
      <FormControl component="fieldset" disabled={isLoading}>
        <FormLabel component="legend" sx={{ mb: 1, fontSize: '0.875rem' }}>
          Select Data Type:
        </FormLabel>
        
        <RadioGroup
          row
          aria-label="filter type"
          name="filter-type-group"
          value={filterType}
          onChange={handleChange}
        >
          <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
          <FormControlLabel
            value="commits"
            control={<Radio size="small" />}
            label="Commits"
          />
          <FormControlLabel value="prs" control={<Radio size="small" />} label="PRs" />
        </RadioGroup>
      </FormControl>
    </Box>
  );
}