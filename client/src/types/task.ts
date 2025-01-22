export type ServiceType = 'CARICO' | 'SCARICO' | 'LOGISTICA';
export type PriorityType = 'EMERGENZA' | 'AXA' | 'AGGIORNAMENTO' | 'ORDINARIO';
export type StatusType = 'pending' | 'in_progress' | 'completed';

export interface Task {
  _id?: string;
  serviceType: 'CARICO' | 'SCARICO' | 'LOGISTICA';
  vehicleData?: string;
  clients: string[];
  priority: 'EMERGENZA' | 'AXA' | 'AGGIORNAMENTO' | 'ORDINARIO';
  status: 'pending' | 'in_progress' | 'completed';
  date: string;
  startTime?: string;
  endTime?: string;
  officeNotes?: string;
  warehouseNotes?: string;
  createdAt?: Date;
}

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  'CARICO': 'primary',
  'SCARICO': 'warning',
  'LOGISTICA': 'info'
};

export const PRIORITY_COLORS: Record<PriorityType, string> = {
  'EMERGENZA': 'error',
  'AXA': 'warning',
  'AGGIORNAMENTO': 'primary',
  'ORDINARIO': 'info'
};
