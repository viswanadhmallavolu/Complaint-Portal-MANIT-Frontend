import React, { useState } from 'react';
import ComplaintSection from '../../components/Utility/ComplaintSection';

const ComplaintSearchAdmin: React.FC = () => {
    const [complaintId, setComplaintId] = useState('');
    const [complaint, setComplaint] = useState(null);

    return (
        <div className="container mx-auto px-4 py-8 mt-8 mb-8">
            <ComplaintSection
                complaintId={complaintId}
                setComplaintId={setComplaintId}
                complaint={complaint}
                setComplaint={setComplaint}
            />
        </div>
    );
};

export default ComplaintSearchAdmin;
