import {
  Card,
  CardContent,
  Typography,
  Collapse,
} from '@mui/material';
import { InputArea } from './InputArea';
import { FilterArea } from './FilterArea';
import { useAppContext } from '@/contexts/AppContext';

export function RepoSetup() {
  const { repoName } = useAppContext();

  return (
    <Card>
      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Typography variant="h6" component="h2" gutterBottom>
          Enter Repository
        </Typography>
        <InputArea />
        <Collapse in={!!repoName}>
          <FilterArea />
        </Collapse>
      </CardContent>
    </Card>
  );
}