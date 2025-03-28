import React, {
    useEffect,
    useState,
    useCallback,
    useRef,
    useMemo
} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintsByDateRange_Admin, updateComplaintStatusAdmin, getComplaintStatistics_CategoryWise, updateComplaintRemarksAdmin } from '../services/apiService';
import ErrorBoundary from '../components/ErrorBoundary';
import ComplaintHeader from '../components/ComplaintHeader';
import ComplaintCard from '../components/ComplaintCard/admin/ComplaintCard-admin';
import { Complaint, ComplaintFilters, ReadStatus } from '../types/complaint';
import { ComplaintCategory } from '../types/complaint';
import { toast } from 'react-toastify';
import { VariableSizeList as List } from 'react-window';
import { calculateItemHeight } from '../components/Utility/heightCalculator';

const RoleBasedPage = () => {
    const { role } = useParams<{ role: string }>();
    const WARDEN_ROLES = ["H1", "H2", "H3", "H4", "H5", "H6", "H7", "H8", "H9", "H10", "H11", "H12"];
    let category = '';
    if (role === 'cow' || (role && WARDEN_ROLES.includes(role))) {
        category = 'hostel';
    } else if (role === 'internet_admin' || role === 'electric_admin') {
        category = 'Infrastructure';
    } else if (role === 'medical_admin') {
        category = 'Medical';
    }
    const navigate = useNavigate();

    const [filters, setFilters] = useState<ComplaintFilters>({
        startDate: '',
        endDate: new Date().toISOString().split('T')[0],
        complaintType: '',
        scholarNumbers: [],
        readStatus: '',
        status: '',
        hostelNumber: '',
        complaintIds: []
    });
    const [appliedFilters, setAppliedFilters] = useState<ComplaintFilters>(filters);

    const [lastSeenId, setLastSeenId] = useState<string | null>(null);
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
    const listRef = useRef<List>(null);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [statistics, setStatistics] = useState({
        totalComplaints: 0,
        resolvedComplaints: 0,
        unresolvedComplaints: 0,
        viewedComplaints: 0,
        notViewedComplaints: 0,
    });
    const [filterVersion, setFilterVersion] = useState(0); // Added filterVersion state

    const handleAuthError = useCallback(() => {
        localStorage.removeItem('auth');
        navigate('/');
    }, [navigate]);

    const handleError = useCallback((err: any, fallbackMessage: string) => {
        if (err.response?.status === 401) {
            handleAuthError();
        } else {
            const message = err.response?.data?.message || err.message || fallbackMessage;
            toast.error(message);
        }
    }, [handleAuthError]);

    const fetchStatistics = useCallback(async () => {
        if (!role) return;
        try {
            const stats = await getComplaintStatistics_CategoryWise(category.toLowerCase() as ComplaintCategory);
            setStatistics(stats);
        } catch (err) {
            handleError(err, 'Failed to fetch statistics.');
        }
    }, [role, handleError, category]);

    const fetchComplaints = useCallback(async () => {
        if (!role) return;
        setLoading(true);

        try {
            const { complaints: newComplaints, nextLastSeenId } = await getComplaintsByDateRange_Admin(
                category.toLowerCase() as ComplaintCategory,
                appliedFilters.startDate,
                appliedFilters.endDate,
                20,
                lastSeenId || '',
                appliedFilters
            );

            setComplaints(prev => lastSeenId ? [...prev, ...newComplaints] : newComplaints);
            setLastSeenId(nextLastSeenId);
            setHasMore(!!nextLastSeenId);
        } catch (err) {
            handleError(err, 'Failed to fetch complaints.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [role, appliedFilters, lastSeenId, loading, hasMore, handleError, category]);

    useEffect(() => {
        if (!role) return;
        setComplaints([]);
        setLastSeenId(null);
        setHasMore(true);
        setExpandedItems(new Set());
        fetchComplaints();
    }, [role, filterVersion, appliedFilters]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    const handleStatusUpdate = useCallback(async (complaintId: string, updates: Partial<Complaint>) => {
        try {
            await updateComplaintStatusAdmin(category as ComplaintCategory, complaintId, updates.status || updates.readStatus || '');
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, ...updates } as Complaint : c)
            );
        } catch (err) {
            handleError(err, 'Failed to update complaint.');
        }
    }, [role, handleError]);

    const handleRemarksUpdate = useCallback(async (complaintId: string, AdminRemarks: any, AdminAttachments: any) => {
        console.log("handleRemarksUpdate called with complaintId:", complaintId);
        try {
            await updateComplaintRemarksAdmin(category as ComplaintCategory, complaintId, AdminRemarks, AdminAttachments);
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, AdminRemarks, AdminAttachments } : c)
            );
        } catch (err) {
            handleError(err, 'Failed to update remarks.');
        }
    }, [role, handleError]);

    const handleApplyFilters = useCallback(() => {
        setAppliedFilters(filters);
        setFilterVersion(prev => prev + 1); // Increment filterVersion
    }, [filters]);

    if (loading && complaints.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 sm:p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <ComplaintHeader
                    // Modified: Pass computed category and role to header so that warden users cannot change hostel number
                    category={category}
                    role={role}
                    loading={loading}
                    isFilterOpen={isFilterOpen}
                    statistics={statistics}
                    onBackClick={() => navigate('/')}
                    onFilterClick={() => setIsFilterOpen(prev => !prev)}
                    filters={filters}
                    onFilterUpdate={(newFilters) =>
                        setFilters(prev => ({ ...prev, ...newFilters }))
                    }
                    onApplyFilters={handleApplyFilters}
                    setStatistics={setStatistics}
                />

                {complaints.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <p className="text-gray-600 text-lg">No complaints found for this role.</p>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-200px)]">
                        <List
                            ref={listRef}
                            height={window.innerHeight - 200}
                            itemCount={hasMore ? complaints.length + 1 : complaints.length}
                            itemSize={(index) => {
                                const complaint = complaints[index];
                                if (!complaint) return 0;
                                const hasAttachments = Boolean(
                                    complaint.attachments?.length || complaint.AdminAttachments?.length
                                );
                                return calculateItemHeight(
                                    expandedItems.has(complaint.id),
                                    windowWidth,
                                    hasAttachments
                                );
                            }}
                            onItemsRendered={({ visibleStopIndex }) => {
                                if (hasMore && visibleStopIndex >= complaints.length - 1 && !loading) {
                                    fetchComplaints();
                                }
                            }}
                            width="100%"
                            overscanCount={5}
                        >
                            {({ index, style }) => {
                                if (index >= complaints.length) {
                                    return (
                                        <div style={style} key="loading">
                                            <div className="flex justify-center items-center h-16">
                                                {loading ? (
                                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                                                ) : (
                                                    <p className="text-gray-500">No more complaints.</p>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                const complaint = complaints[index];
                                return (
                                    <div
                                        style={{
                                            ...style,
                                            paddingTop: '16px',
                                            paddingBottom: '32px',
                                            height: 'auto',
                                            maxHeight: (style.height as number) - 48,
                                            transition: 'all 0.3s ease'
                                        }}
                                        key={complaint.id}
                                        className="relative"
                                    >
                                        <div className="h-full">
                                            <ComplaintCard
                                                complaint={complaint}
                                                onUpdate={handleStatusUpdate}
                                                onRemarksUpdate={handleRemarksUpdate}
                                            />
                                        </div>
                                    </div>
                                );
                            }}
                        </List>
                    </div>
                )}
            </div>
        </div>
    );
};

const MemoizedRoleBasedPage = React.memo(RoleBasedPage);

export default function RoleBasedPageWrapper() {
    return (
        <ErrorBoundary>
            <MemoizedRoleBasedPage />
        </ErrorBoundary>
    );
}