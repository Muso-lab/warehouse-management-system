import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
      }}
    >
      <Navbar />
      <Box sx={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flex: 1,
            paddingTop: '88px',
            paddingLeft: '256px',
            paddingRight: '16px',
            paddingBottom: '24px',
            backgroundColor: '#f5f5f5',
            minWidth: 0, // Importante per evitare overflow
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
