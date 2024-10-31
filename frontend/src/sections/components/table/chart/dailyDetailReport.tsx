import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Box, Card, TablePagination } from '@mui/material'
import React, { useState } from 'react'

interface props {
    data: any,
    campusName:string
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

const DailyDetailReport = ({ data,campusName }: props) => {
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
                                Thống kê chi tiết hàng ngày của {campusName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell align='center' sx={{ width: '30%'}}>Số lượng phòng</TableCell>
                            <TableCell align='center' sx={{ width: '30%'}}>Tỷ lệ</TableCell>
                            <TableCell align='center' sx={{ width: '40%'}}>Mức độ hoàn thành</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((record: any) => (
                            <TableRow>
                                <TableCell align='center' sx={{ width: '30%' }}>{record.totalReport}</TableCell>
                                
                                <TableCell align='center' sx={{ width: '30%' }}>
                                    {record.proportion}
                                </TableCell>
                                <TableCell align='center' sx={{ width: '40%' }}>
                                    <Box sx={{ backgroundColor: getBackGroundColor(record.status), borderRadius: '5%', padding: '5px' }}>
                                        {record.status}
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

        </Box>
    )
}

export default DailyDetailReport