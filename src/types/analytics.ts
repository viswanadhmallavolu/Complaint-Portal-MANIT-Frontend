export interface CategoryDetails {
    _id: string;
    total: number;
    viewed: number;
    resolved: number;
  }
  
  export interface CategoryOverall {
    total: number;
    viewed: number;
    resolved: number;
  }
  
  export interface CategoryData {
    details: CategoryDetails[];
    overall: CategoryOverall;
  }
  
  export interface AnalyticsData {
    [key: string]: CategoryData;
  }
  
  export interface ComplaintData {
    category: string;
    total: number;
    viewed: number;
    resolved: number;
  }