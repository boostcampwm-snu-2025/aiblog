import { Container, Box, Paper, Grid } from '@mui/material';
import { useAppContext } from '@/contexts/AppContext';

// Import the new components
import { Header } from '@/components/Header';
import { InputArea } from '@/components/InputArea';
import { FilterArea } from '@/components/FilterArea';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';

function App() {
  // Only handleSubmit is needed from context for the form wrapper
  const { handleSubmit } = useAppContext();

  return (
    <Container maxWidth="lg">
      <Header />

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
    </Container>
  );
}

export default App;