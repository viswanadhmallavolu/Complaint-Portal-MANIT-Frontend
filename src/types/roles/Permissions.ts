import { BaseUserRole, USER_ROLES } from './UserRole';

// Constants for complaint types
export const HOSTEL_COMPLAINT_TYPES = [
  'maintenance', 
  'hygiene', 
  'security', 
  'mess', 
  'bathroom', 
  'room', 
  'noise', 
  'internet', 
  'Other'
] as const;

export const MEDICAL_COMPLAINT_TYPES = ['Doctor', 'Medicine', 'Ambulance', 'Other'] as const;



// Helper function to create hostel admin mapping
const createHostelAdminMapping = (hostelNumber: string) => ({
  category: 'Hostel',
  hostelNumber,
  complaintTypes: HOSTEL_COMPLAINT_TYPES
});

// Generate all hostel admin mappings
const generateHostelAdminMappings = () => {
  const mappings: Record<string, any> = {};
  for (let i = 1; i <= 12; i++) {
    mappings[USER_ROLES[`H${i}_ADMIN`]] = createHostelAdminMapping(`H${i}`);
  }
  return mappings;
};

export const ROLEWISE_ACCESS_MAPPING = {
  [USER_ROLES.INTERNET_ADMIN]: {
    category: 'Infrastructure',
    complaintType: 'Internet'
  },
  [USER_ROLES.ELECTRIC_ADMIN]: {
    category: 'Infrastructure',
    complaintType: 'Electricity'
  },
  [USER_ROLES.MEDICAL_ADMIN]: {
    category: 'Medical',
    complaintTypes: MEDICAL_COMPLAINT_TYPES
  },
  [USER_ROLES.COW]: {
    category: 'Hostel',
    complaintTypes: HOSTEL_COMPLAINT_TYPES,
    allHostels: true
  },
  ...generateHostelAdminMappings()
};