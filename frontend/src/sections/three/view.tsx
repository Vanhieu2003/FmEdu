'use client';



import { useSettingsContext } from 'src/components/settings';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from 'react';
import ChartService from 'src/@core/service/chart';
import {
  Container, MenuItem, Select, TableContainer, Typography, Table, TableHead, TableRow,
  TableCell, TableBody, Paper,
  CardContent,
  Card,
  Box,
  Skeleton
} from '@mui/material';
import DataChart from 'src/components/DataChart/DataChart';
import AnalyticsWidgetSummary from '../components/Overview/OverViewAnalytics';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import HomeIcon from '@mui/icons-material/Home';
import SpeedIcon from '@mui/icons-material/Speed';
import CampusService from 'src/@core/service/campus';
import ReportCount from '../components/chart/reportCount';
import { donutData, lineChartData } from 'src/_mock/chartData';
import ReportCountChart from '../components/chart/reportCountChart';
import ReportCompareChart from '../components/chart/reportCompareChart';
import ResponsibleUserForChart from '../components/table/chart/responsibleUserForChart';
import ResponsibleGroupForChart from '../components/table/chart/responsibleGroupForChart';
import DailyDetailReport from '../components/table/chart/dailyDetailReport';
import RenderHorizontalBarChart from '../components/chart/barChart.tsx/reportHorizontalBarForTop5Criteria';
import { ChartSkeleton } from '../components/skeleton/chartSkeleton';
import { TableSkeleton } from '../components/skeleton/tableSkeleton';


// ----------------------------------------------------------------------

const data1 = [
  {
    "tagName": "Lau ghế",
    "lastName": "Add User",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 50,
    "status": "Cần cải thiện"
  },
  {
    "tagName": "Vệ sinh",
    "lastName": "Add User",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 80,
    "status": "Hoàn thành tốt"
  },
  {
    "tagName": "Lau bàn",
    "lastName": "Nguyễn",
    "fristName": "Huấn",
    "totalReport": 2,
    "progress": 50,
    "status": "Cần cải thiện"
  },
  {
    "tagName": "Vệ sinh",
    "lastName": "test",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 80,
    "status": "Hoàn thành tốt"
  },
  {
    "tagName": "Lau ghế",
    "lastName": "test",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 50,
    "status": "Cần cải thiện"
  },
  {
    "tagName": "Lau bàn",
    "lastName": "tét",
    "fristName": "test1",
    "totalReport": 2,
    "progress": 50,
    "status": "Cần cải thiện"
  },
  {
    "tagName": "Lau ghế",
    "lastName": "Nguyễn",
    "fristName": "Huân ",
    "totalReport": 1,
    "progress": 100,
    "status": "Hoàn thành tốt"
  },
  {
    "tagName": "Vệ sinh",
    "lastName": "Nguyễn",
    "fristName": "Huân ",
    "totalReport": 1,
    "progress": 60,
    "status": "Cần cải thiện"
  },
  {
    "tagName": "Vệ sinh",
    "lastName": "11g",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 80,
    "status": "Hoàn thành tốt"
  },
  {
    "tagName": "Lau ghế",
    "lastName": "11g",
    "fristName": "Huan",
    "totalReport": 2,
    "progress": 50,
    "status": "Cần cải thiện"
  }
]
export default function ThreeView() {
  const [data, setData] = useState<any>({});
  const [campus, setCampus] = useState<any[]>([]);
  const [dailyTagByUserData, setDailyTagByUserData] = useState<any>();
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [dailyRoomGroupData, setDailyRoomGroupData] = useState<any>();
  const [dailyReportData, setDailyReportData] = useState<any>();
  const [dailyTop5CriteriaValueData, setDailyTop5CriteriaValueData] = useState<any>();
  const [isLoading, setIsLoading] = useState(true);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await CampusService.getAllCampus();
        const response1 = await ChartService.GetCleaningProgressByCampusId('');
        const response2 = await ChartService.GetDailyTagAndUserByCampus('');
        const response3 = await ChartService.GetDailyRoomGroupReportByCampus('');
        const response4 = await ChartService.GetDailyReportStatusTableByCampus('');
        const response5 = await ChartService.GetAverageValueForCriteriaPerCampus('')

        setData(response1.data);
        setCampus(response.data);
        setDailyTagByUserData(response2.data);
        setDailyRoomGroupData(response3.data);
        setDailyReportData(response4.data);
        setDailyTop5CriteriaValueData(response5.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const fetchDataForDonutChart = async (campusId: any) => {
    try {
      setIsLoading(true);
      const response = await ChartService.GetCleaningProgressByCampusId(campusId === 'All' ? '' : campusId);
      setData(response.data)
    }
    finally {
      setIsLoading(false);
    }

  }


  const fetchDataForTagAndUserTable = async (campusId: any) => {
    try {
      setIsLoading(true);
      const response = await ChartService.GetDailyTagAndUserByCampus(campusId === 'All' ? '' : campusId);
      setDailyTagByUserData(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchDataForRoomGroupTable = async (campusId: any) => {
    try {
      setIsLoading(true);
      const response = await ChartService.GetDailyRoomGroupReportByCampus(campusId === 'All' ? '' : campusId);
      setDailyRoomGroupData(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchDataForDailyReportTable = async (campusId: any) => {
    try {
      setIsLoading(true);
      const response = await ChartService.GetDailyReportStatusTableByCampus(campusId === 'All' ? '' : campusId);
      setDailyReportData(response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const fetchDataForDailyTop5CriteriaChart = async (campusId: any) => {
    try {
      setIsLoading(true);
      const response = await ChartService.GetAverageValueForCriteriaPerCampus(campusId === 'All' ? '' : campusId);
      setDailyTop5CriteriaValueData(response.data);
    } finally {
      setIsLoading(false);
    }
  }
  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        const [
          donutResponse,
          tagUserResponse,
          roomGroupResponse,
          dailyReportResponse,
          criteriaResponse
        ] = await Promise.all([
          ChartService.GetCleaningProgressByCampusId(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyTagAndUserByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyRoomGroupReportByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetDailyReportStatusTableByCampus(selectedCampus === 'All' ? '' : selectedCampus),
          ChartService.GetAverageValueForCriteriaPerCampus(selectedCampus === 'All' ? '' : selectedCampus)
        ]);

        setData(donutResponse.data);
        setDailyTagByUserData(tagUserResponse.data);
        setDailyRoomGroupData(roomGroupResponse.data);
        setDailyReportData(dailyReportResponse.data);
        setDailyTop5CriteriaValueData(criteriaResponse.data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
}, [selectedCampus]);


  if (isLoading) {
    return (
      <>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="text" width={200} height={40} />
          <Skeleton variant="rectangular" width={150} height={40} />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={8}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
              <ChartSkeleton />
              <ChartSkeleton />
            </Box>
          </Grid>
          <Grid item xs={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
              <ChartSkeleton />
              <TableSkeleton />
            </Box>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TableSkeleton />
          </Grid>
          <Grid item xs={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6}>
            <TableSkeleton />
          </Grid>
          <Grid item xs={6}>
            <ChartSkeleton />
          </Grid>
        </Grid>
      </>
    );
  }

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant='h3'>Báo cáo thống kê</Typography>
        <Select
          labelId="base-select-label1"
          id="base-select1"
          style={{ float: 'right' }}
          value={selectedCampus || 'All'}
          onChange={(e) => setSelectedCampus(e.target.value)}
        >
          <MenuItem value="All">
            Tất cả cơ sở
          </MenuItem>
          {campus.map((c: any) => (
            <MenuItem key={c.id} value={c.id}>
              {c.campusName}
            </MenuItem>
          ))}
        </Select>
      </Box>

      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={8} sx={{ height: 'revert' }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <ReportCount data={data} />
            <ReportCompareChart />
          </Box>
        </Grid>
        <Grid item xs={4}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
            }}
          >
            <ReportCountChart data={data} />
            {dailyReportData && < DailyDetailReport data={dailyReportData} campusName={selectedCampus === 'All' ? "Tất cả cơ sở" : campus.find(c => c.id === selectedCampus).campusName} />}
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6} sx={{ height: 'revert' }}>
          {dailyTagByUserData && <ResponsibleUserForChart data={dailyTagByUserData} />}
        </Grid>
        <Grid item xs={6}>
          {dailyTop5CriteriaValueData && <RenderHorizontalBarChart data={dailyTop5CriteriaValueData} />}
        </Grid>
      </Grid>
      <Grid container spacing={2} sx={{ marginTop: '10px' }}>
        <Grid item xs={6} sx={{ height: 'revert' }}>
          {dailyRoomGroupData && <ResponsibleGroupForChart data={dailyRoomGroupData} />}
        </Grid>
        <Grid item xs={6}>
          <ReportCountChart data={data} />
        </Grid>
      </Grid>

    </>
  );
}
