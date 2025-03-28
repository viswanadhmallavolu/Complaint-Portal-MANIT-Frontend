export interface HostelStats {
    _id: string;
    total: number;
    resolved: number;
    unresolved: number;
    resolutionRate: number;
  }
  
  export interface TrendingComplaint {
    complainType: string;
    count: number;
  }
  
  export interface COWDashboardData {
    hostelStats: HostelStats[];
    bestMaintainedHostel: HostelStats;
    trendingComplaintTypes: {
      [key: string]: TrendingComplaint[];
    };
  }
  
  export interface CategoryStats {
    _id: string;
    total: number;
    resolved: number;
    pending: number;
    resolutionRate: number;
  }
  
  export interface OverallStats {
    total: number;
    resolved: number;
    pending: number;
    avgResponseTime: number;
  }
  
  export interface WardenDashboardData {
    overall: OverallStats;
    categoryStats: CategoryStats[];
    bestMaintainedCategory: CategoryStats;
    worstMaintainedCategory: CategoryStats;
  }