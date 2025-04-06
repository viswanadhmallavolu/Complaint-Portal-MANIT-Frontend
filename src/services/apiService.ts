import {
	Complaint,
	ComplaintCategory,
	HostelComplaintType,
	AnonymousComplaint,
	UpdateComplaint,
	DeleteComplaint,
	AcademicComplaintType,
	MedicalComplaintType,
	InfrastructureComplaintType,
	AdministrationComplaintType,
} from "../types/complaint";
import student_api from "../api/student-api";
import admin_api from "../api/admin-api";
import { ComplaintFilters } from "../types/complaint";

const getApi = (role: string) => {
	console.log(role);
	return role === "admin" ? admin_api : student_api;
};

function mapComplaint(item: any): Complaint {
	console.log("Category  of the Item  :  ", item.category);
	console.log(item);
	if (!item.category) {
		console.warn(`Unknown category: ${item.category}`);
		return {
			id: item._id,
			status: item.status.toLowerCase(),
			dateSubmitted: item.createdAt,
			attachments: item.attachments,
			category: "Anonymous",
			description: item.complainDescription,
			readStatus: item.readStatus,
			resolvedAt: item.resolvedAt,
			AdminAttachments: item.AdminAttachments,
		} as AnonymousComplaint;
	}

	switch (item.category) {
		case "Hostel":
			return {
				id: item._id,
				status: item.status.toLowerCase() as
					| "pending"
					| "in-progress"
					| "resolved",
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Hostel",
				scholarNumber: item.scholarNumber,
				studentName: item.studentName,
				hostelNumber: item.hostelNumber,
				roomNumber: item.room,
				complaintType: item.complainType.toLowerCase() as HostelComplaintType,
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Academic":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Academic",
				scholarNumber: item.scholarNumber,
				studentName: item.studentName,
				department: item.department,
				year: item.year,
				stream: item.stream,
				complaintType: item.complainType.toLowerCase() as AcademicComplaintType,
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Medical":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Medical",
				scholarNumber: item.scholarNumber,
				studentName: item.studentName,
				department: item.department,
				complaintType: item.complainType.toLowerCase() as MedicalComplaintType,
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				year: item.year,
				stream: item.stream,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Infrastructure":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Infrastructure",
				scholarNumber: item.scholarNumber,
				studentName: item.studentName,
				landmark: item.landmark,
				complaintType:
					item.complainType.toLowerCase() as InfrastructureComplaintType,
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Ragging":
			return {
				id: item._id,
				scholarNumber: item.scholarNumber,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Ragging",
				description: item.complainDescription,
				location: item.location,
				involvedParties: item.involvedParties,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				year: item.year,
				stream: item.stream,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Administration":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Administration",
				scholarNumber: item.scholarNumber,
				studentName: item.studentName,
				department: item.department,
				complaintType:
					item.complainType.toLowerCase() as AdministrationComplaintType,
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				year: item.year,
				stream: item.stream,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		case "Anonymous":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Anonymous",
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				AdminRemarks: item.AdminRemarks,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			};
		default:
			console.warn(`Unknown category: ${item.category}`);
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Anonymous", // Fallback category
				description: item.complainDescription,
				readStatus: item.readStatus,
				createdAt: item.createdAt,
				resolvedAt: item.resolvedAt,
				AdminAttachments: item.AdminAttachments,
			} as AnonymousComplaint;
	}
}

export const getComplaints = async (
	category: ComplaintCategory,
	role: string
): Promise<Complaint[]> => {
	const api = getApi(role);

	const response = await api.get<{ complaints: any[] }>(
		`/complain/get-complaints/${category}`
	);
	console.log("Complaints:", response.data.complaints);
	return response.data.complaints.map(mapComplaint);
};

export const updateComplaint = async (
	category: ComplaintCategory,
	updateData: UpdateComplaint,
	csrfToken: string,
	role: string
): Promise<Complaint> => {
	try {
		console.log("Updating complaint:", updateData);
		const api = getApi(role);
		const response = await api.put(
			`/complain/update-complaints/${category}`,
			updateData,
			{
				withCredentials: true,
				headers: {
					"csrf-token": csrfToken,
				},
			}
		);
		return response.data.data;
	} catch (error) {
		console.error("Error updating complaint:", error);
		throw error;
	}
};

export const deleteComplaints = async (
	category: ComplaintCategory,
	deleteData: DeleteComplaint,
	csrfToken: string,
	role: string
): Promise<void> => {
	try {
		console.log("Deleting complaints:", deleteData.complainId);
		const api = getApi(role);
		await api.delete(
			`/complain/delete-complaints/${category}?complainId=${deleteData.complainId}`,
			{
				withCredentials: true,
				headers: {
					"csrf-Token": csrfToken,
				},
			}
		);
	} catch (error) {
		console.error("Error deleting complaints:", error);
		throw error;
	}
};

export const searchComplaint = async (
	id: string,
	category: string
): Promise<Complaint> => {
	const response = await student_api.get(
		`/complain/search/${category.toLowerCase()}?complainId=${id}`
	);
	return mapComplaint(response.data.complaint);
};

export const getComplaintsByDateRange = async (
	category: ComplaintCategory,
	startDate: string,
	endDate: string,
	filters: any,
	role: string
): Promise<Complaint[]> => {
	try {
		console.log("Fetching complaints by date range:", startDate, " ", endDate);
		const api = getApi(role);
		const { complaintIds, complaintType, status, readStatus } = filters;
		const response = await api.get<{ complaints: any[] }>(
			`/complain/get-complaints-date/${category}?startDate=${startDate}&endDate=${endDate}`,
			{
				params: {
					complaintIds,
					complaintType,
					status,
					readStatus,
				},
			}
		);
		console.log("Complaints by date range:", response.data.complaints);
		return response.data.complaints.map(mapComplaint);
	} catch (error) {
		console.error("Error fetching complaints by date range:", error);
		throw error;
	}
};

export const getComplaintStatistics_CategoryWise = async (category: string) => {
	try {
		const response = await admin_api.get(`/complaints/stats/${category}`, {
			withCredentials: true,
		});
		console.log("The are the complaint Stats : ", response.data);
		return response.data;
	} catch (error) {
		console.error("Error fetching complaints statistics:", error);
		throw error;
	}
};

//Gets the data from the backend in the form of paginated data
export const getComplaintsByDateRange_Admin = async (
	category: ComplaintCategory,
	startDate: string,
	endDate: string,
	limit: number,
	lastSeenId: string,
	filters: ComplaintFilters
): Promise<{ complaints: Complaint[]; nextLastSeenId: string }> => {
	try {
		console.log("LastSeen Id is : ", lastSeenId);
		filters
			? console.log("Filters applied:", filters)
			: console.log("No filters applied");

		const response = await admin_api.get<{
			complaints: any[];
			nextLastSeenId: string;
		}>(
			`/complaints/get-complaints/${category}?startDate=${startDate}&endDate=${endDate}&limit=${limit}&lastSeenId=${lastSeenId}&filters=${JSON.stringify(
				filters
			)}`
		);

		console.log("Complaints by date range:", response.data.complaints);

		return {
			complaints: response.data.complaints.map(mapComplaint),
			nextLastSeenId: response.data.nextLastSeenId,
		};
	} catch (error) {
		console.error("Error fetching complaints by date range:", error);
		throw error;
	}
};

export const updateComplaintStatusAdmin = async (
	category: string,
	complaintId: string,
	newStatus: string | null
) => {
	console.log("Sending the status to be updated as: ", newStatus);
	const res = await admin_api.put(
		`/complaints/status/${category}`,
		{ id: complaintId, status: newStatus?.toLowerCase() },
		{ withCredentials: true }
	);
	console.log("Response from the backend: ", res.data);
	return res.data;
};

export const updateComplaintRemarksAdmin = async (
	category: string,
	complaintId: string,
	AdminRemarks: string,
	AdminFiles: File[]
): Promise<Complaint> => {
	const formData = new FormData();
	formData.append("id", complaintId);
	formData.append("AdminRemarks", AdminRemarks);
	if (AdminFiles && AdminFiles.length > 0) {
		AdminFiles.forEach((file) => {
			formData.append("attachments", file);
		});
	}

	try {
		console.log(category);
		const response = await admin_api.put(
			`/complaints/remarks/${category}`,
			formData,
			{
				withCredentials: true,
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);
		return response.data;
	} catch (error) {
		console.error("Error updating complaint remarks:", error);
		throw error;
	}
};

export const get_Complaint_byId = async (
	category: string,
	complaintId: string
) => {
	const response = await admin_api.get(
		`/utility/${category}?id=${complaintId}`
	);
	console.log(
		"This is the complaint upon request by admin : ",
		mapComplaint(response.data.complaint)
	);
	return mapComplaint(response.data.complaint);
};

export const get_logs = async (
	category: string,
	startDate: Date,
	endDate: Date
) => {
	console.log("Downloading logs as Blob");
	const response = await admin_api.post(
		`/utility/log/${category.toLowerCase()}?startDate=${startDate}&endDate=${endDate}`,
		null,
		{ responseType: "blob" }
	);
	return response.data;
};
