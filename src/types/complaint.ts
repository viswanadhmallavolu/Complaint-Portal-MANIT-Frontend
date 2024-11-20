export type ComplaintCategory = 'Hostel' | 'Academic' | 'Medical' | 'Infrastructure' | 'Ragging' | 'Anonymous';

export type HostelComplaintType = 
  | 'maintenance'
  | 'hygiene'
  | 'security'
  | 'mess'
  | 'bathroom'
  | 'room'
  | 'noise'
  | 'other';

interface BaseComplaint {
  id: string;
  status: 'pending' | 'in-progress' | 'resolved';
  dateSubmitted: string;
  attachments: string[];
  category: ComplaintCategory;
  readStatus: 'Not viewed' | 'Viewed';
  roomNumber?: string;
  department?: string;
  landmark?: string;
}

export interface HostelComplaint extends BaseComplaint {
  category: 'Hostel';
  scholarNumber: string;
  studentName: string;
  hostelNumber: string;
  roomNumber: string;
  complaintType: HostelComplaintType;
  description: string;
}

export interface MedicalComplaint extends BaseComplaint {
  category: 'Medical';
  scholarNumber: string;
  studentName: string;
  department: string;
  description: string;
}

export interface AcademicComplaint extends BaseComplaint {
  category: 'Academic';
  scholarNumber: string;
  studentName: string;
  department: string;
  description: string;
}

export interface InfrastructureComplaint extends BaseComplaint {
  category: 'Infrastructure';
  scholarNumber: string;
  studentName: string;
  landmark: string;
  description: string;
}

export interface AnonymousComplaint extends BaseComplaint {
  category: 'Anonymous';
  description: string;
}

export interface RaggingComplaint extends BaseComplaint {
  category: 'Ragging';
  description: string;
  location?: string;
  involvedParties?: string;
}

export type Complaint = 
  | HostelComplaint 
  | MedicalComplaint 
  | AcademicComplaint 
  | InfrastructureComplaint 
  | AnonymousComplaint
  | RaggingComplaint;

export interface UpdateComplaint {
  complainId: string;
  roomNumber?: string;
  updates: Partial<Complaint> 
}

export interface DeleteComplaint {
  complainId: string;
}

