export const COMPLAINT_CATEGORIES = [
    'Hostel',
    'Academic',
    'Administration',
    'Ragging',
    'Medical',
    'Infrastructure'
  ] as const;
  
  export type ComplaintCategory = typeof COMPLAINT_CATEGORIES[number];