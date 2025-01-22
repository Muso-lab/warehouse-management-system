import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import theme from './theme';
import { ClientsProvider } from './context/ClientsContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ClientsProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </ClientsProvider>
    </ThemeProvider>
  );
}

export default App;
