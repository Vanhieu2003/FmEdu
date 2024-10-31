import DataChart from "src/components/DataChart/DataChart";


const transformDataForChart = (data: any) => {
    const labels = data?.map((item: any) => item.campusName);

    const datasets = [
        {
            label: 'Điểm số',
            data: data?.map((item: any) => item.averageValue),
            backgroundColor: '#4285F4',
        },
        {
            label: 'Vi phạm',
            data: data?.map((item: any) => item.countNotMet),
            backgroundColor: '#FF0000',
        },
        {
            label: 'Hoàn thành tốt',
            data: data?.map((item: any) => item.countWellCompleted),
            backgroundColor: '#FFD700',
        }
    ];

    return { labels, datasets };
};


interface props{
    data:any
}
const RenderBarChart = ({data}:props) => {
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom' as const,
            },
            title: {
                display: true,
                text: 'So sánh giữa các cơ sở theo năm',
                font: { size: 18 },
            },
        },
        scales: {
            x: {
                stacked: false,
            },
            y: {

                beginAtZero: true,
                max: 100,
            },
        },
    };


    return (<DataChart
        type="bar"
        data={transformDataForChart(data)}
        options={options}
    />)

}

export default RenderBarChart