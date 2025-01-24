// client/src/styles/tableStyles.ts
export const tableStyles = {
  tableContainer: {
    '& .MuiTableCell-root': {
      padding: '8px 16px',
      fontSize: '0.875rem',
      borderRight: '1px solid rgba(224, 224, 224, 0.4)', // Divisione tra colonne
      '&:last-child': {
        borderRight: 'none', // Rimuove il bordo dall'ultima colonna
      }
    },
    '& .MuiTableCell-head': {
      backgroundColor: '#f5f5f5',
      fontWeight: 700,
      color: '#333',
      height: 'auto',
      padding: '8px 16px',
    },
    '& .MuiTable-root': {
      borderCollapse: 'separate',
      borderSpacing: 0,
    },
    '& .MuiTableRow-root:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04)',
    },
  },
  headerCell: {
    whiteSpace: 'nowrap',
    padding: '8px 16px',
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
  },
  // Larghezze fisse aggiornate per le colonne specifiche
  serviceTypeColumn: {
    width: '140px', // Aumentata per "TIPO SERVIZIO"
    minWidth: '140px',
    maxWidth: '140px',
  },
  priorityColumn: {
    width: '130px', // Per "PRIORITÀ"
    minWidth: '130px',
    maxWidth: '130px',
  },
  statusColumn: {
    width: '120px', // Per "STATO"
    minWidth: '120px',
    maxWidth: '120px',
  },
  timeColumn: {
    width: '110px', // Per "ORARIO"
    minWidth: '110px',
    maxWidth: '110px',
  },
  actionColumn: {
    width: '80px',
    minWidth: '80px',
    maxWidth: '80px',
  }
};
