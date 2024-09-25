'use client';



import { useSettingsContext } from 'src/components/settings';
import Grid from "@mui/material/Grid2";
import { useEffect, useState } from 'react';
import { barChartData, HorizontalBarChartData, lineChartData } from 'src/_mock/chartData';
import  ChartService  from 'src/@core/service/chart';
import { Container, MenuItem, Select, Typography } from '@mui/material';
import DataChart from 'src/components/DataChart/DataChart';
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HomeIcon from '@mui/icons-material/Home';
import SpeedIcon from '@mui/icons-material/Speed';


// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();
  const [totalReportCount, setTotalReportCount] = useState(0);
  const [totalReportPerDayCount, setTotalReportPerDayCount] = useState(0);
  const [totalRoomCount, setTotalRoomCount] = useState(0);
  const [selectedBase, setSelectedBase] = useState("A");
  const [selectedBase1, setSelectedBase1] = useState("A");
  const [timeRange, setTimeRange] = useState("months");

  const handleTimeRangeChange = (event: any) => {
    setTimeRange(event.target.value);
  };

  // Lấy dữ liệu tương ứng theo khoảng thời gian được chọn
  const getDataForTimeRange = () => {
    return lineChartData[timeRange as keyof typeof lineChartData];
  };

  const handleBaseChange = (event: any) => {
    setSelectedBase(event.target.value);
  };
  const handleBaseChange1 = (event: any) => {
    setSelectedBase1(event.target.value);
  };
  const getDataForSelectedBase = () => {
    const datasets = barChartData.datasets.filter(dataset =>
      dataset.title === `Cơ sở ${selectedBase}`
    );
    return {
      labels: barChartData.labels,
      datasets
    };
  };
  const getDataForSelectedBase1 = () => {
    const datasets = HorizontalBarChartData.datasets.filter(dataset =>
      dataset.title === `Cơ sở ${selectedBase1}`
    );
    return {
      labels: HorizontalBarChartData.labels,
      datasets
    };
  };

  useEffect(()=>{
    const fetchData = async()=>{
      var response = await ChartService.GetCleaningReportCount();
      var response1 = await ChartService.GetTotalReportPerDayCount();
      setTotalReportCount(response.data.totalCount);
      setTotalReportPerDayCount(response1.data.totalReports);
      setTotalRoomCount(response1.data.totalRooms);
    }
    fetchData();
  },[])

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
            value={timeRange}
            onChange={handleTimeRangeChange}
          >
            <MenuItem value="months">12 Tháng</MenuItem>
            <MenuItem value="years">5 Năm gần nhất</MenuItem>
            <MenuItem value="weeks">4 Tuần gần nhất</MenuItem>
            <MenuItem value="days">10 Ngày gần nhất</MenuItem>
          </Select>
            <DataChart type={"line"} data={getDataForTimeRange()} />

          </Grid>

          <Grid sx={{ flex: 1 }}>

                <Select
                  labelId="base-select-label"
                  id="base-select"
                  value={selectedBase}
                  onChange={handleBaseChange}
                  style={{ float: 'right' }}
                >
                  <MenuItem value="A">Cơ sở A</MenuItem>
                  <MenuItem value="B">Cơ sở B</MenuItem>
                  <MenuItem value="C">Cơ sở C</MenuItem>
                  <MenuItem value="D">Cơ sở D</MenuItem>
                  <MenuItem value="E">Cơ sở E</MenuItem>
                </Select>
            <DataChart type={"bar"} data={getDataForSelectedBase()} options={{
              plugins: {
                title: {
                  display: true,
                  text: `Cơ sở ${selectedBase}`,
                  font: {
                    size: 18
                  }
                }
              }
            }} />
          </Grid>
        </Grid>
        <Grid spacing={2} sx={{ mt: 5 }}>

              <Select
                labelId="base-select-label1"
                id="base-select1"
                value={selectedBase1}
                onChange={handleBaseChange1}
                style={{ float: 'right' }}
              >
                <MenuItem value="A">Cơ sở A</MenuItem>
                <MenuItem value="B">Cơ sở B</MenuItem>
                <MenuItem value="C">Cơ sở C</MenuItem>
                <MenuItem value="D">Cơ sở D</MenuItem>
                <MenuItem value="E">Cơ sở E</MenuItem>
              </Select>
          <DataChart type={"bar"} data={getDataForSelectedBase1()} options={{
            indexAxis: 'y',
              plugins: {
                legend: {
                  position: 'right',
                },
                title: {
                  display: true,
                  text: `Cơ sở ${selectedBase1}`,
                  font: {
                    size: 18
                  }
                }
              }
            }} />
        </Grid>
      </Container>
    </>

  );
}
