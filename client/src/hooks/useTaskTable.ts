import { useState } from 'react';
import { Task } from '../types/task';

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof Task | '';
  direction: SortDirection;
}

interface FilterState {
  serviceType: string[];
  priority: string[];
  status: string[];
  vehicleData: string;
  clients: string[];
  officeNotes: string;
  warehouseNotes: string;
}

const initialFilterState: FilterState = {
  serviceType: [],
  priority: [],
  status: [],
  vehicleData: '',
  clients: [],
  officeNotes: '',
  warehouseNotes: ''
};

export const useTaskTable = (tasks: Task[]) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: '',
    direction: null
  });
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const handleSort = (key: keyof Task) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key) {
      if (sortConfig.direction === 'asc') {
        direction = 'desc';
      } else if (sortConfig.direction === 'desc') {
        direction = null;
      }
    }

    setSortConfig({ key, direction });
  };

  const handleFilterChange = (column: keyof FilterState, value: any) => {
    setFilters(prev => ({
      ...prev,
      [column]: value
    }));
  };

  const clearFilter = (column: keyof FilterState) => {
    setFilters(prev => ({
      ...prev,
      [column]: Array.isArray(prev[column]) ? [] : ''
    }));
  };

  const clearAllFilters = () => {
    setFilters(initialFilterState);
  };

  const getFilteredAndSortedTasks = () => {
    let result = [...tasks];

    // Applica i filtri
    result = result.filter(task => {
      return (
        (filters.serviceType.length === 0 || filters.serviceType.includes(task.serviceType)) &&
        (filters.priority.length === 0 || filters.priority.includes(task.priority)) &&
        (filters.status.length === 0 || filters.status.includes(task.status)) &&
        (filters.vehicleData === '' || task.vehicleData?.toLowerCase().includes(filters.vehicleData.toLowerCase())) &&
        (filters.clients.length === 0 || task.clients.some(client => filters.clients.includes(client))) &&
        (filters.officeNotes === '' || task.officeNotes?.toLowerCase().includes(filters.officeNotes.toLowerCase())) &&
        (filters.warehouseNotes === '' || task.warehouseNotes?.toLowerCase().includes(filters.warehouseNotes.toLowerCase()))
      );
    });

    // Applica l'ordinamento
    if (sortConfig.key && sortConfig.direction) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof Task];
        const bValue = b[sortConfig.key as keyof Task];

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }

    return result;
  };

  return {
    sortConfig,
    filters,
    handleSort,
    handleFilterChange,
    clearFilter,
    clearAllFilters,
    getFilteredAndSortedTasks
  };
};

export type { FilterState, SortConfig };
