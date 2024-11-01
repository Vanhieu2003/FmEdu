import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination } from '@mui/material'
import React, { useState } from 'react'

interface props {
    data: any
}

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
const getBackGroundColor = (status: string) => {
    switch (status) {
        case 'Hoàn thành tốt':
            return '#dcfee9';
        case 'Cần cải thiện':
            return '#fff6c2';
        default:
            return '#FFFF00';
    }
}

const ResponsibleUserForChart = ({ data }: props) => {
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <TableContainer sx={{ flexGrow: 1 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
                                sx={{fontSize:'20px',color:'#000'}}
                            >
                                Bảng thống kê người chịu trách nhiệm
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Tag</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>User</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Số lượng báo cáo (đã hoàn thành)</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Điểm số trung bình (%)</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? visibleRows.map((record: any) => (
                            <TableRow>
                                <TableCell align='center' sx={{ width: '20%' }}>{record.tagName}</TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {`${record.firstName} ${record.lastName}`}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.totalReport}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.progress}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    <Box sx={{ backgroundColor: getBackGroundColor(record.status), borderRadius: '5%', padding: '5px' }}>
                                        {record.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell align='center' colSpan={5} sx={{ fontSize: '20px', fontWeight: 700, fontStyle: 'bold' }}>
                                    Chưa có thông tin đánh giá cho ngày hôm nay
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {data.length > 0 && (
                <Box sx={{ 
                    borderTop: '1px solid rgba(224, 224, 224, 1)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                }}>
                    <TablePagination
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPageOptions={[]}
                        labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                    />
                </Box>
            )}
        </Card>
    );
};

export default ResponsibleUserForChart