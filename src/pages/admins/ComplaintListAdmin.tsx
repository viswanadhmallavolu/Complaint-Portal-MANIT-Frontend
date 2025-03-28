import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Search, Trash2 } from 'lucide-react';
import ComplaintCard from '../../components/ComplaintCard/admin/ComplaintCard-admin';
import { getComplaintsByDateRange_Admin, updateComplaintStatusAdmin, getComplaintStatistics_CategoryWise, updateComplaintRemarksAdmin } from '../../services/apiService';
import { Complaint, ComplaintCategory, ReadStatus, ComplaintFilters } from '../../types/complaint';
import ComplaintHeader from '../../components/ComplaintHeader';
import ErrorBoundary from '../../components/ErrorBoundary';
import { VariableSizeList as List } from 'react-window';
import { calculateItemHeight } from '../../components/Utility/heightCalculator';
import { toast } from 'react-toastify';


const ComplaintList = () => {
    const { category } = useParams<{ category: string }>();
    const navigate = useNavigate();
    

    const isDefaultFilters = () => {
        const defaultFilters: ComplaintFilters = {
            startDate: '',
            endDate: new Date().toISOString().split('T')[0],
            complaintType: '',
            scholarNumbers: [],
            readStatus: '',
            status: '',
            hostelNumber: '',
            complaintIds: []
        };
        return JSON.stringify(filters) === JSON.stringify(defaultFilters);
    };

    const [filters, setFilters] = useState<ComplaintFilters>(() => {
        const savedFilters = localStorage.getItem('complaintFilters');
        const defaultFilters = {
            startDate: '',
            endDate: new Date().toISOString().split('T')[0],
            complaintType: '',
            scholarNumbers: [],
            readStatus: '',
            status: '',
            hostelNumber: '',
            complaintIds: []
        };
        return savedFilters ? JSON.parse(savedFilters) : defaultFilters;
    });

    const [lastSeenId, setLastSeenId] = useState<string | null>(() => {
        return localStorage.getItem('lastSeenId') || null;
    });

    const [complaints, setComplaints] = useState<Complaint[]>(() => {
        const savedComplaints = localStorage.getItem('complaints');
        if (savedComplaints && !isDefaultFilters()) {
            return [];
        }
        return savedComplaints ? JSON.parse(savedComplaints) : [];
    });

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

    // Add window resize listener
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (listRef.current) {
                listRef.current.resetAfterIndex(0);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const memoizedStatistics = useMemo(() => statistics, [statistics]);

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
        if (!category) return;
        try {
            const stats = await getComplaintStatistics_CategoryWise(category);
            setStatistics(stats);
        } catch (err) {
            handleError(err, 'Failed to fetch statistics.');
        }
    }, [category, handleError]);

    const fetchComplaints = useCallback(async () => {
        if (!category || loading || !hasMore) return;

        setLoading(true);

        try {
            const { complaints: newComplaints, nextLastSeenId } = await getComplaintsByDateRange_Admin(
                category.toLowerCase() as ComplaintCategory,
                filters.startDate,
                filters.endDate,
                20,
                lastSeenId || '',
                filters
            );

            setComplaints(prev => lastSeenId ? [...prev, ...newComplaints] : newComplaints);
            setLastSeenId(nextLastSeenId);
            setHasMore(!!nextLastSeenId);

            localStorage.setItem('complaints', JSON.stringify(newComplaints));
            localStorage.setItem('lastSeenId', nextLastSeenId || '');
        } catch (err) {
            handleError(err, 'Failed to fetch complaints.');
            setHasMore(false);
        } finally {
            setLoading(false);
        }
    }, [category, filters, lastSeenId, loading, hasMore, handleError]);

    useEffect(() => {
        fetchStatistics();
    }, [fetchStatistics]);

    

    useEffect(() => {
        if (category) {
            setComplaints([]);
            setLastSeenId(null);
            setHasMore(true);
            setExpandedItems(new Set());

            localStorage.removeItem('complaints');
            localStorage.removeItem('lastSeenId');

            const timer = setTimeout(() => {
                fetchComplaints();
            }, 100);

            return () => {
                clearTimeout(timer);
                setLoading(false);
            };
        }
    }, [category]);

    useEffect(() => {
        return () => {
            localStorage.removeItem('lastSeenId');
            localStorage.removeItem('complaints');
            localStorage.removeItem('complaintFilters');
        };
    }, []);

    const handleStatusUpdate = useCallback(async (complaintId: string, updates: Partial<Complaint>) => {
        try {
            if (category) {
                await updateComplaintStatusAdmin(category, complaintId, updates.status || updates.readStatus || null);
            }
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, ...updates } as Complaint : c)
            );
        } catch (err) {
            handleError(err, 'Failed to update complaint.');
        }
    }, [category, handleError]);

    const handleRemarksUpdate = useCallback(async (complaintId: string, AdminRemarks: any, AdminAttachments: any) => {
        try {
            if (category) {
                await updateComplaintRemarksAdmin(category, complaintId, AdminRemarks, AdminAttachments);
            }
            setComplaints(prev =>
                prev.map(c => c.id === complaintId ? { ...c, AdminRemarks, AdminAttachments } as Complaint : c)
            );
        } catch (err) {
            handleError(err, 'Failed to update complaint.');
        }
    }, [category, handleError]);

    const handleFilterUpdate = useCallback((newFilters: Partial<ComplaintFilters>) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    }, []);

    const handleApplyFilters = useCallback(async () => {
        setComplaints([]);
        setLastSeenId(null);
        setHasMore(true);
        localStorage.setItem('complaintFilters', JSON.stringify(filters));
        localStorage.removeItem('lastSeenId');
        localStorage.removeItem('complaints');

        setLoading(true);
        try {
            const { complaints: newComplaints, nextLastSeenId } = await getComplaintsByDateRange_Admin(
                category?.toLowerCase() as ComplaintCategory,
                filters.startDate,
                filters.endDate,
                20,
                '',
                filters
            );
            setComplaints(newComplaints);
            setLastSeenId(nextLastSeenId);
            setHasMore(!!nextLastSeenId);

            localStorage.setItem('complaints', JSON.stringify(newComplaints));
            if (nextLastSeenId) {
                localStorage.setItem('lastSeenId', nextLastSeenId);
            }
        } catch (err) {
            handleError(err, 'Failed to fetch complaints.');
        } finally {
            setLoading(false);
        }
    }, [category, filters, handleError]);

    const clearFilters = useCallback(() => {
        const defaultFilters: ComplaintFilters = {
            startDate: '',
            endDate: new Date().toISOString().split('T')[0],
            complaintType: '',
            scholarNumbers: [''],
            readStatus: '',
            status: '',
            hostelNumber: '' as const,
            complaintIds: []
        };
        setFilters(defaultFilters);
        setComplaints([]);
        setLastSeenId(null);
        setHasMore(true);

        localStorage.removeItem('complaintFilters');
        localStorage.removeItem('lastSeenId');
        localStorage.removeItem('complaints');

        fetchComplaints();
    }, [fetchComplaints]);

    const handleBackToCategories = useCallback(() => {
        localStorage.removeItem('complaintFilters');
        localStorage.removeItem('lastSeenId');
        localStorage.removeItem('complaints');
        navigate('/admin/complaints');
    }, [navigate]);

    const handleViewClick = async (complaint: Complaint) => {
        if (complaint.readStatus !== 'Viewed') {
            await handleStatusUpdate(complaint.id, { readStatus: ReadStatus.Viewed });
        }
        setLoading(false);
    };

    const toggleExpand = useCallback((index: number, complaintId: string) => {
        const complaint = complaints.find(c => c.id === complaintId);
        if (!complaint) return;
        handleViewClick(complaint);

        setExpandedItems(prev => {
            const newSet = new Set(prev);
            if (newSet.has(complaintId)) {
                newSet.delete(complaintId);
            } else {
                newSet.add(complaintId);
            }
            return newSet;
        });

        // Reset the list after a small delay to ensure proper rendering
        setTimeout(() => {
            if (listRef.current) {
                listRef.current.resetAfterIndex(index);
            }
        }, 50);
    }, [complaints, handleViewClick]);

    const getItemSize = useCallback((index: number) => {
        const complaint = complaints[index];
        if (!complaint) return 0;

        const hasAttachments = Boolean(
            (complaint.attachments && complaint.attachments.length > 0) ||
            (complaint.AdminAttachments && complaint.AdminAttachments.length > 0)
        );

        return calculateItemHeight(
            expandedItems.has(complaint.id),
            windowWidth,
            hasAttachments
        );
    }, [expandedItems, complaints, windowWidth]);

    const handleItemsRendered = useCallback(({ visibleStopIndex }) => {
        if (hasMore && visibleStopIndex >= complaints.length - 1 && !loading) {
            fetchComplaints();
        }
    }, [hasMore, complaints.length, loading, fetchComplaints]);

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
                    category={category || ''}
                    loading={loading}
                    isFilterOpen={isFilterOpen}
                    statistics={memoizedStatistics}
                    onBackClick={handleBackToCategories}
                    onFilterClick={() => setIsFilterOpen(prev => !prev)}
                    filters={filters}
                    onFilterUpdate={handleFilterUpdate}
                    onApplyFilters={handleApplyFilters}
                    setStatistics={setStatistics}
                />

                {complaints.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <div className="max-w-md mx-auto">
                            <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                            <p className="text-gray-600 text-lg">No complaints found in this category.</p>
                        </div>
                    </div>
                ) : (
                    <div className="h-[calc(100vh-200px)]">
                        <List
                            ref={listRef}
                            height={window.innerHeight - 200}
                            itemCount={hasMore ? complaints.length + 1 : complaints.length}
                            itemSize={getItemSize}
                            width="100%"
                            onItemsRendered={handleItemsRendered}
                            className="space-y-8" // Increased spacing between items
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
                                            paddingBottom: '32px', // Increased bottom padding
                                            height: 'auto', // Allow content to determine height
                                            maxHeight: style.height as number - 48, // Subtract padding
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

const MemoizedComplaintList = React.memo(ComplaintList);

const ComplaintListAdmin = React.memo(() => (
    <ErrorBoundary>
        <MemoizedComplaintList />
    </ErrorBoundary>
));

export default ComplaintListAdmin;