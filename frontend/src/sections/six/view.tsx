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
  const [chartData1, setChartData1] = useState<any>({ labels: [], datasets: [] });
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);
  const [selectedType,setSelectedType] = useState<any>(null);

  useEffect(()=>{
    switch(selectedType){
      case "ByQuater":

        break;
      case "ByYear":

        break;
      case "BySixMonth":
        break;
    }
  },[selectedType])
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
    const response1 = await ChartService.GetAverageValueForCriteriaPerCampus(campusId);
    processData(response.data);
    processData1(response1.data);
  };

  // Bước 2: Chuyển Đổi Dữ Liệu
  const processData = (data: any) => {
    const labels = data.map((item: any) => `Tháng ${String(item.reportTime).slice(0,2)}`);
    const values = data.map((item: any) => item.averageValue);
  
    setChartData({
      labels: labels,
      datasets: [
        {
          label: `Tiến độ`,
          data: values,
          fill: true,
          backgroundColor: 'rgb(58, 206, 139)',
          tension: 0.1,
        }
      ]
    });
  };

  const processData1 = (data: any) => {
    const labels = data.map((item: any) => `${item.criteriaName}`);
    const values = data.map((item: any) => item.value);
  
    setChartData1({
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
        data={chartData1}
        options={{
          indexAxis: 'y',
          plugins: {
            title: {
              display: true,
              text: `Tiến độ các tiêu chí của ${campus.find((c:any) => c.id === selectedCampus)?.campusName}`,
              font: { size: 18 },
            }
          }
        }}
      />
      <DataChart
        type={"bar"}
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: `Tiến độ trung bình của${campus.find((c:any) => c.id === selectedCampus)?.campusName}`,
              font: { size: 18 },
            }
          }
        }}
      />
    </Container>
  );
}
