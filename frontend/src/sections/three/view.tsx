'use client';



import { useSettingsContext } from 'src/components/settings';
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from 'react';
import ChartService from 'src/@core/service/chart';
import { Container, MenuItem, Select, TableContainer, Typography,  Table, TableHead, TableRow,
  TableCell, TableBody,Paper } from '@mui/material';
import DataChart from 'src/components/DataChart/DataChart';
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HomeIcon from '@mui/icons-material/Home';
import SpeedIcon from '@mui/icons-material/Speed';
import CampusService from 'src/@core/service/campus';


// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();
  const [totalReportCount, setTotalReportCount] = useState(0);
  const [totalReportPerDayCount, setTotalReportPerDayCount] = useState(0);
  const [totalRoomCount, setTotalRoomCount] = useState(0);
  const [barChartData, setBarChartData] = useState<any>({ labels: [], datasets: [] });
  const [horizontalBarChartData, setHorizontalBarChartData] = useState<any>({ labels: [], datasets: [] });
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampusForBarChart, setSelectedCampusForBarChart] = useState<any>(null);
  const [selectedCampusForHorizontalBarChart, setSelectedCampusForHorizontalBarChart] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<any>("ByQuater");
  const [lineChartData, setLineChartData] = useState<any>({ labels: [], datasets: [] });






  const fetchDataByType = async (type: string) => {
    switch (type) {
      case "ByQuater":
        const response = await ChartService.GetCleaningReportByQuarter();
        setLineChartData(processLineChartData(response.data, type));
        break;
      case "ByYear":
        const response1 = await ChartService.GetCleaningReportByYear();
        setLineChartData(processLineChartData(response1.data, type));
        break;
      case "BySixMonth":
        const response2 = await ChartService.GetCleaningReportBySixMonth();
        setLineChartData(processLineChartData(response2.data, type));
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
      var response1 = await ChartService.GetCleaningReportCount();
      var response2 = await ChartService.GetTotalReportPerDayCount();
      setTotalReportCount(response1.data.totalCount);
      setTotalReportPerDayCount(response2.data.totalReports);
      setTotalRoomCount(response2.data.totalRooms);
      setCampus(response.data);
      setSelectedCampusForBarChart(response.data[0].id);
      setSelectedCampusForHorizontalBarChart(response.data[0].id);
    };
    fetchData();
  }, []);

  useEffect(() => {
    fetchDataForBarChart(selectedCampusForBarChart);
  }, [selectedCampusForBarChart]);

  useEffect(()=>{
    fetchDataForHorizontalBarChart(selectedCampusForHorizontalBarChart);
  },[selectedCampusForHorizontalBarChart])
  const fetchDataForBarChart = async (campusId: any) => {
    const response = await ChartService.GetAverageValueForReport(campusId);
    processData(response.data);
  };
  const fetchDataForHorizontalBarChart = async (campusId: any) => {
    const response = await ChartService.GetAverageValueForCriteriaPerCampus(campusId);
    processData1(response.data);
  };

  const processLineChartData = (data: any, type: string) => {
    switch (type) {
      case "ByQuater":
        const campusMap = new Map<string, Map<string, number>>();
        const quartersSet = new Set<string>();

        // Khởi tạo mảng dữ liệu cho mỗi cơ sở
        data.forEach((item: any) => {
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
        }));

        return {
          labels: quarters,
          datasets: datasets,
        };
      case "ByYear":
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
  };

  // Bước 2: Chuyển Đổi Dữ Liệu
  const processData = (data: any) => {
    const labels = data.map((item: any) => `Ngày ${item.day}`);
    const values = data.map((item: any) => item.averageValue);

    setBarChartData({
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

    setHorizontalBarChartData({
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
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography variant="h4"> Page Three </Typography>
        <Grid container spacing={3} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng số báo cáo trong ngày"
              total={totalReportCount}
              icon={<ContentPasteIcon fontSize='large' />}
            />
          </Grid>
          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng tiến độ báo cáo"
              total={76}
              unit='%'
              icon={<SpeedIcon fontSize='large' />}
              color='secondary'
            />
          </Grid>

          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng khu vực đã báo cáo"
              total={`${totalReportPerDayCount} / ${totalRoomCount}`}
              icon={<HomeIcon fontSize='large' />}
              color='info'
            />
          </Grid>
        </Grid>
        <Grid spacing={2} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Grid sx={{ flex: 1 }}>
            <Select
              labelId="time-range-select-label"
              id="time-range-select"
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <MenuItem value={"ByQuater"}>Quý</MenuItem>
              <MenuItem value={"ByYear"}>Năm</MenuItem>
            </Select>
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
          </Grid>

          <Grid sx={{ flex: 1 }}>

            <Select
              labelId="base-select-label"
              id="base-select"
              value={selectedCampusForBarChart || ''}
              onChange={(e) => setSelectedCampusForBarChart(e.target.value)}
              style={{ float: 'right' }}
            >
              {campus.map((c: any) => (
                <MenuItem key={c.id} value={c.id}>
                  {c.campusName}
                </MenuItem>
              ))}
            </Select>
            <DataChart
              type={"bar"}
              data={barChartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    text: `Tiến độ trung bình của${campus.find((c: any) => c.id === selectedCampusForBarChart)?.campusName}`,
                    font: { size: 18 },
                  }
                }
              }}
            />
          </Grid>
        </Grid>
        <Grid spacing={2} sx={{ mt: 5 }}>

          <Select
            labelId="base-select-label1"
            id="base-select1"
            value={selectedCampusForHorizontalBarChart || ''}
            onChange={(e) => setSelectedCampusForHorizontalBarChart(e.target.value)}
            style={{ float: 'right' }}
          >
            {campus.map((c: any) => (
              <MenuItem key={c.id} value={c.id}>
                {c.campusName}
              </MenuItem>
            ))}
          </Select>
          <DataChart
            type={"bar"}
            data={horizontalBarChartData}
            options={{
              indexAxis: 'y',
              plugins: {
                title: {
                  display: true,
                  text: `Tiến độ các tiêu chí của ${campus.find((c: any) => c.id === selectedCampusForHorizontalBarChart)?.campusName}`,
                  font: { size: 18 },
                }
              }
            }}
          />
        </Grid>
        <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Danh sách báo cáo vệ sinh">
        <TableHead>
            <TableRow>
              <TableCell align="center">Tòa nhà</TableCell>
              <TableCell align="center">Tổng số phòng</TableCell>
              <TableCell align="center">Đã đánh giá </TableCell>
              <TableCell align="center">Phần trăm hoàn thành</TableCell>
              <TableCell align="center">Tiến độ báo cáo</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          </TableHead>

          </Table>
        </TableContainer>
      </Container>
    </>

  );
}
