import { Task } from './task';

export interface WarehouseTaskUpdate {
    status: Task['status'];
    warehouseNotes: string;
}

export interface WarehouseViewProps {
    userRole: 'warehouse';
}

export interface WarehouseTaskModalProps {
    open: boolean;
    onClose: () => void;
    task: Task;
    onSave: (updatedTask: WarehouseTaskUpdate) => Promise<void>;
}
