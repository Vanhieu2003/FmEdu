import { Card, CardContent } from '@mui/material';
import React from 'react'
import { HorizontalBarChartData } from 'src/_mock/chartData';
import DataChart from 'src/components/DataChart/DataChart';


interface props {
    data: any;
}

const colors =[
    'rgb(75, 192, 192)',
    'rgb(78, 60, 192)',
    'rgb(11, 89, 192)',
    'rgb(61, 251, 192)',
    'rgb(200, 100, 150)',
    'rgb(100, 200, 150)',
]

const processData = (data: { campusName: string; criteriaName: string; value: number }[]) => {
    // Lấy danh sách unique criteriaName
    const criteriaNames = Array.from(new Set(data.map((item: any) => item.criteriaName)));

    // Lấy danh sách unique campusName
    const campusNames  = Array.from(new Set(data.map((item: any) => item.campusName)));

    // Tạo datasets
    const datasets = campusNames.map((campusName, index) => {
        return {
            label: campusName,
            data: criteriaNames.map(criteriaName => {
                // Tìm giá trị (value) của criteria cho campus hiện tại
                const record = data.find(
                    (item:any) => item.campusName === campusName && item.criteriaName === criteriaName
                );
                // Nếu tìm thấy giá trị thì trả về, nếu không thì trả về null
                return record ? record.value : null;
            }),
            // Các tùy chọn hiển thị cho từng dataset
            backgroundColor: colors[index],
        };
    });

    return {
        labels:criteriaNames,
        datasets:datasets
    };
};

const data1 = {
    labels: ["Lau các dấu tay, vết mờ trên kính", "Sàn lau khô, khử mùi hôi"],
    datasets: [
        {
            label: "Cơ sở 351 Lạc Long Quân",
            data: [77, 0],
            backgroundColor: "rgba(75, 192, 192, 0.7)",
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1
        },
        {
            label: "Cơ sở Thuận An - Bình Dương",
            data: [77, 76],
            backgroundColor: "rgba(192, 75, 192, 0.7)",
            borderColor: "rgba(192, 75, 192, 1)",
            borderWidth: 1
        },
        {
            label: "Cơ sở 115 Hai Bà Trưng",
            data: [76, 76],
            backgroundColor: "rgba(192, 192, 75, 0.7)",
            borderColor: "rgba(192, 192, 75, 1)",
            borderWidth: 1
        }
    ]
};


const RenderHorizontalBarChart = ({ data }: props) => {
    const options = {
        indexAxis: 'y',  // Đặt trục x thành trục dọc, cho phép thanh nằm ngang
        responsive: true,
        plugins: {
            title: {
                display: true, // Hiển thị title
                text: 'Biểu đồ cột ngang', // Tiêu đề
                font: {
                    size: 20 // Kích thước font
                }
            },
            tooltip: {
                enabled: true, // Bật tooltip khi hover vào thanh
                callbacks: {
                    label: function (tooltipItem: any) {
                        return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                    }
                }
            }
        },
    };

    return (
        <Card sx={{height:'100%'}}>
            <CardContent
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
              }}>
                <DataChart
                    type="bar"
                    data={processData(data)}
                    options={{
                        ...options,
                        indexAxis: 'y'
                    }}
                    width= {100}
                    height={70}
                />
            </CardContent>
        </Card>
    )
}

export default RenderHorizontalBarChart