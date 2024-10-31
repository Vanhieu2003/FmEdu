import { Box, Button, CardContent, Card, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import ChartService from 'src/@core/service/chart';
import RenderBarChart from './barChart.tsx/reportBarChartCompare';
import RenderLineChartData from './lineChart.tsx/reportLineChartCompare';


const ReportCompareChart = () => {
    const [option, setOption] = useState<string>('year');
    const [barChartData, setBarChartData] = useState<any>();
    const [lineChartData, setLineChartData] = useState<any>();
    const handleClick = (type: string) => {
        if (type === 'year') {
            setOption('year');
        } else if(type === 'quater'){
            setOption('quater');
        }
        else{
            setOption('week');
        }
    }

    const fetchDataForBarChart = async () => {
        const response = await ChartService.GetChartComparision();
        setBarChartData(response.data);
    }
    const fetchDataForLineChart = async (type:string) => {
        if(type === 'quater'){
            const response = await ChartService.GetCleaningReportByQuarter();
            setLineChartData(response.data);
        }
        else {
            const response = await ChartService.GetCleaningReportByYear();
            setLineChartData(response.data);
        }
       
    }

    useEffect(() => {
        if (option === 'year') {
            fetchDataForBarChart();
        }
        else if (option === 'quater') {
            fetchDataForLineChart('quater');
        }
        else{
            fetchDataForLineChart('week');
        }
        
    }, [option])


    return (
        <>
            <Card sx={{ marginTop: '20px' }}>
                <CardContent>
                    <Box sx={{ display: 'flex', gap: 3 }}>
                        <Button variant={option === 'year' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('year')} >Theo năm</Button>
                        <Button variant={option === 'quater' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('quater')}>Theo quý</Button>
                        <Button variant={option === 'week' ? 'contained' : 'outlined'}
                            onClick={() => handleClick('week')}>Theo tuần</Button>
                    </Box>
                    {option === 'year' ? <RenderBarChart data={barChartData} /> : <RenderLineChartData data={lineChartData} type={option}/>}
                </CardContent>
            </Card>

        </>
    )
}

export default ReportCompareChart