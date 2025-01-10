import React, { useEffect, useState } from 'react';
import { Search, AlertCircle, Loader2, Info } from 'lucide-react';
import { searchComplaint } from '../../services/apiService';
import { Complaint } from '../../types/complaint';
import { AttachmentGallery } from '../../components/ComplaintCard/AttachmentGallery';
import { CiCircleInfo } from "react-icons/ci";

function SearchPage() {
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showTooltip, setShowTooltip] = useState(false); // Add this state

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let extractedCategory = '';
      const firstChar = complaintId[0]?.toUpperCase() || '';
      switch (firstChar) {
        case 'A': extractedCategory = 'Academic'; break;
        case 'B': extractedCategory = 'Administration'; break;
        case 'C': extractedCategory = 'Hostel'; break;
        case 'D': extractedCategory = 'Infrastructure'; break;
        case 'E': extractedCategory = 'Medical'; break;
        case 'F': extractedCategory = 'Ragging'; break;
        default: extractedCategory = 'Hostel';
      }
      const trimmedId = complaintId.slice(1);
      const data = await searchComplaint(trimmedId, extractedCategory);
      setComplaint(data);
      
    } catch (err) {
      setError('Complaint not found or you do not have permission to view it.');
      setComplaint(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(()=>{
    
      console.log("This is the error : " ,error);
    
  },[error])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-yellow-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="px-6 py-8 md:p-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center relative group">
              <Search className="w-8 h-8 mr-3 text-blue-600" />
              Search Complaint
              <div 
                className="relative inline-block"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                onClick={() => setShowTooltip(!showTooltip)}
              >
                <CiCircleInfo 
                  className="w-5 h-5 ml-2 text-gray-500 cursor-pointer" 
                />
                {showTooltip && (
                  <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 sm:translate-x-0 sm:left-0 w-48 sm:w-64 p-2 bg-gray-800 text-white text-sm rounded-lg shadow-lg z-10">
                    This section is helpful for quick search of the submitted complaints. Please enter the valid VALID UID which is available in your email.
                  </div>
                )}
              </div>
            </h1>

            <form onSubmit={handleSearch} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Complaint ID
                  </label>
                  <input
                    type="text"
                    value={complaintId}
                    onChange={(e) => setComplaintId(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="Enter complaint ID"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors flex items-center justify-center"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </form>

            {error && (
              <div className="mt-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            )}

            {complaint && (
              <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-6 py-5 bg-gray-50 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Complaint Details</h3>
                </div>
                <div className="px-6 py-5 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">ID</p>
                      <p className="mt-1 text-sm text-gray-900">{complaint.id}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Category</p>
                      <p className="mt-1 text-sm text-gray-900">{complaint.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Status</p>
                      <span className={`inline-flex mt-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Created At</p>
                      <p className="mt-1 text-sm text-gray-900">
                        {new Date(complaint.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p className="mt-1 text-sm text-gray-900">{complaint.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Description</p>
                    <p className="mt-1 text-sm text-gray-900">{complaint.description}</p>
                  </div>
                </div>
                {(complaint.attachments?.length > 0  ) && (
                  <div className="px-6 py-5">
                    <AttachmentGallery
                      attachments={complaint.attachments ?? []}
                      adminAttachments={complaint.AdminAttachments ?? []}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchPage;