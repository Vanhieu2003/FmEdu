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
  Box
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


// ----------------------------------------------------------------------

export default function ThreeView() {
  const settings = useSettingsContext();
  const data1={total:10,good:5,ok:3,bad:2}
  const [data,setData] = useState<any>({});
  const [campus, setCampus] = useState<any[]>([]);
  const [selectedCampus, setSelectedCampus] = useState<string | null>(null);
 
  useEffect(() => {
    const fetchData = async () => {
      const response = await CampusService.getAllCampus();
      const response1 = await ChartService.GetCleaningProgressByCampusId('');
      setData(response1.data);
      setCampus(response.data);
    };
    fetchData();
  }, []);

  const fetchDataForDonutChart = async (campusId:any) => {
    if(campusId === 'All'){
      const response = await ChartService.GetCleaningProgressByCampusId('');
      setData(response.data)
    }
    else{
      const response = await ChartService.GetCleaningProgressByCampusId(campusId);
      setData(response.data);
    }
  }

  useEffect(()=>{console.log("data",data)},[data]);
  useEffect(() => {fetchDataForDonutChart(selectedCampus)},[selectedCampus])


  return (
    <>
      <Box sx={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <Typography variant='h3'>Báo cáo thống kê</Typography>
        <Select
            labelId="base-select-label1"
            id="base-select1"
            style={{ float: 'right' }}
            value ={selectedCampus || 'All'}
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

      <Grid container spacing={2} sx={{marginTop:'10px'}}>
        <Grid item xs={8} sx={{height:'revert'}}>
          <ReportCount data={data} />
          <ReportCompareChart/>
        </Grid>
        <Grid item xs={4}>
          <ReportCountChart data = {data}/>
        </Grid>
      </Grid>

    </>
  );
}
