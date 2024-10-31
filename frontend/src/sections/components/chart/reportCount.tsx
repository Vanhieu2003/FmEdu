import { Box, Card, CardContent, Typography } from '@mui/material'
import React from 'react'


interface props {
    data: any;
}

const getColorByStatus = (status: string) => {
    switch (status.toLowerCase()) {
        case 'hoàn thành tốt':
            return '#00CC00';  // Xanh lá đậm
        case 'hoàn thành':
            return '#66FF66';  // Xanh lá nhạt
        case 'chưa hoàn thành':
            return '#FF0000';  // Đỏ
        default:
            return '#666666';  // Màu mặc định
    }
};

const ReportCount = ({ data }: props) => {
    const reportCounts = data?.reportCounts ? Array.from(data.reportCounts).reverse() : [];
    return (
        <Card variant="outlined"
            sx={{
                backgroundColor: '#fff',
            }}>
            <CardContent sx={{ display: 'flex', height: '100%', justifyContent: 'space-evenly', gap: '30px' }}>
                <Box sx={{ textAlign: 'center' }}>
                    <Typography sx={{ color: "#666666", fontWeight: '700', fontSize: '20px' }}>Tổng số báo cáo</Typography>
                    <Typography sx={{ fontStyle: 'bold', fontWeight: '900', fontSize: '40px', marginTop: '10px' }}>{data.totalReportsToday}</Typography>
                </Box>
                {reportCounts.map((report: any) => (<>
                    <Box sx={{ height: "auto", width: '1px', backgroundColor: "#000", opacity: "0.3" }}></Box>
                    <Box sx={{ textAlign: 'center' }}>
                        <Typography sx={{ color: "#666666", fontWeight: '700', fontSize: '20px' }}>{report.status}</Typography>
                        <Typography sx={{ color: getColorByStatus(report.status), fontWeight: '900', fontSize: '40px' , marginTop: '10px'}}>{report.count}</Typography>
                    </Box>
                    
                    </>))}
            </CardContent>
        </Card>
    )
}

export default ReportCount