import { useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Inisialisasi socket connection
    socketRef.current = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    // Cleanup pada unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
};