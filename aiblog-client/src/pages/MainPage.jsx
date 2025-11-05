import { Box, Paper, Grid } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

// Import the components
import { InputArea } from '@/components/InputArea';
import { FilterArea } from '@/components/FilterArea';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';

// This component contains the original content of App.jsx
export function MainPage() {
  const { handleSubmit } = useAppContext();

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: '8px' }}>
        <Box component="form" onSubmit={handleSubmit}>
          <InputArea />
          <FilterArea />
        </Box>
      </Paper>

      <Grid container spacing={4}>
        <LeftPanel />
        <RightPanel />
      </Grid>
    </>
  );
}