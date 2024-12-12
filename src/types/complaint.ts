// Common types
export type ComplaintCategory = 
  | 'Hostel' 
  | 'Academic' 
  | 'Medical' 
  | 'Infrastructure' 
  | 'Ragging' 
  | 'Administration' 
  | 'Anonymous';

export type ComplaintStatus = 'pending' | 'in-progress' | 'resolved';
export enum ReadStatus {
  NotViewed = 'Not viewed',
  Viewed = 'Viewed'
}

// Academic types
export type AcademicComplaintType = 
  | 'Timetable'
  | 'Course'
  | 'Faculty'
  | 'Other';

export type Year = '1st' | '2nd' | '3rd' | '4th' | '5th';
export type Stream = 
  | "B.tech" 
  | "M.tech" 
  | "Phd" 
  | "MCA" 
  | "MBA" 
  | "B.Arch" 
  | "B.Plan";

// Hostel types
export type HostelComplaintType = 
  | 'maintenance'
  | 'hygiene'
  | 'security'
  | 'mess'
  | 'bathroom'
  | 'room'
  | 'noise'
  | 'Other';

// Medical types
export type MedicalComplaintType = 
  | 'Doctor'
  | 'Medicine'
  | 'Ambulance'
  | 'Other';

// Infrastructure types
export type InfrastructureComplaintType = 
  | 'Electricity'
  | 'Water'
  | 'Internet'
  | 'Bus'
  | 'Classroom'
  | 'Library'
  | 'Sports'
  | 'Lab'
  | 'Other';

// Administration types
export type AdministrationComplaintType =
  | 'Documents'
  | 'Accounts'
  | 'Scholarship'
  | 'Details'
  | 'Other';

  interface Attachment {
    url: string;
  }

// Base complaint interface
interface BaseComplaint {
  id: string;
  status: ComplaintStatus;
  dateSubmitted: string;
  attachments:  Attachment[];
  category: ComplaintCategory;
  readStatus: ReadStatus;
  description: string;
  roomNumber?: string;
  department?: string;
  landmark?: string;
}

// Specific complaint interfaces
export interface HostelComplaint extends BaseComplaint {
  category: 'Hostel';
  scholarNumber: string;
  studentName: string;
  hostelNumber: string;
  roomNumber: string;
  complaintType: HostelComplaintType;
}

export interface AdministrationComplaint extends BaseComplaint {
  category: 'Administration';
  scholarNumber: string;
  studentName: string;
  department: string;
  complaintType: AdministrationComplaintType;
}

export interface MedicalComplaint extends BaseComplaint {
  category: 'Medical';
  scholarNumber: string;
  studentName: string;
  department: string;
  complaintType: MedicalComplaintType;
}

export interface AcademicComplaint extends BaseComplaint {
  category: 'Academic';
  scholarNumber: string;
  studentName: string;
  department: string;
  complaintType: AcademicComplaintType;
  year: Year;
  stream: Stream;
}

export interface InfrastructureComplaint extends BaseComplaint {
  category: 'Infrastructure';
  scholarNumber: string;
  studentName: string;
  landmark: string;
  complaintType: InfrastructureComplaintType;
}

export interface AnonymousComplaint extends BaseComplaint {
  category: 'Anonymous';
}

export interface RaggingComplaint extends BaseComplaint {
  category: 'Ragging';
  location?: string;
  involvedParties?: string;
}

// Union type for all complaints
export type Complaint = 
  | HostelComplaint 
  | MedicalComplaint 
  | AcademicComplaint 
  | InfrastructureComplaint 
  | AdministrationComplaint
  | AnonymousComplaint
  | RaggingComplaint;

// Update and Delete interfaces
export interface UpdateComplaint {
  complainId: string;
  roomNumber?: string;
  updates: Partial<Complaint>;
}

export interface DeleteComplaint {
  complainId: string;
}