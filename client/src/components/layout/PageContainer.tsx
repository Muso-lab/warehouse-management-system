import { Box, Typography } from '@mui/material';
import { ReactNode } from 'react';

interface PageContainerProps {
  title: string;
  children: ReactNode;
}

const PageContainer: React.FC<PageContainerProps> = ({ title, children }) => {
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: 8,  // Questo gestisce lo spazio dalla navbar
        backgroundColor: '#f5f5f5',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ mb: 3 }}>  {/* Contenitore per il titolo con margine bottom consistente */}
        <Typography variant="h4">
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

export default PageContainer;
