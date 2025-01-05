/// <reference types="vite/client" />

export const SOCKET_URL = import.meta.env.VITE_ADMIN_API as string;
export const SOCKET_CONFIG = {
  maxReconnectAttempts: 5,
  reconnectDelay: 1000,
  timeout: 5000,
  withCredentials: true, // This enables sending cookies with the WebSocket connection
} as const;