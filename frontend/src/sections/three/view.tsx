'use client';


import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import Grid from "@mui/material/Grid2";
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import HomeIcon from '@mui/icons-material/Home';
import { useEffect, useState } from 'react';
import DataChart from 'src/components/DataChart/DataChart';
import { barChartData, HorizontalBarChartData, lineChartData } from 'src/_mock/chartData';


// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();
  const [chartData, setChartData] = useState({});
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
  useEffect(() => {
    setChartData({
      options: {
        chart: {
          id: "basic-bar"
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
        }
      },
      series: [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
      ]
    });
  }, [])
  return (
    <>
      <Container maxWidth={settings.themeStretch ? false : 'xl'}>
        <Typography variant="h4"> Page Three </Typography>
        <Grid container spacing={3} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng số báo cáo"
              total={255}
              icon={<ContentPasteIcon fontSize='large' />}
            />
          </Grid>
          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng tiến độ báo cáo"
              total={76}
              unit='%'
              icon={<FitnessCenterIcon fontSize='large' />}
              color='secondary'
            />
          </Grid>

          <Grid sx={{ flex: 1 }}>
            <AnalyticsWidgetSummary
              title="Tổng khu vực đã báo cáo"
              total={124}
              icon={<HomeIcon fontSize='large' />}
              color='info'
            />
          </Grid>
        </Grid>
        <Grid spacing={2} sx={{ mt: 5, display: 'flex', justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <Grid sx={{ flex: 1 }}>
            <select onChange={handleTimeRangeChange} value={timeRange}>
              <option value="months">12 Tháng</option>
              <option value="years">5 Năm gần nhất</option>
              <option value="weeks">4 Tuần gần nhất</option>
              <option value="days">10 Ngày gần nhất</option>
            </select>
            <DataChart type={"line"} data={getDataForTimeRange()} />

          </Grid>

          <Grid sx={{ flex: 1 }}>
            <select onChange={handleBaseChange} value={selectedBase} style={{ float: 'right' }}>
              <option value="A">Cơ sở A</option>
              <option value="B">Cơ sở B</option>
              <option value="C">Cơ sở C</option>
              <option value="D">Cơ sở D</option>
              <option value="E">Cơ sở E</option>
            </select>
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
          <select onChange={handleBaseChange1} value={selectedBase1} style={{ float: 'right' }}>
            <option value="A">Cơ sở A</option>
            <option value="B">Cơ sở B</option>
            <option value="C">Cơ sở C</option>
            <option value="D">Cơ sở D</option>
            <option value="E">Cơ sở E</option>
          </select>
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
