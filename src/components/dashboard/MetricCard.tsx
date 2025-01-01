import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import React from 'react';

interface MetricCardProps {
    title: string;
    value: string;
    trend: number;
    subValue?: string;
    icon: React.ReactNode;
    colorClass?: string;
}

export const MetricCard = ({
    title,
    value,
    trend,
    subValue,
    icon,
    colorClass = "from-blue-500 to-blue-600"
}: MetricCardProps) => {
    return (
        <div className={`rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl
      bg-gradient-to-br ${colorClass} text-white`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">{title}</h3>
                <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm">{icon}</div>
            </div>

            <div className="flex items-baseline">
                <p className="text-2xl font-bold">{value}</p>
                <span className={`ml-2 flex items-center text-sm ${trend >= 0 ? 'text-green-200' : 'text-red-200'
                    }`}>
                    {trend >= 0 ? <ArrowUpIcon size={16} /> : <ArrowDownIcon size={16} />}
                    {Math.abs(trend)}%
                </span>
            </div>

            {subValue && (
                <p className="mt-2 text-sm text-white/80">{subValue}</p>
            )}
        </div>
    );
};