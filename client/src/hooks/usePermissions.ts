import { useEffect, useState } from 'react';
import { authService } from '../services/authService';

interface MenuPermissions {
  canViewDashboard: boolean;
  canViewTasks: boolean;
  canViewUsers: boolean;
  canViewClients: boolean;
  canViewSettings: boolean;
}

export const usePermissions = () => {
  const [permissions, setPermissions] = useState<MenuPermissions>({
    canViewDashboard: false,
    canViewTasks: false,
    canViewUsers: false,
    canViewClients: false,
    canViewSettings: false,
  });

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      switch (user.role) {
        case 'admin':
          setPermissions({
            canViewDashboard: true,
            canViewTasks: true,
            canViewUsers: true,
            canViewClients: true,
            canViewSettings: true,
          });
          break;
        case 'ufficio':
          setPermissions({
            canViewDashboard: true,
            canViewTasks: true,
            canViewUsers: false, // Nascosto per l'ufficio
            canViewClients: true,
            canViewSettings: true,
          });
          break;
        case 'monitor':
          setPermissions({
            canViewDashboard: true,
            canViewTasks: false,
            canViewUsers: false,
            canViewClients: false,
            canViewSettings: false,
          });
          break;
        default:
          setPermissions({
            canViewDashboard: false,
            canViewTasks: false,
            canViewUsers: false,
            canViewClients: false,
            canViewSettings: false,
          });
      }
    }
  }, []);

  return permissions;
};
