// client/src/config/tableColumns.ts
import { ColumnConfig } from '../components/common/table/EnhancedTableHeader';

export const commonTaskColumns: ColumnConfig[] = [
  {
    id: 'serviceType',
    label: 'TIPO SERVIZIO',
    sortable: true,
    filterable: true,
    width: '130px',
    filterOptions: [
      { value: 'CARICO', label: 'CARICO', color: 'primary' },
      { value: 'SCARICO', label: 'SCARICO', color: 'warning' },
      { value: 'DEPOSITO', label: 'DEPOSITO', color: 'info' }
    ]
  },
  {
    id: 'clients',
    label: 'CLIENTE',
    sortable: true,
    width: '150px'
  },
  {
    id: 'priority',
    label: 'PRIORITÀ',
    sortable: true,
    filterable: true,
    width: '120px',
    filterOptions: [
      { value: 'EMERGENZA', label: 'EMERGENZA', color: 'error' },
      { value: 'AXA', label: 'AXA', color: 'warning' },
      { value: 'AGGIORNAMENTO', label: 'AGGIORNAMENTO', color: 'info' },
      { value: 'ORDINARIO', label: 'ORDINARIO', color: 'default' }
    ]
  },
  {
    id: 'status',
    label: 'STATO',
    sortable: true,
    filterable: true,
    width: '120px',
    filterOptions: [
      { value: 'pending', label: 'IN ATTESA', color: 'default' },
      { value: 'in_progress', label: 'IN CORSO', color: 'warning' },
      { value: 'completed', label: 'COMPLETATO', color: 'success' }
    ]
  },
  {
    id: 'startTime',
    label: 'ORARIO INIZIO',
    sortable: true,
    width: '100px'
  },
  {
    id: 'endTime',
    label: 'ORARIO FINE',
    sortable: true,
    width: '100px'
  },
  {
    id: 'officeNotes',
    label: 'NOTE UFFICIO',
    width: '200px'
  },
  {
    id: 'warehouseNotes',
    label: 'NOTE MAGAZZINO',
    width: '200px'
  },
  {
    id: 'actions',
    label: 'AZIONI',
    width: '80px',
    align: 'center'
  }
];
