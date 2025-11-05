import {
  Box,
  Card,
  CardContent,
  Grid,
  Collapse,
} from '@mui/material';
import { InputArea } from '@/components/InputArea';
import { FilterArea } from '@/components/FilterArea';
import { LeftPanel } from '@/components/LeftPanel';
import { RightPanel } from '@/components/RightPanel';
import { useAppContext } from '@/contexts/AppContext';

export function MainPage() {
  const { handleSubmit, repoName } = useAppContext();

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}
    >
      <Card>
        <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <InputArea />

          <Collapse in={!!repoName}>
            <FilterArea />
          </Collapse>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <LeftPanel />
        <RightPanel />
      </Grid>
    </Box>
  );
}