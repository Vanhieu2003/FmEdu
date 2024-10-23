'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import {
  Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem, Link, Pagination, TableFooter
} from '@mui/material';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShiftService from 'src/@core/service/shift';

export default function ShiftListView() {
  const settings = useSettingsContext();
  const [shifts, setShifts] = useState<any>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);  // Theo dõi trang hiện tại
  const [pageSize] = useState<number>(10);  // Kích thước mỗi trang
  const [totalPages, setTotalPages] = useState<number>(1);  // Tổng số trang
  const [totalRecords, setTotalRecords] = useState(0);  // Tổng số bản ghi

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, group: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  // Gọi lại API khi pageNumber thay đổi
  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await ShiftService.getAllShifts(pageNumber, pageSize);  // Gọi API với trang và kích thước
        setShifts(response.data.shifts);  // Lưu danh sách các ca làm việc
        setTotalRecords(response.data.totalRecords);  // Lưu tổng số bản ghi
        setTotalPages(Math.ceil(response.data.totalRecords / pageSize)); 
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu ca làm:', error);
      }
    };
    fetchShifts();
  }, [pageNumber]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);  // Thay đổi trang khi người dùng bấm
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách ca làm việc</Typography>
      </Box>
      {shifts.length > 0 ? (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">STT</TableCell>
                  <TableCell align="center">Tên Ca</TableCell>
                  <TableCell align="center">Thời gian bắt đầu</TableCell>
                  <TableCell align="center">Thời gian kết thúc</TableCell>
                  <TableCell align="center">Khu vực</TableCell>
                  <TableCell align="center"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {shifts.map((shift: any, index:any) => (
                  <TableRow key={shift.id}>
                    <TableCell align="center">{(pageNumber - 1) * pageSize + index + 1}</TableCell>
                    <TableCell align="center">{shift.shiftName}</TableCell>
                    <TableCell align="center">{shift.startTime}</TableCell>
                    <TableCell align="center">{shift.endTime}</TableCell>
                    <TableCell align="center">{shift.categoryName}</TableCell>
                    <TableCell align="center">
                      <IconButton onClick={(e) => handleMenuClick(e, shift)}>
                        <MoreVertIcon />
                      </IconButton>
                      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={handleMenuClose} disabled={!selectedGroup}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <EditIcon fontSize="small" />
                            {selectedGroup ? (
                              <Typography sx={{ marginLeft: 1 }}>
                                <Link href={`/dashboard/room-group/edit/${selectedGroup}`} sx={{ display: 'flex', color: 'black' }} underline="none">
                                  Chỉnh sửa
                                </Link>
                              </Typography>
                            ) : (
                              <Typography sx={{ marginLeft: 1, color: 'black' }}>Chỉnh sửa</Typography>
                            )}
                          </Box>
                        </MenuItem>
                        <MenuItem onClick={handleMenuClose} disabled={!selectedGroup}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <VisibilityIcon fontSize="small" />
                            {selectedGroup ? (
                              <Typography sx={{ marginLeft: 1 }}>
                                <Link href={`/dashboard/room-group/detail/${selectedGroup}`} sx={{ display: 'flex', color: 'black' }} underline="none">
                                  Xem chi tiết
                                </Link>
                              </Typography>
                            ) : (
                              <Typography sx={{ marginLeft: 1, color: 'black' }}>Xem chi tiết</Typography>
                            )}
                          </Box>
                        </MenuItem>
                      </Menu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6}>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                      <Pagination
                        count={totalPages}  // Tổng số trang
                        page={pageNumber}  // Trang hiện tại
                        onChange={handlePageChange}  // Khi trang thay đổi
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </TableContainer>
        </>
      ) : (
        <Typography>Không có ca làm cho khu vực.</Typography>
      )}

    </Container>
  );
}
