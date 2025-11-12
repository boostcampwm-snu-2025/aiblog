import { Box, Typography, List } from '@mui/material';
import { useMainPageContext } from '@/contexts/MainPageContext';
import { useGitHubDataList } from '@/hooks/useGitHubDataList';
import { LoadingState } from './LoadingState';
import { ErrorState } from './ErrorState';
import { NoDataState } from './NoDataState';
import { SelectAllHeader } from './SelectAllHeader';
import { GitHubDataItem } from './GitHubDataItem';

// Helper to get the unique ID for an item
const getItemId = (item) => item.oid || item.id;

export function LeftPanel() {
  const { isLoading, apiError, githubData } = useMainPageContext();
  const {
    items,
    checkboxState,
    handleToggleCheckbox,
    handleSelectAll,
    handleItemClick,
    activeCommit,
    checkedCommits,
  } = useGitHubDataList();

  // Main content rendering logic
  const renderContent = () => {
    if (isLoading) return <LoadingState />;
    if (apiError) return <ErrorState message={apiError} />;
    if (!githubData || items.length === 0) return <NoDataState />;

    return (
      <List dense sx={{ width: '100%', bgcolor: 'background.paper', p: 0 }}>
        {/* Select All Header */}
        <SelectAllHeader
          checkboxState={checkboxState}
          onSelectAll={handleSelectAll}
        />

        {/* Data Items List */}
        {items.map((item, index) => {
          const id = getItemId(item);
          return (
            <GitHubDataItem
              key={id}
              item={item}
              isChecked={checkedCommits.has(id)}
              isActive={activeCommit && getItemId(activeCommit) === id}
              onToggleCheckbox={handleToggleCheckbox}
              onItemClick={handleItemClick}
              isLastItem={index === items.length - 1}
            />
          );
        })}
      </List>
    );
  };

  return (
    <Box
      sx={{
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 2,
        height: '100%',
        minHeight: { xs: '300px', md: '70vh' },
        overflow: 'hidden',
      }}
    >
      <Typography variant="h6" sx={{ p: 2, pb: 1, fontWeight: 600 }}>
        Recent Activity
      </Typography>
      <Box sx={{ overflowY: 'auto', maxHeight: '60vh' }}>
        {renderContent()}
      </Box>
    </Box>
  );
}