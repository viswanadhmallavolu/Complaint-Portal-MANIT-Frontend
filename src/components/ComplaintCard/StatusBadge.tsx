import React from 'react';

type Status = 'pending' | 'in-progress' | 'resolved';

interface StatusBadgeProps {
  status: Status;
}

const statusConfig = {
  pending: {
    className: 'bg-amber-100 text-amber-800 border border-amber-200',
    label: 'Pending'
  },
  'in-progress': {
    className: 'bg-blue-100 text-blue-800 border border-blue-200',
    label: 'In Progress'
  },
  resolved: {
    className: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
    label: 'Resolved'
  }
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const config = statusConfig[status] || {
    className: 'bg-gray-100 text-gray-800 border border-gray-200',
    label: 'Unknown'
  };
  
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};