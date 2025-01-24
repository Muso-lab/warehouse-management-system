// client/src/components/common/table/EnhancedTableHeader.tsx
import React from 'react';
import {
  TableCell,
  Box,
  Typography,
  TableSortLabel,
  IconButton,
  Popover,
  MenuItem,
  Chip,
  Tooltip,
} from '@mui/material';
import { FilterList as FilterListIcon } from '@mui/icons-material';
import { tableStyles } from '../../../styles/tableStyles';
import { ColumnConfig } from './types';

interface FilterOption {
  value: string;
  label: string;
  color?: string;
}

interface ColumnConfig {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  filterOptions?: FilterOption[];
  align?: 'left' | 'center' | 'right';
}

interface EnhancedTableHeaderCellProps {
  column: ColumnConfig;
  sortDirection?: 'asc' | 'desc';
  sortActive?: boolean;
  filterValue?: string;
  onSort?: () => void;
  onFilterChange?: (value: string) => void;
}

const EnhancedTableHeaderCell: React.FC<EnhancedTableHeaderCellProps> = ({
  column,
  sortDirection,
  sortActive,
  filterValue,
  onSort,
  onFilterChange,
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleFilterClick = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <TableCell
      align={column.align || 'left'}
      sx={{
        ...tableStyles.headerCell,
        width: column.width,
        minWidth: column.width,
      }}
    >
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        py: 1
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5
        }}>
          {column.sortable ? (
            <TableSortLabel
              active={sortActive}
              direction={sortDirection}
              onClick={onSort}
              sx={{
                textTransform: 'uppercase',
                fontWeight: 700,
                '& .MuiTableSortLabel-icon': {
                  opacity: sortActive ? 1 : 0.5
                }
              }}
            >
              {column.label}
            </TableSortLabel>
          ) : (
            <Typography sx={{
              textTransform: 'uppercase',
              fontWeight: 700
            }}>
              {column.label}
            </Typography>
          )}

          {column.filterable && (
            <Tooltip title="Filtro">
              <IconButton
                size="small"
                onClick={handleFilterClick}
                sx={{
                  ml: 0.5,
                  opacity: filterValue ? 1 : 0.5,
                  '&:hover': { opacity: 1 }
                }}
              >
                <FilterListIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </Box>

        {column.filterable && column.filterOptions && (
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                mt: 1,
                boxShadow: 2,
                maxHeight: '300px'
              }
            }}
          >
            <Box sx={{ p: 1, minWidth: '150px' }}>
              <MenuItem
                onClick={() => {
                  onFilterChange?.('');
                  handleClose();
                }}
                selected={!filterValue}
              >
                <Typography sx={{ textAlign: 'center', width: '100%' }}>
                  TUTTI
                </Typography>
              </MenuItem>
              {column.filterOptions.map(option => (
                <MenuItem
                  key={option.value}
                  onClick={() => {
                    onFilterChange?.(option.value);
                    handleClose();
                  }}
                  selected={filterValue === option.value}
                  sx={{ justifyContent: 'center' }}
                >
                  <Chip
                    label={option.label}
                    color={option.color as any || 'default'}
                    size="small"
                    sx={tableStyles.chip}
                  />
                </MenuItem>
              ))}
            </Box>
          </Popover>
        )}
      </Box>
    </TableCell>
  );
};

export default EnhancedTableHeaderCell;
