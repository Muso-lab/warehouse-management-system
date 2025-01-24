// client/src/styles/tableStyles.ts

import { Theme } from '@mui/material/styles';

export const tableStyles = {
  tableContainer: {
    '& .MuiTableCell-root': {
      padding: '8px 16px',
      fontSize: '0.875rem',
    },
    '& .MuiTableCell-head': {
      backgroundColor: '#f5f5f5',
      fontWeight: 700,
      color: '#333',
    },
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: '0',
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  fixedColumn: {
    minWidth: 'auto',
    maxWidth: 'fit-content',
    whiteSpace: 'nowrap',
  },
  statusColumn: {
    width: '120px',
  },
  timeColumn: {
    width: '100px',
  },
  actionColumn: {
    width: '80px',
  },
  serviceTypeColumn: {
    width: '130px',
  },
  priorityColumn: {
    width: '120px',
  },
  filterHeader: {
    '& .MuiTableSortLabel-root': {
      fontWeight: 700,
      color: '#333',
      marginBottom: '8px',
      display: 'block',
    },
    '& .MuiSelect-select': {
      fontSize: '0.813rem',
      padding: '4px 8px',
    },
    '& .MuiOutlinedInput-root': {
      backgroundColor: '#fff',
    },
    '& .MuiFormControl-root': {
      marginTop: '4px',
    }
  },
  chip: {
    '& .MuiChip-label': {
      fontSize: '0.75rem',
    },
    '& .MuiChip-sizeSmall': {
      height: '24px',
    }
  },
  noteCell: {
    minWidth: '200px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  },
  clientCell: {
    minWidth: '150px',
    whiteSpace: 'normal',
    wordBreak: 'break-word',
  }
};
