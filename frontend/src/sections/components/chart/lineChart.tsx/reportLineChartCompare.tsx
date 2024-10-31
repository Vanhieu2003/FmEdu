import { lineChartData } from "src/_mock/chartData"
import DataChart from "src/components/DataChart/DataChart"

interface props {
    data: any,
    type: string,
}

const colors = [
    'rgb(75, 192, 192)',
    'rgb(78, 60, 192)',
    'rgb(11, 89, 192)',
    'rgb(61, 251, 192)',
    'rgb(200, 100, 150)',
    'rgb(100, 200, 150)',
];

function transformDataToChartFormat(data: any, type: string) {
    switch (type) {
        case "quater":
            const campusMap = new Map<string, Map<string, number>>();
            const quartersSet = new Set<string>();

            // Khởi tạo mảng dữ liệu cho mỗi cơ sở
            data?.forEach((item: any) => {
                if (!campusMap.has(item.campusName)) {
                    campusMap.set(item.campusName, new Map<string, number>());
                }
                campusMap.get(item.campusName)!.set(item.reportTime, item.averageValue);
                quartersSet.add(item.reportTime);
            });

            // Chuyển Set thành Array và sắp xếp các quý
            const quarters = Array.from(quartersSet).sort();

            // Chuyển đổi dữ liệu thành định dạng mong muốn
            const datasets = Array.from(campusMap.entries()).map(([campusName, values]) => ({
                label: campusName,
                data: quarters.map(quarter => values.get(quarter) || 0),
                fill: false,
                backgroundColor: colors.pop(),
            }));

            return {
                labels: quarters,
                datasets: datasets,
            };
        case "week":
            const campusMap1 = new Map<string, Map<string, number>>();
            const YearSet = new Set<string>();

            // Khởi tạo mảng dữ liệu cho mỗi cơ sở
            data.forEach((item: any) => {
                if (!campusMap1.has(item.campusName)) {
                    campusMap1.set(item.campusName, new Map<string, number>());
                }
                campusMap1.get(item.campusName)!.set(item.reportTime, item.averageValue);
                YearSet.add(item.reportTime);
            });

            // Chuyển Set thành Array và sắp xếp các quý
            const Years = Array.from(YearSet).sort();

            // Chuyển đổi dữ liệu thành định dạng mong muốn
            const datasets1 = Array.from(campusMap1.entries()).map(([campusName, values]) => ({
                label: campusName,
                data: Years.map(year => values.get(year) || 0),
            }));

            return {
                labels: Years,
                datasets: datasets1,
            };
    }

}

const RenderLineChartData = ({ data, type }: props) => {
    return (
        <DataChart
            type="line"
            data={transformDataToChartFormat(data, type) ?? { labels: [], datasets: [] }}
            options={{
                plugins: {
                    title: {
                        display: true,
                        text: `Báo cáo`,
                        font: { size: 18 },
                    }
                }
            }}
        />
    )
}

export default RenderLineChartData