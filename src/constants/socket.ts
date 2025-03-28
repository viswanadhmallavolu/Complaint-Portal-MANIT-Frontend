/// <reference types="vite/client" />

export const SOCKET_URL = import.meta.env.VITE_ADMIN_SOCKET_API as string;
export const SOCKET_CONFIG = {
	maxReconnectAttempts: Infinity,
	reconnectDelay: 1000,
	timeout: 10000,
	withCredentials: true, // This enables sending cookies with the WebSocket connection
} as const;
