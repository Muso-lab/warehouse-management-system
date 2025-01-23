import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box>
      <Navbar />
      <Box sx={{ display: 'flex' }}>
        <Sidebar />
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            paddingTop: '88px', // 64px navbar + 24px padding
            paddingLeft: '264px', // 240px sidebar + 24px padding
            paddingRight: '24px',
            paddingBottom: '24px',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
