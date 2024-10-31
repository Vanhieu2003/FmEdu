import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination } from '@mui/material'
import React, { useState } from 'react'

interface props {
    data: any
}

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

const ResponsibleGroupForChart = ({ data }: props) => {
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
        <Box>
            <TableContainer component={Card}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell
                                align='center'
                                colSpan={5}
                            >
                                Bảng thống kê theo nhóm phòng
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Nhóm phòng</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Số lượng phòng</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Số lượng phòng đã đánh giá</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Tiến độ</TableCell>
                            <TableCell align='center' sx={{ width: '20%', position: 'sticky', top: '60px', backgroundColor: 'background.paper', zIndex: 2 }}>Trạng thái</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.length > 0 ? visibleRows.map((record: any) => (
                            <TableRow>
                                <TableCell align='center' sx={{ width: '20%' }}>{record.groupName}</TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.totalRoom}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '20%' }}>
                                    {record.totalEvaluatedRoom}
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
                        <TableRow>
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
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )
}

export default ResponsibleGroupForChart