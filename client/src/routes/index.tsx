import { FC } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TasksView from '../components/office/TasksView';
import WarehouseView from '../components/warehouse/WarehouseView';
import MonitorView from '../components/monitor/MonitorView';
import Settings from '../components/settings/Settings';
import Users from '../components/users/Users';

const AppRoutes: FC = () => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" />;
    }

    return (
        <Routes>
            {/* Route per utente ufficio */}
            {user.role === 'office' && (
                <>
                    <Route path="/tasks" element={<TasksView />} />
                    <Route path="/" element={<Navigate to="/tasks" />} />
                </>
            )}

            {/* Route per utente magazzino */}
            {user.role === 'warehouse' && (
                <>
                    <Route path="/warehouse" element={<WarehouseView />} />
                    <Route path="/" element={<Navigate to="/warehouse" />} />
                </>
            )}

            {/* Route per utente monitor */}
            {user.role === 'monitor' && (
                <>
                    <Route path="/monitor" element={<MonitorView />} />
                    <Route path="/" element={<Navigate to="/monitor" />} />
                </>
            )}

            {/* Route per admin */}
            {user.role === 'admin' && (
                <>
                    <Route path="/tasks" element={<TasksView />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/" element={<Navigate to="/tasks" />} />
                </>
            )}

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default AppRoutes;
