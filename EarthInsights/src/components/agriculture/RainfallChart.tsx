
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { useRainfallData } from '../../hooks/useRainfallData';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export const RainfallChart = () => {
    const { weeklyData, loading } = useRainfallData();

    if (loading) return <div className="h-full flex items-center justify-center text-neutral-400">Loading Rainfall History...</div>;

    const data = {
        labels: weeklyData.map(d => d.date),
        datasets: [
            {
                label: 'Precipitation (mm)',
                data: weeklyData.map(d => d.mm),
                backgroundColor: 'rgba(59, 130, 246, 0.6)', // Blue-500
                borderColor: 'rgb(59, 130, 246)',
                borderWidth: 1,
                borderRadius: 4,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            title: {
                display: false,
            },
        },
        scales: {
            y: {
                grid: { color: '#262626' },
                ticks: { color: '#a3a3a3' },
                title: { display: true, text: 'Rainfall (mm)', color: '#737373' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#a3a3a3' }
            }
        },
    };

    return (
        <div className="h-full w-full p-2">
            <Bar options={options} data={data} />
        </div>
    );
};
