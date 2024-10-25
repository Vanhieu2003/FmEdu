'use client';

import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { useSettingsContext } from 'src/components/settings';
import {
  Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem, Link, Pagination, TableFooter, Select, MenuItem as MuiMenuItem, TextField,
  Autocomplete
} from '@mui/material';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ShiftService from 'src/@core/service/shift';
import RoomCategoryService from 'src/@core/service/RoomCategory';

export default function ShiftListView() {
  const settings = useSettingsContext();
  const [shifts, setShifts] = useState<any>([]);
  const [filteredShifts, setFilteredShifts] = useState<any>([]); 
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState(false);
  
  const [selectedArea, setSelectedArea] = useState<any>(''); 
  const [areas, setAreas] = useState<any[]>([]); 
  const [searchShiftName, setSearchShiftName] = useState<string>('');
  const [debounceTimeout, setDebounceTimeout] = useState<any>(null); 

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, group: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group.id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  useEffect(() => {
    const fetchAreas = async () => {
      try {
        const response = await RoomCategoryService.getAllRoomCategory(); 
        setAreas(response.data); 
      } catch (error: any) {
        console.error('Lỗi khi tải danh sách khu vực:', error);
      }
    };
    fetchAreas();
  }, []);

  
  useEffect(() => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout); 
    }

    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await ShiftService.getAllShifts(pageNumber, pageSize, searchShiftName, selectedArea);
        setShifts(response.data.shifts);
        setTotalPages(Math.ceil(response.data.totalRecords / pageSize));
      } catch (error: any) {
        console.error('Lỗi khi tải dữ liệu ca làm:', error);
      } finally {
        setLoading(false);
      }
    }, 500); 

    setDebounceTimeout(timeout); 

    return () => clearTimeout(timeout); 
  }, [searchShiftName, selectedArea, pageNumber]);

  useEffect(() => {
    const filtered = shifts.filter((shift: any) => 
      shift.shiftName.toLowerCase().includes(searchShiftName.toLowerCase())
    );
    setFilteredShifts(filtered);
  }, [shifts, searchShiftName]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Typography variant="h4">Danh sách ca làm việc</Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
  <Autocomplete
    value={selectedArea}
    onChange={(event, newValue) => {
      setSelectedArea(newValue);
    }}
    options={areas
      .filter((area) => area.categoryName.trim() !== '') 
      .map((area) => area.categoryName.trim() || 'Khu vực không tên')} 
    renderInput={(params) => (
      <TextField {...params} label="Chọn khu vực" variant="outlined" />
    )}
    sx={{ minWidth: 200 }}
  />

  <TextField
    variant="outlined"
    placeholder="Tìm kiếm theo tên ca"
    size="small"
    value={searchShiftName}
    onChange={(e) => setSearchShiftName(e.target.value)}
    sx={{ minWidth: 300 }} 
  />
</Box>

      {loading ? (
        <Typography>Đang tải dữ liệu...</Typography>
      ) : filteredShifts.length > 0 ? (
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
              {filteredShifts.map((shift: any, index: any) => (
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
                          <Typography sx={{ marginLeft: 1 }}>
                            <Link href={`/dashboard/room-group/edit/${selectedGroup}`} sx={{ display: 'flex', color: 'black' }} underline="none">
                              Chỉnh sửa
                            </Link>
                          </Typography>
                        </Box>
                      </MenuItem>
                      <MenuItem onClick={handleMenuClose} disabled={!selectedGroup}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" />
                          <Typography sx={{ marginLeft: 1 }}>
                            <Link href={`/dashboard/room-group/detail/${selectedGroup}`} sx={{ display: 'flex', color: 'black' }} underline="none">
                              Xem chi tiết
                            </Link>
                          </Typography>
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
                        count={totalPages}  
                        page={pageNumber} 
                        onChange={handlePageChange}  
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </TableCell>
                </TableRow>
              </TableFooter>
          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có dữ liệu nào.</Typography>
      )}
    </Container>
  );
}