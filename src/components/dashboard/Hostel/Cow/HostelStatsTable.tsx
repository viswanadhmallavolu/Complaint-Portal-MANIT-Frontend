import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { ComplaintTable } from '../ComplainTable';
import { HostelStats } from '../../../../types/dashboard';

interface HostelStatsTableProps {
  stats: HostelStats[];
}

export const HostelStatsTable: React.FC<HostelStatsTableProps> = ({ stats }) => {
  const columnHelper = createColumnHelper<HostelStats>();

  const columns = [
    columnHelper.accessor('_id', {
      header: 'Hostel',
      cell: info => {
        const hostelId = info.getValue();
        return (
          <div className="font-medium text-gray-900">
            {hostelId}
          </div>
        );
      },
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: info => (
        <div className="font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('resolved', {
      header: 'Resolved',
      cell: info => (
        <div className="text-green-600 font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('unresolved', {
      header: 'Pending',
      cell: info => (
        <div className="text-orange-500 font-medium">
          {info.getValue()}
        </div>
      ),
    }),
    columnHelper.accessor('resolutionRate', {
      header: 'Resolution Rate',
      cell: info => {
        const rate = info.getValue() * 100;
        return (
          <div className="flex items-center gap-2">
            <div
              className="h-2 rounded-full bg-blue-100 w-24 overflow-hidden"
            >
              <div
                className="h-full bg-blue-500 rounded-full"
                style={{ width: `${rate}%` }}
              />
            </div>
            <span className="font-medium text-sm">
              {rate.toFixed(1)}%
            </span>
          </div>
        );
      },
    }),
  ];

  // Sort stats by extracting the numeric part from hostel ID and converting to number
  const sortedStats = [...stats].sort((a, b) => {
    const aNum = parseInt(a._id.replace(/\D/g, ''));
    const bNum = parseInt(b._id.replace(/\D/g, ''));
    return aNum - bNum;
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-full">
        <ComplaintTable
          data={sortedStats}
          columns={columns}
        />
      </div>
    </div>
  );
};