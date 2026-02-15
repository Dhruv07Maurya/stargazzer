
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useTemperatureData } from '../../hooks/useTemperatureData';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export const TemperatureChart = () => {
    const { data, loading, error } = useTemperatureData();

    if (loading) return <div className="h-full flex items-center justify-center text-neutral-400">Loading Climate Data...</div>;
    if (error) return <div className="h-full flex items-center justify-center text-red-500">{error}</div>;

    const chartData = {
        labels: data.map(d => d.year),
        datasets: [
            {
                label: 'Global Temperature Anomaly (°C)',
                data: data.map(d => d.anomaly),
                borderColor: 'rgb(239, 68, 68)',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                borderWidth: 2,
                pointRadius: 1,
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top' as const,
                labels: { color: '#a3a3a3' }
            },
            title: {
                display: false,
            },
            tooltip: {
                mode: 'index' as const,
                intersect: false,
            },
        },
        scales: {
            y: {
                grid: { color: '#262626' },
                ticks: { color: '#a3a3a3' },
                title: { display: true, text: 'Anomaly (°C)', color: '#737373' }
            },
            x: {
                grid: { display: false },
                ticks: { color: '#a3a3a3', maxTicksLimit: 10 }
            }
        },
        interaction: {
            mode: 'nearest' as const,
            axis: 'x' as const,
            intersect: false
        }
    };

    return (
        <div className="h-full w-full p-2">
            <Line options={options} data={chartData} />
        </div>
    );
};
