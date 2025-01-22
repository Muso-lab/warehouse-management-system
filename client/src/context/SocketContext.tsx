import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { authService } from '../services/authService';

interface SocketContextType {
  socket: Socket | null;
  activeUsers: Array<{
    userId: string;
    username: string;
    role: string;
    connectedAt: Date;
  }>;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  activeUsers: []
});

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeUsers, setActiveUsers] = useState([]);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      const newSocket = io('http://localhost:5000');

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
        newSocket.emit('userConnected', {
          userId: user._id,
          username: user.username,
          role: user.role
        });
      });

      newSocket.on('activeUsers', (users) => {
        setActiveUsers(users);
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={{ socket, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
