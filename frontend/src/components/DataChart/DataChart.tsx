import { ChartConfiguration, Chart, registerables } from "chart.js";
import { useEffect, useRef } from "react";
import { months } from "src/utils/time-for-chart";

const DataChart = (props: ChartConfiguration) => {
    const { data, options } = props;
    const chartRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (chartRef.current) {
            const chart = new Chart(chartRef.current, {
                ...props, options: {
                    ...options
                }
            });
            return () => {
                chart.destroy();
            };
        }
    }, [data]);
    return (
        <canvas ref={chartRef}  />
    )
}
Chart.register(...registerables);
export default DataChart;