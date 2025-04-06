/// <reference types="vite/client" />

// Parse the base URL and namespace separately for proper socket.io connection
const adminSocketUrl = import.meta.env.VITE_ADMIN_SOCKET_API as string;
const socketUrlParts = adminSocketUrl.split("/socket/");

// Correctly separate the base URL from the namespace
export const SOCKET_URL = socketUrlParts[0]; // Base URL (e.g., http://localhost:5000)
export const SOCKET_NAMESPACE =
	socketUrlParts.length > 1 ? `/socket/${socketUrlParts[1]}` : "/socket/admin"; // Namespace (e.g., /socket/admin)

// Configuration options for Socket.io client
export const SOCKET_CONFIG = {
	maxReconnectAttempts: Infinity,
	reconnectDelay: 1000,
	timeout: 10000,
	withCredentials: true, // This enables sending cookies with the WebSocket connection
} as const;
