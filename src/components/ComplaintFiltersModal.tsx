import React, { useState } from 'react';
import Modal from './Modal';
import TagInput from './TagInput';
import { ComplaintFilters } from '../types/complaint';

interface ComplaintFiltersModalProps {
    isOpen: boolean;
    toggleModal: () => void;
    filters: ComplaintFilters;
    handleInputChange: (field: keyof ComplaintFilters) => React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
    onFilterUpdate: (filters: Partial<ComplaintFilters>) => void;
    handleApplyFilters: () => void;
    category: string;
    complaintTypesOptions: string[];
    allowHostelSelect: boolean; // New prop to control hostel number selection
}

const ComplaintFiltersModal: React.FC<ComplaintFiltersModalProps> = ({
    isOpen,
    toggleModal,
    filters,
    handleInputChange,
    onFilterUpdate,
    handleApplyFilters,
    category,
    complaintTypesOptions,
    allowHostelSelect
}) => {
    const [showAdvancedInputs, setShowAdvancedInputs] = useState(false);

    return (
        <Modal isOpen={isOpen} onClose={toggleModal}>
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-6">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-gray-800">Filter Complaints</h2>
                    <button
                        onClick={toggleModal}
                        className="text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        X
                    </button>
                </div>

                <div className="space-y-6">
                    {/* Date Range */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {['startDate', 'endDate'].map(key => (
                            <div className="space-y-2" key={key}>
                                <label className="block text-sm font-medium text-gray-700">
                                    {key === 'startDate' ? 'Start Date' : 'End Date'}
                                </label>
                                <input
                                    type="date"
                                    value={filters[key as keyof typeof filters] as string}
                                    onChange={handleInputChange(key as keyof ComplaintFilters)}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                                />
                            </div>
                        ))}
                    </div>

                    {/* Hostel Number (conditional) */}
                    {category === 'hostel' && allowHostelSelect && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Hostel Number
                            </label>
                            <select
                                value={filters.hostelNumber}
                                onChange={handleInputChange('hostelNumber')}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Hostel</option>
                                {Array.from({ length: 12 }, (_, i) => i + 1).map(num => (
                                    <option key={num} value={`H${num}`}>
                                        H{num}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Complaint Type */}
                    {(category !== 'internet_admin' && category !== 'electric_admin') && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Complaint Type
                            </label>
                            <select
                                value={filters.complaintType}
                                onChange={handleInputChange('complaintType')}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Select Type</option>
                                {complaintTypesOptions.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button
                        onClick={() => setShowAdvancedInputs(!showAdvancedInputs)}
                        className="mb-4 flex items-center text-blue-600 hover:text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        {showAdvancedInputs ? 'Hide Advanced Options' : 'Show Advanced Options'}
                    </button>

                    {showAdvancedInputs && (
                        <>
                            <TagInput
                                label="Scholar Numbers"
                                placeholder="Press Enter to add"
                                tags={filters.scholarNumbers}
                                onChange={(newTags) => onFilterUpdate({ scholarNumbers: newTags })}
                            />
                            <TagInput
                                label="Complaint IDs"
                                placeholder="Press Enter to add"
                                tags={filters.complaintIds ?? []}
                                onChange={(newTags) => onFilterUpdate({ complaintIds: newTags })}
                            />
                        </>
                    )}

                    {/* Status Filters */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Read Status
                            </label>
                            <select
                                value={filters.readStatus}
                                onChange={handleInputChange('readStatus')}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="Not viewed">Not Viewed</option>
                                <option value="Viewed">Viewed</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Resolution Status
                            </label>
                            <select
                                value={filters.status}
                                onChange={handleInputChange('status')}
                                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">All</option>
                                <option value="Pending">Pending</option>
                                <option value="Resolved">Resolved</option>
                            </select>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-4 mt-8 pt-4 border-t">
                        <button
                            onClick={toggleModal}
                            className="px-6 py-2.5 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleApplyFilters}
                            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm hover:shadow"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ComplaintFiltersModal;
