export const SOCKET_URL = 'ws://localhost:4000';
export const SOCKET_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  timeout: 5000,
  withCredentials: true, // This enables sending cookies with the WebSocket connection
} as const;