import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { HostelStats } from '../../../../types/dashboard';

interface PieChartComponentProps {
    stats: HostelStats[];
}

export const PieChartComponent: React.FC<PieChartComponentProps> = ({ stats }) => {
    // Function to get a fixed color based on the hostel number.
    const getHostelColor = (hostelId: string) => {
        // Remove the "H" prefix and parse the number.
        const hostelNumber = parseInt(hostelId.replace("H", ""));
        const colorMapping: { [key: number]: string } = {
            1: "#0088FE",
            2: "#00C49F",
            3: "#FFBB28",
            4: "#FF8042",
            5: "#8884D8",
            6: "#82CA9D",
            7: "#A4DE6C",
            8: "#D0ED57",
            9: "#FFC658",
            10: "#B9CDE5",
            11: "#FF7F50",
            12: "#87CEFA"
        };
        return colorMapping[hostelNumber] || "#000000"; // fallback color if hostel number not in mapping
    };

    const data = stats.map(stat => ({
        name: stat._id,
        value: stat.total,
    }));

    return (
        <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={getHostelColor(entry.name)} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
