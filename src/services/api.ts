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
const api = student_api;

const mapComplaint = (item: any): Complaint => {
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
			};
		case "Ragging":
			return {
				id: item._id,
				status: item.status.toLowerCase(),
				dateSubmitted: item.createdAt,
				attachments: item.attachments,
				category: "Ragging",
				description: item.complainDescription,
				location: item.location,
				involvedParties: item.involvedParties,
				readStatus: item.readStatus,
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
			} as AnonymousComplaint;
	}
};

export const getComplaints = async (
	category: ComplaintCategory
): Promise<Complaint[]> => {
	try {
		const response = await api.get<{ complaints: any[] }>(
			`/complain/get-complaints/${category}`
		);
		console.log("Complaints:", response.data.complaints);
		return response.data.complaints.map(mapComplaint);
	} catch (error) {
		console.error("Error fetching complaints:", error);
		throw error;
	}
};

export const updateComplaint = async (
	category: ComplaintCategory,
	updateData: UpdateComplaint,
	csrfToken
): Promise<Complaint> => {
	try {
		console.log("Updating complaint:", updateData);
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
	csrfToken
): Promise<void> => {
	try {
		console.log("Deleting complaints:", deleteData.complainId);
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

export const getComplaintsByDateRange = async (
	category: ComplaintCategory,
	startDate: string,
	endDate: string
): Promise<Complaint[]> => {
	try {
		console.log("Fetching complaints by date range:", startDate, " ", endDate);
		const response = await api.get<{ complaints: any[] }>(
			`/complain/get-complaints-date/${category}?startDate=${startDate}&endDate=${endDate}`
		);
		console.log("Complaints by date range:", response.data.complaints);
		return response.data.complaints.map(mapComplaint);
	} catch (error) {
		console.error("Error fetching complaints by date range:", error);
		throw error;
	}
};
