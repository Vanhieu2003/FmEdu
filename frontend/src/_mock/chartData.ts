import { months } from 'src/utils/time-for-chart';
export const lineChartData = {
    months: {
        labels: months({ count: 12 }),
        datasets: [
            { label: "Cơ sở A", data: [65, 59, 80, 81, 56, 55, 60, 49, 12, 72, 52, 43] },
            { label: "Cơ sở B", data: [90, 90, 63, 40, 100, 67, 68, 71, 92, 92, 93, 87] },
            {
                label: "Cơ sở C",
                data: [92, 75, 84, 70, 78, 78, 87, 66, 86, 52, 87, 51],

            },
            {
                label: "Cơ sở D",
                data: [61, 67, 71, 98, 62, 69, 66, 67, 82, 94, 86, 88],

            },
            {
                label: "Cơ sở E",
                data: [51, 25, 15, 8, 55, 67, 11, 22, 80, 94, 86, 88],

            }
        ]
    },
    years: {
        labels: ["2020", "2021", "2022", "2023", "2024"],
        datasets: [
            { label: "Cơ sở A", data: [200, 240, 230, 250, 260] },
            { label: "Cơ sở B", data: [210, 250, 220, 270, 290] },
            {
                label: "Cơ sở C",
                data: [92, 75, 84, 70, 78],

            },
            {
                label: "Cơ sở D",
                data: [61, 67, 71, 98, 62],

            },
            {
                label: "Cơ sở E",
                data: [51, 25, 15, 8, 55],

            }
        ]
    },
    weeks: {
        labels: ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"],
        datasets: [
            { label: "Cơ sở A", data: [50, 60, 70, 80] },
            { label: "Cơ sở B", data: [40, 50, 60, 70] },
            {
                label: "Cơ sở C",
                data: [92, 75, 84, 70],

            },
            {
                label: "Cơ sở D",
                data: [61, 67, 71, 98],

            },
            {
                label: "Cơ sở E",
                data: [51, 25, 15, 8],

            }
        ]
    },
    days: {
        labels: ["Ngày 1", "Ngày 2", "Ngày 3", "Ngày 4", "Ngày 5", "Ngày 6", "Ngày 7", "Ngày 8", "Ngày 9", "Ngày 10"],
        datasets: [
            { label: "Cơ sở A", data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100] },
            { label: "Cơ sở B", data: [15, 25, 35, 45, 55, 65, 75, 85, 95, 105] },
            {
                label: "Cơ sở C",
                data: [92, 75, 84, 70, 78, 78, 87, 66, 86, 52],

            },
            {
                label: "Cơ sở D",
                data: [61, 67, 71, 98, 62, 69, 66, 67, 82, 94],

            },
            {
                label: "Cơ sở E",
                data: [51, 25, 15, 8, 55, 67, 11, 22, 80, 94],

            }
        ]
    }
}

export const barChartData = {
    labels: months({ count: 12 }),
    datasets: [
        {
            title: "Cơ sở A",
            label: "Tiến độ",
            data: [65, 59, 80, 81, 56, 55, 60, 49, 11, 72, 52, 43],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở B",
            label: "Tiến độ",
            data: [90, 90, 63, 40, 100, 67, 68, 71, 92, 92, 93, 87],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở C",
            label: "Tiến độ",
            data: [92, 75, 84, 70, 78, 78, 87, 66, 86, 52, 87, 51],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở D",
            label: "Tiến độ",
            data: [61, 67, 71, 98, 62, 69, 66, 67, 82, 94, 86, 88],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        },
        {
            title: "Cơ sở E",
            label: "Tiến độ",
            data: [51, 25, 15, 8, 55, 67, 11, 22, 80, 94, 86, 88],
            fill: true,
            backgroundColor: "rgb(75, 192, 192)",
            tension: 0.1,
        }
    ]
}

export const HorizontalBarChartData = {
    labels: ['Xịt mùi thơm','Lau kính','Vệ sinh nhà cửa','Vệ sinh nhà bếp','Vệ sinh nhà vệ sinh'],
    datasets: [
      {
        title: 'Cơ sở A',
        label: 'Tiến độ (%)',
        data: [12,56,78,90,43],
        
      },
      {
        title: 'Cơ sở B',
        label: 'Tiến độ (%)',
        data: [41,68,43,27,43],
        
      },
      {
        title: 'Cơ sở C',
        label: 'Tiến độ (%)',
        data: [58,15,85,23,96],
        
      },
      {
        title: 'Cơ sở D',
        label: 'Tiến độ (%)',
        data: [12,56,78,90,43],
        
      },
      {
        title: 'Cơ sở E',
        label: 'Tiến độ (%)',
        data: [86,47,92,5,56],
        
      },
    ]
  };