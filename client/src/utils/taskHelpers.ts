// client/src/utils/taskHelpers.ts
export const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'success';
    case 'in_progress': return 'warning';
    default: return 'default';
  }
};

export const getStatusLabel = (status: string) => {
  switch (status) {
    case 'completed': return 'COMPLETATO';
    case 'in_progress': return 'IN CORSO';
    default: return 'IN ATTESA';
  }
};

export const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'EMERGENZA': return 'error';
    case 'AXA': return 'warning';
    case 'AGGIORNAMENTO': return 'info';
    default: return 'default';
  }
};

export const getServiceTypeColor = (type: string) => {
  switch (type) {
    case 'CARICO': return 'primary';
    case 'SCARICO': return 'warning';
    case 'DEPOSITO': return 'info';
    default: return 'default';
  }
};
