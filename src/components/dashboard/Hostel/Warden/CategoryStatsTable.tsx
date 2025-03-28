import React from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { ComplaintTable } from '../ComplainTable';
import { CategoryStats } from '../../../../types/dashboard';

interface CategoryStatsTableProps {
  stats: CategoryStats[];
}

export const CategoryStatsTable: React.FC<CategoryStatsTableProps> = ({ stats }) => {
  const columnHelper = createColumnHelper<CategoryStats>();

  const columns = [
    columnHelper.accessor('_id', {
      header: 'Category',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('total', {
      header: 'Total',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('resolved', {
      header: 'Resolved',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('pending', {
      header: 'Pending',
      cell: info => info.getValue(),
    }),
    columnHelper.accessor('resolutionRate', {
      header: 'Resolution Rate',
      cell: info => `${(info.getValue() * 100).toFixed(1)}%`,
    }),
  ];

  return <ComplaintTable data={stats} columns={columns} />;
};