'use client';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import { useState, useEffect } from 'react';
import ChartService from 'src/@core/service/chart';
import DataChart from 'src/components/DataChart/DataChart';
import CampusService from 'src/@core/service/campus';
import SnackbarComponent from '../components/snackBar';

// ----------------------------------------------------------------------

export default function SixView() {
  const settings = useSettingsContext();
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [chartData1, setChartData1] = useState<any>({ labels: [], datasets: [] });
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>("ByQuater");
  const [lineChartData, setLineChartData] = useState<any>({ labels: [], datasets: [] });

  const fetchDataByType = async (type: string) => {
    switch (type) {
      case "ByQuater":
        const response = await ChartService.GetCleaningReportByQuarter();
        setLineChartData(processLineChartData(response.data,type));
        break;
      case "ByYear":
        const response1 = await ChartService.GetCleaningReportByYear();
        setLineChartData(processLineChartData(response1.data,type));
        break;
      case "BySixMonth":
        const response2 = await ChartService.GetCleaningReportBySixMonth();
        setLineChartData(processLineChartData(response2.data,type));
        break;
    }
  }

  useEffect(() => {
    switch (selectedType) {
      case "ByQuater":
        fetchDataByType("ByQuater");
        break;
      case "ByYear":
        fetchDataByType("ByYear");
        break;
      case "BySixMonth":
        fetchDataByType("BySixMonth");
        break;
    }
  }, [selectedType])
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

  const processLineChartData = (data: any, type: string) => {
    switch (type) {
      case "ByQuater":
        const campusMap = new Map<string, Map<string,number>>();
        const quartersSet = new Set<string>();

        // Khởi tạo mảng dữ liệu cho mỗi cơ sở
        data.forEach((item:any) => {
          if (!campusMap.has(item.campusName)) {
            campusMap.set(item.campusName, new Map<string,number>());
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
        }));

        return {
          labels: quarters,
          datasets: datasets,
        };
      case "ByYear":
        const campusMap1 = new Map<string, Map<string,number>>();
        const YearSet = new Set<string>();

        // Khởi tạo mảng dữ liệu cho mỗi cơ sở
        data.forEach((item:any) => {
          if (!campusMap1.has(item.campusName)) {
            campusMap1.set(item.campusName, new Map<string,number>());
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
  };

  // Bước 2: Chuyển Đổi Dữ Liệu
  const processData = (data: any) => {
    const labels = data.map((item: any) => item.day);
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
        {campus.map((c: any) => (
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
              text: `Tiến độ các tiêu chí của ${campus.find((c: any) => c.id === selectedCampus)?.campusName}`,
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
              text: `Tiến độ trung bình của${campus.find((c: any) => c.id === selectedCampus)?.campusName}`,
              font: { size: 18 },
            }
          }
        }}
      />
      <select
        value={selectedType || ''}
        onChange={(e) => setSelectedType(e.target.value)}
      >
          <option key={1} value={"ByQuater"}>
            Quý
          </option>
          <option key={2} value={"ByYear"}>
            Năm
          </option>
      </select>
      <DataChart
        type={"line"}
        data={lineChartData}
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
    </Container>
  );
}
