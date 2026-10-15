import { io } from 'socket.io-client';

const getSocketUrl = () => {
  if (import.meta.env && import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL.replace(/\/api\/?$/, '');
  }
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin;
  }
  return 'http://localhost:8000';
};

const socket = io(getSocketUrl(), {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
