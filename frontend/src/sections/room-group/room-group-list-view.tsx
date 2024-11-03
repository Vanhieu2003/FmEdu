'use client';

import Box from '@mui/material/Box';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';

import { useSettingsContext } from 'src/components/settings';
import {
  Autocomplete, TextField, Paper, Table, TableCell, TableContainer, TableRow, TableHead, TableBody,
  IconButton, Menu, MenuItem,
  Link,
  TableFooter,
  Pagination,
  Collapse
} from '@mui/material';
import CampusService from 'src/@core/service/campus';
import { useEffect, useState } from 'react';
import GroupRoomService from 'src/@core/service/grouproom';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CollapsibleRoomGroup from '../components/table/RoomGroup/CollapsibleRoomGroup';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import React from 'react';

// ----------------------------------------------------------------------

export default function RoomGroupListView() {
  const settings = useSettingsContext();
  const [campus, setCampus] = useState<any[]>([]);
  const [groupRooms, setGroupRooms] = useState<any[]>([]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);

  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);

  const [openRow, setOpenRow] = useState(null);

  const handleRowClick = (rowId: any) => {
    setOpenRow(openRow === rowId ? null : rowId);
  };




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
        const response: any = await GroupRoomService.getAllGroupRooms(pageNumber, pageSize);
        setGroupRooms(response.data.roomGroups);
        setTotalPages(Math.ceil(response.data.totalRecords / pageSize));
      } catch (error: any) {
        console.error('Error fetching Room Group data:', error);
      }
    };

    // Gọi cả hai hàm song song
    fetchCampus();
    fetchGroupRoom();

  }, [pageNumber]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPageNumber(newPage);
  };



  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>

      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h4">Danh sách nhóm phòng</Typography>

      </Box>

      {/* Autocomplete để chọn campus */}
      <Box sx={{ display: 'flex', gap: 2, marginBottom: 3 }}>
        <Autocomplete
          disablePortal
          options={campus}
          getOptionLabel={(option: any) => option.campusName || ''}
          sx={{ width: 300, marginBottom: 3 }}
          // onChange={null}
          renderInput={(params: any) => <TextField {...params} label="Chọn cơ sở" />}
        />
      </Box>

      {/* Hiển thị báo cáo khối */}
      {groupRooms.length > 0 ? (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="center">STT</TableCell>
                <TableCell align="center">Cơ sở</TableCell>
                <TableCell align="center">Nhóm phòng</TableCell>
                <TableCell align="center">Mô tả </TableCell>
                <TableCell align="center">Số lượng phòng</TableCell>
                <TableCell align='center'></TableCell>

              </TableRow>
            </TableHead>
            <TableBody>
              {groupRooms.map((groupRoom: any, index) => (
                <React.Fragment key={groupRoom.id}>
                  <TableRow key={groupRoom.id}>
                    <TableCell align="center">{index + 1}</TableCell>
                    <TableCell align="center">{groupRoom.campusName}</TableCell>
                    <TableCell align="center">{groupRoom.groupName}</TableCell>
                    <TableCell align="center">{groupRoom.description}</TableCell>
                    <TableCell align="center">{groupRoom.numberOfRoom}</TableCell>
                    <TableCell align='right'>
                      <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => handleRowClick(groupRoom.id)}
                      >
                        {openRow === groupRoom.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={6} style={{ paddingBottom: 0, paddingTop: 0 }}>
                      <Collapse in={openRow === groupRoom.id} timeout="auto" unmountOnExit>
                        <Box margin={1}>
                          <CollapsibleRoomGroup id={groupRoom.id}></CollapsibleRoomGroup>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>

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
        <Typography>Không có báo cáo nào cho campus này.</Typography>
      )}
    </Container>
  );
}
