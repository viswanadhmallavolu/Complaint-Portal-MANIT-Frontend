import React from 'react';

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.ElementType;
    description?: string;
    bgColor?: string;
    iconColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
    title,
    value,
    icon: Icon,
    description,
    bgColor = 'bg-gray-100',
    iconColor = 'text-gray-500'
}) => {
    return (
        <div className={`${bgColor} rounded-lg p-6 transition-all hover:scale-105`}>
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
                    {description && (
                        <p className="text-sm text-gray-600 mt-1">{description}</p>
                    )}
                </div>
                <div className={`${iconColor} p-3 rounded-full`}>
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};
