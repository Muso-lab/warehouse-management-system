import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';  // Devi creare questo componente
import Users from './pages/Users';  // Devi creare questo componente
import theme from './theme';
import { ClientsProvider } from './context/ClientsContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClientsProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Dashboard />} /> {/* Per ora reindirizza a Dashboard */}
            <Route path="/users" element={<Dashboard />} /> {/* Per ora reindirizza a Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </Router>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;
