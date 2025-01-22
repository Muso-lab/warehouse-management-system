import React from 'react';
import { Box, Typography, Chip, Badge } from '@mui/material';
import { useSocket } from '../../context/SocketContext';

const ActiveUsers: React.FC = () => {
  const { activeUsers } = useSocket();

  return (
    <Box sx={{ p: 1, display: 'flex', gap: 1, alignItems: 'center' }}>
      <Badge
        badgeContent={activeUsers.length}
        color="success"
        sx={{ mr: 1 }}
      >
        <Typography variant="body2">Online</Typography>
      </Badge>
      {activeUsers.map((user) => (
        <Chip
          key={user.userId}
          label={user.username}
          size="small"
          color="primary"
          variant="outlined"
        />
      ))}
    </Box>
  );
};

export default ActiveUsers;
