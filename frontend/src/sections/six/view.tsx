'use client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';
import ChartService from 'src/@core/service/chart';
import DataChart from 'src/components/DataChart/DataChart';
import CampusService from 'src/@core/service/campus';

// ----------------------------------------------------------------------

export default function SixView() {
  const settings = useSettingsContext();
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await CampusService.getAllCampus();
      setCampus(response.data);
      setSelectedCampus(response.data[0].id);
    };
    fetchData();
  }, []);
  useEffect(() => {
    fetchData(selectedCampus);
    console.log(campus)
    console.log(selectedCampus);
  }, [selectedCampus]);

  const fetchData = async (campusId: any) => {
    const response = await ChartService.GetAverageValueForReport(campusId);
    processData(response.data);
  };

  // Bước 2: Chuyển Đổi Dữ Liệu
  const processData = (data: any) => {
    const labels = data.map((item: any) => `Ngày ${item.day}`);
    const values = data.map((item: any) => item.averageValue);
  
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `Tiến độ`,
          data: values,
          fill: true,
          backgroundColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        }
      ]
    });
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4"> Page Six </Typography>
      <select
        value={selectedCampus || ''}
        onChange={(e) => setSelectedCampus(e.target.value)}
      >
        {campus.map((c:any) => (
          <option key={c.id} value={c.id}>
            {c.campusName}
          </option>
        ))}
      </select>
      <DataChart
        type={"bar"}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Tiến độ trung bình của ${campus.find((c:any) => c.id === selectedCampus)?.campusName}`,
              font: { size: 18 },
            }
          }
        }}
      />
    </Container>
  );
}
