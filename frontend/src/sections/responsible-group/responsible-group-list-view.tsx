'use client';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useRouter } from 'next/navigation'; // Thêm hook useRouter
import { useSettingsContext } from 'src/components/settings';
import {
  Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead,
  TableBody, Button, IconButton, Menu, MenuItem,
  Link
} from '@mui/material';
import CampusService from 'src/@core/service/campus';
import { useEffect, useState } from 'react';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ResponsibleGroupRoomService from 'src/@core/service/responsiblegroup';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

// ----------------------------------------------------------------------

export default function ResponsibleGroupListView() {
  const router = useRouter(); // Dùng useRouter để điều hướng
  const settings = useSettingsContext();
  const [campus, setCampus] = useState<any[]>([]);
  const [responsibleGroups, setResponsibleGroups] = useState<any[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);




  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>, group: any) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(group.id); // Gán nhóm đang chọn
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  useEffect(() => {
    const fetchCampus = async () => {
      try {
        const response: any = await CampusService.getAllCampus();
        setCampus(response.data);
      } catch (error: any) {
        console.error('Error fetching campus data:', error);
      }
    };

    const fetchGroupRoom = async () => {
      try {
        const response: any = await ResponsibleGroupRoomService.getAll();
        setResponsibleGroups(response.data);
      } catch (error: any) {
        console.error('Error fetching Room Group data:', error);
      }
    };

    // Gọi cả hai hàm song song
    fetchCampus();
    fetchGroupRoom();

  }, []);



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách nhóm người chịu trách nhiệm</Typography>
      </Box>

      {/* Autocomplete để chọn campus */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginBottom: 3 }}
          // onChange={null}
          renderInput={(params: any) => <TextField {...params} label="Chọn Campus" />}
        />
      </Box>

      {/* Hiển thị báo cáo khối */}
      {responsibleGroups.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Nhóm chịu trách nhiệm</TableCell>
                <TableCell align="center">Mô tả</TableCell>
                <TableCell align="center">Số lượng người</TableCell>
                <TableCell align="center">Màu</TableCell>
                <TableCell align="center"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {responsibleGroups.map((responsibleGroup: any, index) => (
                <TableRow key={`${responsibleGroup.id}-${index}`}>
                  <TableCell align="center">{index + 1}</TableCell>
                  <TableCell align="center">{responsibleGroup.groupName}</TableCell>
                  <TableCell align="center">{responsibleGroup.description}</TableCell>
                  <TableCell align="center">{responsibleGroup.numberOfUser}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        borderRadius: '50%',
                        backgroundColor: responsibleGroup.color,
                        border: '1px solid black',
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton onClick={(e) => handleMenuClick(e, responsibleGroup)}>
                      <MoreVertIcon />
                    </IconButton>
                    {/* Menu cho các lựa chọn */}
                    <Menu
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={handleMenuClose}
                    >
                      <MenuItem
                        onClick={handleMenuClose}
                        disabled={!selectedGroup}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <EditIcon fontSize="small" />
                          {selectedGroup ? (
                            <Typography sx={{ marginLeft: 1 }}>
                              <Link
                                href={`/dashboard/responsible-group/edit/${selectedGroup}`}
                                sx={{ display: 'flex', color: 'black' }}  // Đặt màu đen
                                underline="none"
                              >
                                Chỉnh sửa
                              </Link>
                            </Typography>
                          ) : (
                            <Typography sx={{ marginLeft: 1, color: 'black' }}>Chỉnh sửa</Typography>
                          )}
                        </Box>
                      </MenuItem>

                      <MenuItem
                        onClick={handleMenuClose}
                        disabled={!selectedGroup}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <VisibilityIcon fontSize="small" />
                          {selectedGroup ? (
                            <Typography sx={{ marginLeft: 1 }}>
                              <Link
                                href={`/dashboard/responsible-group/detail/${selectedGroup}`}
                                sx={{ display: 'flex', color: 'black' }}  // Đặt màu đen
                                underline="none"
                              >
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
          </Table>
        </TableContainer>
      ) : (
        <Typography>Không có nhóm chịu trách nhiệm nào.</Typography>
      )}
    </Container>
  );
}
