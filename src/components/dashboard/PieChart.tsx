import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Interaction, ChartOptions } from 'chart.js';
import { ComplaintData } from '../../types/analytics';
import { useState } from 'react';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Tooltip, Legend, ChartDataLabels);

interface PieChartProps {
    data: ComplaintData[];
}

export const PieChart = ({ data }: PieChartProps) => {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    const chartData = {
        labels: data.map(item => item.category),
        datasets: [
            {
                data: data.map(item => item.total),
                backgroundColor: [
                    '#FF6384',
                    '#36A2EB',
                    '#FFCE56',
                    '#4BC0C0',
                    '#9966FF',
                    '#FF9F40'
                ],
                hoverBackgroundColor: [
                    '#FF4F70',
                    '#2F8FD8',
                    '#FFB93F',
                    '#3AA7A7',
                    '#8852FF',
                    '#FF8B26'
                ],
                borderWidth: 2,
                borderColor: '#ffffff',
                hoverOffset: 10,
            }
        ]
    };

    const options: ChartOptions<'pie'> = {
        plugins: {
            legend: {
                position: 'right' as const,
                labels: {
                    // Custom generateLabels function removed
                }
            },
            tooltip: {
                enabled: true,
                backgroundColor: 'rgba(0,0,0,0.7)',
                titleFont: { size: 16 },
                bodyFont: { size: 14 },
                callbacks: {
                    label: (context: any) => {
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const value = context.raw;
                        const percentage = Math.round((value / total) * 100);
                        return `${context.label}: ${value} (${percentage}%)`;
                    }
                }
            },
            datalabels: {
                formatter: (value, context) => {
                    const dataset = context.chart.data.datasets[0];
                    const total = dataset.data.reduce((acc: number, x) => acc + (x as number), 0);
                    return `${Math.round((value / total) * 100)}%`;
                },
                color: '#fff',
                font: { weight: 'bold' }
            }
        },
        animation: {
            animateRotate: true,
            animateScale: true,
            duration: 1000,
            easing: 'easeOutCubic'
        },
        responsive: true,
        maintainAspectRatio: false,
        onClick: (evt: any, elements: any) => {
            if (elements.length > 0) {
                const index = elements[0].index;
                setActiveIndex(index === activeIndex ? null : index);
            }
        },
        onHover: (evt: any, elements: any) => {
            evt.native.target.style.cursor = elements.length ? 'pointer' : 'default';
        }
    };

    return (
        <div className="h-[400px] w-full shadow-lg rounded-lg p-4 bg-white">
            <Pie
                data={chartData}
                options={options}
                className={`transition-transform duration-300 ${activeIndex !== null ? 'transform scale-105' : ''}`}
            />
            {activeIndex !== null && (
                <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold">{data[activeIndex].category}</h3>
                    <p className="text-gray-600">Total: {data[activeIndex].total}</p>
                </div>
            )}
        </div>
    );
};