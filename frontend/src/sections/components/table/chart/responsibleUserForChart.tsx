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
    // Thêm state cho pagination
    const [page, setPage] = useState(0);
    const rowsPerPage = 5;

    // Xử lý thay đổi trang
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    // Tính toán các rows sẽ hiển thị trên trang hiện tại  
    const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);


    return (
        <Box sx={{ height: '100%' }}>
            <TableContainer component={Card} sx={{ height: 'inherit' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
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
                                    {`${record.fristName} ${record.lastName}`}
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
                        {data.length>0?(<TableRow>
                            <TableCell colSpan={5} align='right'>
                                <TablePagination
                                    component="div"
                                    count={data.length}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    onPageChange={handleChangePage}
                                    rowsPerPageOptions={[]} // Ẩn options chọn số record mỗi trang
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} của ${count}`}
                                />
                            </TableCell>
                        </TableRow>):null}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )
}

export default ResponsibleUserForChart