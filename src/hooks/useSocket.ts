import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AnalyticsData } from "../types/analytics";
import {
	SOCKET_CONFIG,
	SOCKET_URL,
	SOCKET_NAMESPACE,
} from "../constants/socket";
import { useLocation, useParams } from "react-router-dom";
import { COWDashboardData, WardenDashboardData } from "../types/dashboard";

const MOCK_DATA: AnalyticsData = {
	medicalData: {
		details: [
			{ _id: "Ambulance", total: 16, viewed: 11, resolved: 7 },
			{ _id: "Medicine", total: 6, viewed: 4, resolved: 1 },
		],
		overall: { total: 50, viewed: 27, resolved: 24 },
	},
	infrastructureData: {
		details: [
			{ _id: "Internet", total: 6, viewed: 5, resolved: 3 },
			{ _id: "Classroom", total: 4, viewed: 3, resolved: 1 },
		],
		overall: { total: 38, viewed: 24, resolved: 17 },
	},
};

export const useSocket = (url: string) => {
	const location = useLocation();
	const { category } = useParams<{ category: string }>();
	const [isConnected, setIsConnected] = useState(false);
	const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
		null
	);
	const [resolution, setResolution] = useState<any | null>(null);
	const [error, setError] = useState<string | null>(null);
	const socketRef = useRef<Socket | null>(null);
	const [socketInstance, setSocketInstance] = useState<Socket | null>(null);
	const reconnectAttempts = useRef(0);
	const [categoryStats, setCategoryStats] = useState<any | null>(null);
	const [cowDashboardData, setCowDashboardData] =
		useState<COWDashboardData | null>(null);
	const [wardenDashboardData, setWardenDashboardData] =
		useState<WardenDashboardData | null>(null);
	const categoryInterval = useRef<NodeJS.Timeout | null>(null);
	const lastHeartbeat = useRef(Date.now());
	const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
	const connectionMonitor = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleAnalyticsData = (data: AnalyticsData) => {
			setAnalyticsData(data);
		};

		const connectSocket = async () => {
			try {
				// Extract the base URL and namespace from the provided URL
				const urlParts = url.split("/socket/");
				const baseUrl = urlParts[0];
				const namespace =
					urlParts.length > 1 ? `/socket/${urlParts[1]}` : SOCKET_NAMESPACE;

				// Connect to the Socket.io server with the proper namespace
				// Don't use 'path' for namespace - it's for the HTTP endpoint
				socketRef.current = io(`${baseUrl}${namespace}`, {
					...SOCKET_CONFIG,
					timeout: 30000,
				});

				socketRef.current.on("connect", () => {
					console.log("Socket connected successfully");
					setSocketInstance(socketRef.current);
					setIsConnected(true);
					setError(null);
					reconnectAttempts.current = 0;
					lastHeartbeat.current = Date.now();

					// Set up heartbeat monitoring
					heartbeatInterval.current = setInterval(() => {
						socketRef.current?.emit("pong");
					}, 25000);

					// Monitor connection health
					connectionMonitor.current = setInterval(() => {
						if (Date.now() - lastHeartbeat.current > 60000) {
							console.log("Connection dead - no heartbeat");
							socketRef.current?.disconnect();
							setIsConnected(false);
						}
					}, 30000);

					// Emit initial data request for COW dashboard
					if (location.pathname === "/cow/dashboard") {
						console.log("Requesting COW dashboard data");
						socketRef.current?.emit("cowDashboardData");
					}

					// Add warden dashboard initial data request
					if (location.pathname.includes("/admin/hostel/warden/dashboard")) {
						console.log("Requesting Warden dashboard data");
						socketRef.current?.emit("getWardenDashboardData");
					}
				});

				// Handle ping from server
				socketRef.current.on("ping", () => {
					lastHeartbeat.current = Date.now();
					socketRef.current?.emit("pong");
				});

				socketRef.current.on("disconnect", () => {
					console.log("Socket disconnected");
					setIsConnected(false);
				});

				if (location.pathname === "/admin/dashboard") {
					socketRef.current.on("fetchData", handleAnalyticsData);
					socketRef.current.on("analyticsUpdate", handleAnalyticsData);
					socketRef.current.on("setResolution", (data: any) => {
						setResolution(data);
					});
				} else if (location.pathname === "/cow/dashboard") {
					// Set up interval for COW dashboard data updates
					categoryInterval.current = setInterval(() => {
						console.log("Requesting updated COW dashboard data");
						socketRef.current?.emit("cowDashboardData");
					}, 5000);

					socketRef.current.on(
						"setCowDashboardData",
						(data: COWDashboardData) => {
							console.log("Received COW dashboard data:", data);
							setCowDashboardData(data);
						}
					);
				} else if (
					[
						"/admin/complaints/hostel",
						"/admin/complaints/medical",
						"/admin/complaints/infrastructure",
						"/admin/complaints/academic",
						"/admin/complaints/administration",
						"/admin/complaints/ragging",
					].includes(location.pathname)
				) {
					categoryInterval.current = setInterval(() => {
						socketRef.current?.emit(`${category}Stats`);
					}, 5000);

					socketRef.current.on(`set${category}Stats`, (data: any) => {
						setCategoryStats(data);
					});
				} else if (location.pathname.includes("/warden/dashboard")) {
					// Changed the event listener name to match the backend for the new warden dashboard route
					socketRef.current.on(
						"setWardenDashboardData",
						(data: WardenDashboardData) => {
							console.log("Received Warden dashboard data:", data);
							setWardenDashboardData(data);
						}
					);

					// Set up interval for warden dashboard data updates
					categoryInterval.current = setInterval(() => {
						console.log("Requesting updated Warden dashboard data");
						socketRef.current?.emit("getWardenDashboardData");
					}, 5000);
				}

				socketRef.current.on("connect_error", (error: any) => {
					console.error("Socket connect error:", error);
					reconnectAttempts.current += 1;
				});
			} catch (err) {
				console.error("Failed to initialize socket connection:", err);
				setError("Failed to initialize socket connection");
				setAnalyticsData(MOCK_DATA);
			}
		};

		connectSocket();

		return () => {
			console.log("Cleaning up socket connection");
			if (categoryInterval.current) {
				clearInterval(categoryInterval.current);
			}
			if (heartbeatInterval.current) {
				clearInterval(heartbeatInterval.current);
			}
			if (connectionMonitor.current) {
				clearInterval(connectionMonitor.current);
			}
			socketRef.current?.disconnect();
		};
	}, [url, location.pathname, category]);

	return {
		isConnected,
		analyticsData,
		resolution,
		error,
		categoryStats,
		socket: socketInstance,
		cowDashboardData,
		wardenDashboardData,
	};
};
