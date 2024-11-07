import { TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination, useTheme } from '@mui/material'
import React, { useState } from 'react'
import { getBackgroundColor } from 'src/utils/chart/GetColor'

interface props {
    data: any
}

const ResponsibleUserForChart = ({ data }: props) => {
    const theme = useTheme();
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
                                sx={{fontSize:'20px',color:theme.palette.text.primary}}
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
                                    <Box sx={{ backgroundColor: getBackgroundColor(record.status), borderRadius: '5%', padding: '5px' }}>
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