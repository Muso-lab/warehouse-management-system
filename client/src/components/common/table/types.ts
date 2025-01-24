// client/src/components/common/table/types.ts
export interface ColumnConfig {
  id: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  filterOptions?: FilterOption[];
  align?: 'left' | 'center' | 'right';
}

export interface FilterOption {
  value: string;
  label: string;
  color?: string;
}
