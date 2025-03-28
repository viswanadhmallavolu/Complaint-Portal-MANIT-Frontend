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
  | "B.Plan"
  | "Dual Degree";

// Hostel types
export type HostelComplaintType = 
  | 'maintenance'
  | 'hygiene'
  | 'security'
  | 'mess'
  | 'bathroom'
  | 'room'
  | 'noise'
  |'internet'
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
  readStatus: string;
  description: string;
  roomNumber?: string ;
  department?: string;
  landmark?: string;
  createdAt:Date;
  AdminRemarks?:string;
  resolvedAt?: Date; 
  AdminAttachments?: string[]; 
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
  stream : Stream;
  year : Year;
}

export interface MedicalComplaint extends BaseComplaint {
  category: 'Medical';
  scholarNumber: string;
  studentName: string;
  department: string;
  complaintType: MedicalComplaintType;
  stream : Stream;
  year : Year;
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
  scholarNumber: string;
  stream : Stream;
  year : Year;
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
  readStatus?: ReadStatus;
  stream?:Stream;
  year?:Year;
}

export interface DeleteComplaint {
  complainId: string;
}

export type HostelNumber = 
| 'H1'
| 'H2'
| 'H3'
| 'H4'
| 'H5'
| 'H6'
| 'H7'
| 'H8'
| 'H9'
| 'H10'
| 'H11'
| 'H12';

export interface ComplaintFilters {
    startDate: string;
    endDate: string;
    complaintType: string;
    scholarNumbers: string[];
    readStatus: string;
    status: string;
    hostelNumber: string;
    complaintIds: string[];
}

