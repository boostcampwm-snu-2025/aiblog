import { ListItem, ListItemIcon, Checkbox, ListItemText, Typography } from '@mui/material';

export function SelectAllHeader({ checkboxState, onSelectAll }) {
  const { numChecked, numItems, isAllSelected, isIndeterminate } = checkboxState;

  return (
    <ListItem sx={{ pl: 1, pr: 2, borderBottom: '1px solid #eee' }}>
      <ListItemIcon sx={{ minWidth: 0, mr: 1 }}>
        <Checkbox
          edge="start"
          checked={isAllSelected}
          indeterminate={isIndeterminate}
          onChange={onSelectAll}
          inputProps={{ 'aria-label': 'select all items' }}
        />
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {numChecked} / {numItems} selected
          </Typography>
        }
      />
    </ListItem>
  );
}