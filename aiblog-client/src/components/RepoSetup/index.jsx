import {
  Card,
  CardContent,
  Typography,
  Collapse,
} from '@mui/material';
import { InputArea } from './InputArea';
import { FilterArea } from './FilterArea';
import { useMainPageContext } from '@/contexts/MainPageContext';

export function RepoSetup() {
  const { repoName } = useMainPageContext();

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