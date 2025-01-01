import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { AnalyticsData } from "../types/analytics";
import { SOCKET_CONFIG } from "../constants/socket";
import { useLocation , useParams } from "react-router-dom";

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
	const reconnectAttempts = useRef(0);
	const [categoryStats, setCategoryStats] = useState<any | null>(null);
	useEffect(() => {
		const handleAnalyticsData = (data: AnalyticsData) => {
			setAnalyticsData(data);
		};

		const connectSocket = async () => {
			try {
				socketRef.current = io(url, {
					reconnectionAttempts: SOCKET_CONFIG.maxReconnectAttempts,
					reconnectionDelay: SOCKET_CONFIG.reconnectDelay,
					timeout: SOCKET_CONFIG.timeout,
					transports: ["websocket", "polling", "flashsocket"],
				});

				socketRef.current.on("ping", () =>{
					socketRef.current?.emit("pong")
				});

				socketRef.current.on("connect", () => {
					setIsConnected(true);
					setError(null);
					reconnectAttempts.current = 0;
				});

				socketRef.current.on("disconnect", () => {
					setIsConnected(false);
				});

				if (location.pathname === "/admin/dashboard") {
					socketRef.current.on("fetchData", handleAnalyticsData);
					socketRef.current.on("analyticsUpdate", handleAnalyticsData);
					socketRef.current.on("setResolution", (data: any) => {
						setResolution(data);
					});
				} else if ([
					"/admin/complaints/hostel",
					"/admin/complaints/medical",
					"/admin/complaints/infrastructure",
					"/admin/complaints/academic",
					"/admin/complaints/administration",
					"/admin/complaints/ragging"
				].includes(location.pathname)) {
					setInterval(()=>{socketRef.current?.emit(`${category}Stats`)},5000)
			        
					socketRef.current.on(`set${category}Stats`, (data: any) => {
						setCategoryStats(data);
						console.log(data)
					});
				}

				socketRef.current.on("connect_error", () => {
					reconnectAttempts.current += 1;

					if (reconnectAttempts.current >= SOCKET_CONFIG.maxReconnectAttempts) {
						setError("Unable to connect to server");
						// Fall back to mock data in development
						if (true) {
							console.info("Using mock data for development");
							setAnalyticsData(MOCK_DATA);
						}
						socketRef.current?.disconnect();
					}
				});
			} catch (err) {
				console.error("Failed to initialize socket connection", err);
				setError("Failed to initialize socket connection");
				let check = true;
				if (check) {
					setAnalyticsData(MOCK_DATA);
				}
			}
		};

		connectSocket();

		// Cleanup on unmount
		return () => {
			console.log("Disconnecting socket");
			socketRef.current?.disconnect();
		};
	}, [url]);

	return { isConnected, analyticsData, resolution, error, categoryStats };
};
